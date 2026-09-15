package mail_boxes

import (
	context "context"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	mailboxv1 "billionmail-core/api/mail_boxes/v1"
	"billionmail-core/internal/service/public"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/google/uuid"
)

const (
	ArchiveStatusPending       = "pending"
	ArchiveStatusArchiving     = "archiving"
	ArchiveStatusArchived      = "archived"
	ArchiveStatusArchiveFailed = "archive_failed"
	ArchiveStatusRestoring     = "restoring"
	ArchiveStatusRestoreFailed = "restore_failed"
	ArchiveStatusPurging       = "purging"
	ArchiveStatusPurgeFailed   = "purge_failed"

	RecycleRetention    = 30 * 24 * time.Hour
	lifecycleStaleAfter = 10 * time.Minute
)

var validRecycleStatuses = map[string]struct{}{
	ArchiveStatusPending: {}, ArchiveStatusArchiving: {}, ArchiveStatusArchived: {},
	ArchiveStatusArchiveFailed: {}, ArchiveStatusRestoring: {}, ArchiveStatusRestoreFailed: {},
	ArchiveStatusPurging: {}, ArchiveStatusPurgeFailed: {},
}

var (
	errLifecycleLeaseLost  = errors.New("mailbox lifecycle operation ownership changed")
	errLifecycleNotClaimed = errors.New("mailbox lifecycle item was not claimed")
)

func mailboxUpdateBlockingRecycleStatuses() []string {
	return []string{ArchiveStatusPending, ArchiveStatusArchiving, ArchiveStatusArchiveFailed}
}

func restoreStartRecycleStatuses() []string {
	return []string{ArchiveStatusArchived, ArchiveStatusRestoreFailed}
}

func purgeStartRecycleStatuses() []string {
	return []string{ArchiveStatusArchived, ArchiveStatusPurgeFailed}
}

func staleLifecycleStatuses() []string {
	return []string{ArchiveStatusArchiving, ArchiveStatusRestoring, ArchiveStatusPurging}
}

func lifecycleLeaseIsStale(statusUpdatedAt, cutoff time.Time) bool {
	return !statusUpdatedAt.After(cutoff)
}

func recycleStateAllowed(status string, allowed []string) bool {
	for _, state := range allowed {
		if status == state {
			return true
		}
	}
	return false
}

func sameLifecycleLease(a, b time.Time) bool {
	return !a.IsZero() && !b.IsZero() && a.UnixMicro() == b.UnixMicro()
}

func mailboxVersionMatchesRecycleItem(mailbox *mailboxv1.Mailbox, item *RecycleItem) bool {
	return mailbox != nil && item != nil && mailbox.Username != "" &&
		mailbox.Username == item.Username && mailbox.CreateTime == item.CreateTime &&
		mailbox.UpdateTime == item.UpdateTime && mailbox.Maildir == item.Maildir
}

// ArchiveOptions describes why a mailbox is being archived. File operations are
// intentionally performed after the database transaction commits.
type ArchiveOptions struct {
	DeleteReason              string
	DeleteSource              string
	KeepDisabledOnFailure     bool
	RelatedActivationKeyID    *int64
	ActivationKeycodeSnapshot string
}

// RecycleItem is the complete, private mailbox snapshot plus archive metadata.
// Password and PasswordEncode retain their existing stored values; neither is
// exposed by the recycle list API.
type RecycleItem struct {
	ID                        int64      `json:"id"`
	ArchiveUUID               string     `json:"archive_uuid"`
	Username                  string     `json:"username"`
	Password                  string     `json:"-"`
	PasswordEncode            string     `json:"-"`
	FullName                  string     `json:"-"`
	IsAdmin                   int        `json:"-"`
	Maildir                   string     `json:"-"`
	Quota                     int64      `json:"-"`
	LocalPart                 string     `json:"-"`
	Domain                    string     `json:"-"`
	CreateTime                int64      `json:"-"`
	UpdateTime                int64      `json:"-"`
	Active                    int        `json:"-"`
	UsedQuota                 int64      `json:"-"`
	QuotaActive               int        `json:"-"`
	ExpiresAt                 *time.Time `json:"-"`
	SourceType                string     `json:"source_type"`
	ActivationKeyID           *int64     `json:"-"`
	RelatedActivationKeyID    *int64     `json:"-"`
	ActivationKeycodeSnapshot string     `json:"activation_keycode_snapshot"`
	OriginalMaildirPath       string     `json:"-"`
	ArchivePath               string     `json:"-"`
	MailSizeBytes             int64      `json:"mail_size_bytes"`
	FileCount                 int64      `json:"file_count"`
	ArchiveStatus             string     `json:"archive_status"`
	DeletedAt                 time.Time  `json:"deleted_at"`
	PurgeAt                   time.Time  `json:"purge_at"`
	DeleteReason              string     `json:"delete_reason"`
	DeleteSource              string     `json:"-"`
	LastError                 string     `json:"last_error"`
	StatusUpdatedAt           time.Time  `json:"-"`
	RestoredAt                *time.Time `json:"-"`
}

type RecycleListItem struct {
	ID                        int64     `json:"id"`
	Username                  string    `json:"username"`
	SourceType                string    `json:"source_type"`
	ActivationKeycodeSnapshot string    `json:"activation_keycode_snapshot"`
	DeletedAt                 time.Time `json:"deleted_at"`
	PurgeAt                   time.Time `json:"purge_at"`
	MailSizeBytes             int64     `json:"mail_size_bytes"`
	FileCount                 int64     `json:"file_count"`
	ArchiveStatus             string    `json:"archive_status"`
	DeleteReason              string    `json:"delete_reason"`
	LastError                 string    `json:"last_error"`
}

type RecycleListResult struct {
	Total    int               `json:"total"`
	Page     int               `json:"page"`
	PageSize int               `json:"page_size"`
	List     []RecycleListItem `json:"list"`
}

type RecycleStats struct {
	TotalItems     int64  `json:"total_items"`
	TotalBytes     int64  `json:"total_bytes"`
	DiskTotalBytes uint64 `json:"disk_total_bytes"`
	DiskFreeBytes  uint64 `json:"disk_free_bytes"`
	PendingItems   int64  `json:"pending_items"`
	FailedItems    int64  `json:"failed_items"`
}

type RecycleMutationResult struct {
	Succeeded int `json:"succeeded"`
	Failed    int `json:"failed"`
}

func lifecycleRoots() (vmailRoot, recycleRoot string) {
	vmailRoot = public.AbsPath("../vmail-data")
	// Keep recycled Maildirs under the same mounted filesystem as active
	// Maildirs. This makes rename atomic, avoids EXDEV across bind mounts, and
	// ensures the existing vmail backup includes recycle data.
	recycleRoot = filepath.Join(vmailRoot, ".jesusmail-recycle")
	return vmailRoot, recycleRoot
}

func normalizeArchiveOptions(opts ArchiveOptions) ArchiveOptions {
	opts.DeleteReason = strings.TrimSpace(opts.DeleteReason)
	if opts.DeleteReason == "" {
		opts.DeleteReason = "manual_delete"
	}
	opts.DeleteSource = strings.TrimSpace(opts.DeleteSource)
	if opts.DeleteSource == "" {
		opts.DeleteSource = "admin"
	}
	if len(opts.DeleteReason) > 64 {
		opts.DeleteReason = opts.DeleteReason[:64]
	}
	if len(opts.DeleteSource) > 32 {
		opts.DeleteSource = opts.DeleteSource[:32]
	}
	if len(opts.ActivationKeycodeSnapshot) > 32 {
		opts.ActivationKeycodeSnapshot = opts.ActivationKeycodeSnapshot[:32]
	}
	return opts
}

func validatePathComponent(name, value string) error {
	if value == "" || value == "." || value == ".." || strings.TrimSpace(value) != value {
		return fmt.Errorf("invalid %s", name)
	}
	if strings.ContainsRune(value, '\x00') || strings.ContainsAny(value, `/\\`) || filepath.IsAbs(value) {
		return fmt.Errorf("invalid %s", name)
	}
	return nil
}

func pathWithinRoot(root, candidate string) error {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return fmt.Errorf("resolve root: %w", err)
	}
	candidateAbs, err := filepath.Abs(candidate)
	if err != nil {
		return fmt.Errorf("resolve candidate: %w", err)
	}
	rel, err := filepath.Rel(rootAbs, candidateAbs)
	if err != nil {
		return fmt.Errorf("compare path with root: %w", err)
	}
	if rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) || filepath.IsAbs(rel) {
		return errors.New("path escapes configured root")
	}
	return nil
}

func resolveMailboxPath(vmailRoot string, item *RecycleItem) (string, error) {
	if item == nil {
		return "", errors.New("mailbox snapshot is nil")
	}
	if err := validatePathComponent("local part", item.LocalPart); err != nil {
		return "", err
	}
	if err := validatePathComponent("domain", item.Domain); err != nil {
		return "", err
	}
	expectedUsername := item.LocalPart + "@" + item.Domain
	if item.Username != expectedUsername {
		return "", errors.New("mailbox username does not match local part and domain")
	}
	if strings.ContainsRune(item.Maildir, '\x00') || strings.Contains(item.Maildir, `\`) || filepath.IsAbs(item.Maildir) {
		return "", errors.New("invalid mailbox maildir")
	}
	if item.Maildir != expectedUsername+"/" {
		return "", errors.New("mailbox maildir does not match username")
	}
	rootAbs, err := filepath.Abs(vmailRoot)
	if err != nil {
		return "", fmt.Errorf("resolve vmail root: %w", err)
	}
	candidate := filepath.Join(rootAbs, item.Domain, item.LocalPart)
	if err := pathWithinRoot(rootAbs, candidate); err != nil {
		return "", err
	}
	return candidate, nil
}

func resolveArchivePath(recycleRoot, archiveUUID, storedPath string) (string, error) {
	parsed, err := uuid.Parse(archiveUUID)
	if err != nil || parsed.String() != strings.ToLower(archiveUUID) {
		return "", errors.New("invalid archive UUID")
	}
	rootAbs, err := filepath.Abs(recycleRoot)
	if err != nil {
		return "", fmt.Errorf("resolve recycle root: %w", err)
	}
	expected := filepath.Join(rootAbs, parsed.String(), "maildir")
	if err := pathWithinRoot(rootAbs, expected); err != nil {
		return "", err
	}
	if storedPath != "" {
		storedAbs, absErr := filepath.Abs(storedPath)
		if absErr != nil || filepath.Clean(storedAbs) != expected {
			return "", errors.New("stored archive path does not match archive UUID")
		}
	}
	return expected, nil
}

func validateExistingDirectory(root, path string) error {
	info, err := os.Lstat(path)
	if err != nil {
		return err
	}
	if info.Mode()&os.ModeSymlink != 0 {
		return errors.New("directory cannot be a symbolic link")
	}
	if !info.IsDir() {
		return errors.New("mail storage path is not a directory")
	}
	canonicalRoot, err := filepath.EvalSymlinks(root)
	if err != nil {
		return fmt.Errorf("resolve configured root: %w", err)
	}
	canonicalPath, err := filepath.EvalSymlinks(path)
	if err != nil {
		return fmt.Errorf("resolve mail storage path: %w", err)
	}
	return pathWithinRoot(canonicalRoot, canonicalPath)
}

func pathExistence(path string) (bool, error) {
	_, err := os.Lstat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

func countMailTree(path string) (size, count int64, err error) {
	err = filepath.WalkDir(path, func(current string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			return nil
		}
		info, infoErr := entry.Info()
		if infoErr != nil {
			return infoErr
		}
		size += info.Size()
		count++
		return nil
	})
	return
}

func moveMailboxToArchive(vmailRoot, recycleRoot string, item *RecycleItem) (int64, int64, error) {
	source, err := resolveMailboxPath(vmailRoot, item)
	if err != nil {
		return 0, 0, err
	}
	target, err := resolveArchivePath(recycleRoot, item.ArchiveUUID, item.ArchivePath)
	if err != nil {
		return 0, 0, err
	}
	sourceExists, err := pathExistence(source)
	if err != nil {
		return 0, 0, fmt.Errorf("inspect mailbox source: %w", err)
	}
	targetExists, err := pathExistence(target)
	if err != nil {
		return 0, 0, fmt.Errorf("inspect archive target: %w", err)
	}
	if sourceExists && targetExists {
		return 0, 0, errors.New("mailbox source and archive target both exist")
	}
	if !sourceExists && !targetExists {
		// A mailbox can legitimately have no Maildir yet (for example, it has
		// never received mail or storage initialization previously failed). Keep
		// a restorable empty archive instead of blocking deletion.
		if err := os.MkdirAll(target, 0o750); err != nil {
			return 0, 0, fmt.Errorf("create empty mailbox archive: %w", err)
		}
		targetExists = true
	}
	if sourceExists {
		if err := validateExistingDirectory(vmailRoot, source); err != nil {
			return 0, 0, fmt.Errorf("validate mailbox source: %w", err)
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o750); err != nil {
			return 0, 0, fmt.Errorf("create archive directory: %w", err)
		}
		if err := validateExistingDirectory(recycleRoot, filepath.Dir(target)); err != nil {
			return 0, 0, fmt.Errorf("validate archive directory: %w", err)
		}
		if err := os.Rename(source, target); err != nil {
			// A concurrent retry may have completed the same rename.
			sourceAfter, sourceErr := pathExistence(source)
			targetAfter, targetErr := pathExistence(target)
			if sourceErr != nil || targetErr != nil || sourceAfter || !targetAfter {
				return 0, 0, fmt.Errorf("archive mailbox storage: %w", err)
			}
		}
	}
	if err := validateExistingDirectory(recycleRoot, target); err != nil {
		return 0, 0, fmt.Errorf("validate archived mailbox: %w", err)
	}
	size, count, err := countMailTree(target)
	if err != nil {
		return 0, 0, fmt.Errorf("measure archived mailbox: %w", err)
	}
	return size, count, nil
}

func moveArchiveToMailbox(vmailRoot, recycleRoot string, item *RecycleItem) error {
	source, err := resolveArchivePath(recycleRoot, item.ArchiveUUID, item.ArchivePath)
	if err != nil {
		return err
	}
	target, err := resolveMailboxPath(vmailRoot, item)
	if err != nil {
		return err
	}
	sourceExists, err := pathExistence(source)
	if err != nil {
		return fmt.Errorf("inspect archive source: %w", err)
	}
	targetExists, err := pathExistence(target)
	if err != nil {
		return fmt.Errorf("inspect mailbox target: %w", err)
	}
	if sourceExists && targetExists {
		return errors.New("archive source and mailbox target both exist")
	}
	if !sourceExists && !targetExists {
		return errors.New("archive source and mailbox target are both missing")
	}
	if sourceExists {
		if err := validateExistingDirectory(recycleRoot, source); err != nil {
			return fmt.Errorf("validate archive source: %w", err)
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return fmt.Errorf("create mailbox parent directory: %w", err)
		}
		if err := validateExistingDirectory(vmailRoot, filepath.Dir(target)); err != nil {
			return fmt.Errorf("validate mailbox parent directory: %w", err)
		}
		if err := os.Rename(source, target); err != nil {
			sourceAfter, sourceErr := pathExistence(source)
			targetAfter, targetErr := pathExistence(target)
			if sourceErr != nil || targetErr != nil || sourceAfter || !targetAfter {
				return fmt.Errorf("restore mailbox storage: %w", err)
			}
		}
	}
	return validateExistingDirectory(vmailRoot, target)
}

func safeLifecycleError(err error) string {
	if err == nil {
		return ""
	}
	message := err.Error()
	vmailRoot, recycleRoot := lifecycleRoots()
	message = strings.ReplaceAll(message, vmailRoot, "<vmail-root>")
	message = strings.ReplaceAll(message, recycleRoot, "<recycle-root>")
	if len(message) > 1000 {
		message = message[:1000]
	}
	return message
}

func recycleInsertData(item *RecycleItem) g.Map {
	return g.Map{
		"archive_uuid": item.ArchiveUUID, "username": item.Username,
		"password": item.Password, "password_encode": item.PasswordEncode,
		"full_name": item.FullName, "is_admin": item.IsAdmin, "maildir": item.Maildir,
		"quota": item.Quota, "local_part": item.LocalPart, "domain": item.Domain,
		"create_time": item.CreateTime, "update_time": item.UpdateTime, "active": item.Active,
		"used_quota": item.UsedQuota, "quota_active": item.QuotaActive,
		"expires_at": item.ExpiresAt, "source_type": item.SourceType,
		"activation_key_id":           item.ActivationKeyID,
		"related_activation_key_id":   item.RelatedActivationKeyID,
		"activation_keycode_snapshot": item.ActivationKeycodeSnapshot,
		"original_maildir_path":       item.OriginalMaildirPath, "archive_path": item.ArchivePath,
		"mail_size_bytes": item.MailSizeBytes, "file_count": item.FileCount,
		"archive_status": item.ArchiveStatus, "deleted_at": item.DeletedAt,
		"purge_at": item.PurgeAt, "delete_reason": item.DeleteReason,
		"delete_source": item.DeleteSource, "last_error": item.LastError,
		"status_updated_at": item.StatusUpdatedAt,
	}
}

func mailboxDataFromRecycle(item *RecycleItem, now time.Time) g.Map {
	active := item.Active
	if isMailboxExpired(item.ExpiresAt, now) {
		active = 0
	}
	return g.Map{
		"username": item.Username, "password": item.Password, "password_encode": item.PasswordEncode,
		"full_name": item.FullName, "is_admin": item.IsAdmin, "maildir": item.Maildir,
		"quota": item.Quota, "local_part": item.LocalPart, "domain": item.Domain,
		"create_time": item.CreateTime, "update_time": time.Now().Unix(), "active": active,
		"used_quota": item.UsedQuota, "quota_active": item.QuotaActive,
		"expires_at": item.ExpiresAt, "source_type": item.SourceType,
		"activation_key_id": item.ActivationKeyID,
	}
}

func itemFromMailbox(mailbox *mailboxv1.Mailbox, opts ArchiveOptions, now time.Time) (*RecycleItem, error) {
	archiveID := uuid.NewString()
	vmailRoot, recycleRoot := lifecycleRoots()
	item := &RecycleItem{
		ArchiveUUID: archiveID, Username: mailbox.Username, Password: mailbox.Password,
		PasswordEncode: mailbox.PasswordEncode, FullName: mailbox.FullName, IsAdmin: mailbox.IsAdmin,
		Maildir: mailbox.Maildir, Quota: mailbox.Quota, LocalPart: mailbox.LocalPart, Domain: mailbox.Domain,
		CreateTime: mailbox.CreateTime, UpdateTime: mailbox.UpdateTime, Active: mailbox.Active,
		UsedQuota: mailbox.UsedQuota, QuotaActive: mailbox.QuotaActive, ExpiresAt: mailbox.ExpiresAt,
		SourceType: mailbox.SourceType, ActivationKeyID: mailbox.ActivationKeyID,
		RelatedActivationKeyID:    opts.RelatedActivationKeyID,
		ActivationKeycodeSnapshot: opts.ActivationKeycodeSnapshot,
		ArchiveStatus:             ArchiveStatusArchiving, DeletedAt: now, PurgeAt: now.Add(RecycleRetention),
		DeleteReason: opts.DeleteReason, DeleteSource: opts.DeleteSource, StatusUpdatedAt: now,
	}
	if item.SourceType == "" {
		item.SourceType = "legacy"
	}
	if item.RelatedActivationKeyID == nil {
		item.RelatedActivationKeyID = item.ActivationKeyID
	}
	originalPath, err := resolveMailboxPath(vmailRoot, item)
	if err != nil {
		return nil, err
	}
	archivePath, err := resolveArchivePath(recycleRoot, archiveID, "")
	if err != nil {
		return nil, err
	}
	item.OriginalMaildirPath = originalPath
	item.ArchivePath = archivePath
	return item, nil
}

// PrepareArchiveInTx locks and disables a mailbox, then creates or reuses its
// recycle snapshot. It performs no filesystem operations.
func PrepareArchiveInTx(ctx context.Context, tx gdb.TX, email string, options ArchiveOptions) (*RecycleItem, error) {
	opts := normalizeArchiveOptions(options)
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return nil, errors.New("mailbox email is required")
	}

	var mailbox mailboxv1.Mailbox
	if err := tx.Model("mailbox").Ctx(ctx).Where("username", email).LockUpdate().Scan(&mailbox); err != nil {
		return nil, fmt.Errorf("lock mailbox: %w", err)
	}
	if mailbox.Username == "" {
		var existing RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("username", email).
			WhereIn("archive_status", []string{ArchiveStatusPending, ArchiveStatusArchiving, ArchiveStatusArchiveFailed, ArchiveStatusArchived}).
			OrderDesc("id").Limit(1).LockUpdate().Scan(&existing); err != nil {
			return nil, fmt.Errorf("find existing recycle item: %w", err)
		}
		if existing.ID != 0 {
			if existing.ArchiveStatus == ArchiveStatusArchived {
				return &existing, nil
			}
			return nil, fmt.Errorf("mailbox %s archive is already in state %s", email, existing.ArchiveStatus)
		}
		return nil, fmt.Errorf("mailbox %s does not exist", email)
	}

	var existing RecycleItem
	if err := tx.Model("mailbox_recycle_items").Ctx(ctx).
		Where("username", email).
		WhereIn("archive_status", []string{ArchiveStatusPending, ArchiveStatusArchiving, ArchiveStatusArchiveFailed}).
		OrderDesc("id").Limit(1).LockUpdate().Scan(&existing); err != nil {
		return nil, fmt.Errorf("find retryable recycle item: %w", err)
	}
	if existing.ID != 0 {
		if existing.ArchiveStatus != ArchiveStatusArchiveFailed {
			return nil, fmt.Errorf("mailbox %s archive is already in state %s", email, existing.ArchiveStatus)
		}
		if existing.CreateTime != mailbox.CreateTime || existing.UpdateTime != mailbox.UpdateTime || existing.Maildir != mailbox.Maildir {
			return nil, errors.New("existing recycle snapshot does not match current mailbox version")
		}
		result, err := tx.Model("mailbox").Ctx(ctx).
			Where("username", email).Where("create_time", mailbox.CreateTime).
			Where("update_time", mailbox.UpdateTime).Where("maildir", mailbox.Maildir).
			Data("active", 0).Update()
		if err != nil {
			return nil, fmt.Errorf("disable mailbox for archive retry: %w", err)
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return nil, fmt.Errorf("verify mailbox archive retry: %w", err)
		}
		if affected != 1 {
			return nil, errors.New("mailbox changed while preparing archive retry")
		}
		claimedAt := time.Now().UTC()
		update := g.Map{
			"archive_status": ArchiveStatusArchiving, "last_error": "",
			"status_updated_at": claimedAt, "delete_reason": opts.DeleteReason,
			"delete_source": opts.DeleteSource,
		}
		if opts.RelatedActivationKeyID != nil {
			update["related_activation_key_id"] = opts.RelatedActivationKeyID
			existing.RelatedActivationKeyID = opts.RelatedActivationKeyID
		}
		if opts.ActivationKeycodeSnapshot != "" {
			update["activation_keycode_snapshot"] = opts.ActivationKeycodeSnapshot
			existing.ActivationKeycodeSnapshot = opts.ActivationKeycodeSnapshot
		}
		result, err = tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", existing.ID).Where("archive_status", ArchiveStatusArchiveFailed).
			Data(update).Update()
		if err != nil {
			return nil, fmt.Errorf("prepare recycle retry: %w", err)
		}
		affected, err = result.RowsAffected()
		if err != nil {
			return nil, fmt.Errorf("verify recycle retry claim: %w", err)
		}
		if affected != 1 {
			return nil, errLifecycleLeaseLost
		}
		existing.ArchiveStatus = ArchiveStatusArchiving
		existing.LastError = ""
		existing.StatusUpdatedAt = claimedAt
		return &existing, nil
	}

	now := time.Now().UTC()
	item, err := itemFromMailbox(&mailbox, opts, now)
	if err != nil {
		return nil, fmt.Errorf("validate mailbox archive paths: %w", err)
	}
	result, err := tx.Model("mailbox").Ctx(ctx).
		Where("username", email).Where("create_time", mailbox.CreateTime).
		Where("update_time", mailbox.UpdateTime).Where("maildir", mailbox.Maildir).
		Data("active", 0).Update()
	if err != nil {
		return nil, fmt.Errorf("disable mailbox: %w", err)
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("verify mailbox disable: %w", err)
	}
	if affected != 1 {
		return nil, errors.New("mailbox changed while preparing archive")
	}
	item.ID, err = tx.Model("mailbox_recycle_items").Ctx(ctx).Data(recycleInsertData(item)).InsertAndGetId()
	if err != nil {
		return nil, fmt.Errorf("create mailbox recycle item: %w", err)
	}
	return item, nil
}

func markArchiveFailure(ctx context.Context, item *RecycleItem, keepDisabled bool, archiveErr error) error {
	if item == nil || item.ID == 0 {
		return archiveErr
	}
	message := safeLifecycleError(archiveErr)
	markErr := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Keep the same lock order as mailbox updates and archive preparation:
		// mailbox first, then its recycle item. This avoids a mailbox/recycle
		// deadlock while still failing closed if the mailbox version changed.
		var mailbox mailboxv1.Mailbox
		if err := tx.Model("mailbox").Ctx(ctx).Fields("username,create_time,update_time,maildir,active").
			Where("username", item.Username).LockUpdate().Scan(&mailbox); err != nil {
			return fmt.Errorf("lock mailbox for archive failure: %w", err)
		}

		var locked RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", item.ID).LockUpdate().Scan(&locked); err != nil {
			return fmt.Errorf("lock recycle item for archive failure: %w", err)
		}
		if locked.ID == 0 || locked.ArchiveStatus != ArchiveStatusArchiving || !sameLifecycleLease(locked.StatusUpdatedAt, item.StatusUpdatedAt) {
			return errLifecycleLeaseLost
		}
		if !mailboxVersionMatchesRecycleItem(&mailbox, item) {
			return errors.New("mailbox version changed or disappeared while recording archive failure")
		}

		active := archiveFailureActive(item.Active, keepDisabled)
		result, err := tx.Model("mailbox").Ctx(ctx).
			Where("username", item.Username).Where("create_time", item.CreateTime).
			Where("update_time", item.UpdateTime).Where("maildir", item.Maildir).
			Data("active", active).Update()
		if err != nil {
			return fmt.Errorf("restore mailbox state after archive failure: %w", err)
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("verify mailbox archive failure state: %w", err)
		}
		if affected != 1 {
			return errors.New("mailbox changed while recording archive failure")
		}

		result, err = tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", item.ID).Where("archive_status", ArchiveStatusArchiving).
			Data(g.Map{
				"archive_status": ArchiveStatusArchiveFailed, "last_error": message,
				"status_updated_at": time.Now().UTC(),
			}).Update()
		if err != nil {
			return fmt.Errorf("record recycle archive failure: %w", err)
		}
		affected, err = result.RowsAffected()
		if err != nil {
			return fmt.Errorf("verify recycle archive failure: %w", err)
		}
		if affected != 1 {
			return errLifecycleLeaseLost
		}
		return nil
	})
	if markErr != nil {
		return errors.Join(archiveErr, fmt.Errorf("record archive failure: %w", markErr))
	}
	return archiveErr
}

func archiveFailureActive(originalActive int, keepDisabled bool) int {
	if keepDisabled {
		return 0
	}
	return originalActive
}

// CompleteArchive moves mail data outside the database transaction and then
// finalizes the snapshot. A failed rename restores active for manual deletion;
// a failure after a successful rename always keeps the mailbox disabled.
func CompleteArchive(ctx context.Context, item *RecycleItem, keepDisabledOnFailure bool) error {
	if item == nil || item.ID == 0 {
		return errors.New("invalid recycle item")
	}
	if item.ArchiveStatus == ArchiveStatusArchived {
		return nil
	}
	if item.ArchiveStatus != ArchiveStatusArchiving || item.StatusUpdatedAt.IsZero() {
		return errors.New("recycle item is not claimed for archiving")
	}
	vmailRoot, recycleRoot := lifecycleRoots()
	size, count, err := moveMailboxToArchive(vmailRoot, recycleRoot, item)
	if err != nil {
		return markArchiveFailure(ctx, item, keepDisabledOnFailure, err)
	}
	finalErr := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		// Lock mailbox before recycle state everywhere that needs both rows. Apart
		// from preventing lock inversion, locking by username also prevents a
		// changed mailbox version from being mistaken for the archived snapshot.
		var mailbox mailboxv1.Mailbox
		if err := tx.Model("mailbox").Ctx(ctx).Fields("username,create_time,update_time,maildir,active").
			Where("username", item.Username).LockUpdate().Scan(&mailbox); err != nil {
			return fmt.Errorf("lock mailbox for archive finalization: %w", err)
		}

		var locked RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", item.ID).LockUpdate().Scan(&locked); err != nil {
			return fmt.Errorf("lock recycle item for finalization: %w", err)
		}
		if locked.ID == 0 {
			return errors.New("recycle item disappeared during archive")
		}
		if locked.ArchiveStatus == ArchiveStatusArchived {
			return nil
		}
		if locked.ArchiveStatus != ArchiveStatusArchiving || !sameLifecycleLease(locked.StatusUpdatedAt, item.StatusUpdatedAt) {
			return errLifecycleLeaseLost
		}
		if !mailboxVersionMatchesRecycleItem(&mailbox, item) || mailbox.Active != 0 {
			return errors.New("archived mailbox version changed, disappeared, or was re-enabled")
		}
		result, err := tx.Model("mailbox").Ctx(ctx).
			Where("username", item.Username).Where("create_time", item.CreateTime).
			Where("update_time", item.UpdateTime).Where("maildir", item.Maildir).Where("active", 0).
			Delete()
		if err != nil {
			return fmt.Errorf("delete archived mailbox row: %w", err)
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("verify archived mailbox deletion: %w", err)
		}
		if affected != 1 {
			return fmt.Errorf("archived mailbox version changed or disappeared: affected %d rows", affected)
		}
		result, err = tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", item.ID).Where("archive_status", ArchiveStatusArchiving).
			Data(g.Map{
				"archive_status": ArchiveStatusArchived, "mail_size_bytes": size, "file_count": count,
				"last_error": "", "status_updated_at": time.Now().UTC(),
			}).Update()
		if err != nil {
			return err
		}
		affected, err = result.RowsAffected()
		if err != nil {
			return fmt.Errorf("verify archive finalization: %w", err)
		}
		if affected != 1 {
			return errLifecycleLeaseLost
		}
		return nil
	})
	if finalErr != nil {
		if errors.Is(finalErr, errLifecycleLeaseLost) {
			return finalErr
		}
		return markArchiveFailure(ctx, item, true, finalErr)
	}
	item.ArchiveStatus = ArchiveStatusArchived
	item.MailSizeBytes = size
	item.FileCount = count
	return nil
}

func ArchiveMailbox(ctx context.Context, email string, opts ArchiveOptions) (*RecycleItem, error) {
	var item *RecycleItem
	err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var err error
		item, err = PrepareArchiveInTx(ctx, tx, email, opts)
		return err
	})
	if err != nil {
		return nil, err
	}
	if err := CompleteArchive(ctx, item, opts.KeepDisabledOnFailure); err != nil {
		return item, err
	}
	return item, nil
}

func ArchiveMailboxes(ctx context.Context, emails []string, opts ArchiveOptions) (int64, error) {
	seen := make(map[string]struct{}, len(emails))
	var archived int64
	var archiveErrors []error
	for _, raw := range emails {
		email := strings.ToLower(strings.TrimSpace(raw))
		if email == "" {
			continue
		}
		if _, ok := seen[email]; ok {
			continue
		}
		seen[email] = struct{}{}
		if _, err := ArchiveMailbox(ctx, email, opts); err != nil {
			archiveErrors = append(archiveErrors, fmt.Errorf("archive %s: %w", email, err))
			continue
		}
		archived++
	}
	return archived, errors.Join(archiveErrors...)
}

func isMailboxExpired(expiresAt *time.Time, now time.Time) bool {
	return expiresAt != nil && !expiresAt.After(now)
}

func ArchiveExpiredMailboxes(ctx context.Context, limit int) (int64, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	rows, err := g.DB().Model("mailbox").Ctx(ctx).
		Where("active", 1).Where("expires_at IS NOT NULL").WhereLTE("expires_at", time.Now().UTC()).
		OrderAsc("expires_at").Limit(limit).Array("username")
	if err != nil {
		return 0, fmt.Errorf("list expired mailboxes: %w", err)
	}
	emails := make([]string, 0, len(rows))
	for _, row := range rows {
		emails = append(emails, row.String())
	}
	return ArchiveMailboxes(ctx, emails, ArchiveOptions{
		DeleteReason: "expired", DeleteSource: "timer", KeepDisabledOnFailure: true,
	})
}

func ListRecycleItems(ctx context.Context, page, pageSize int, keyword, status string) (RecycleListResult, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}
	keyword = strings.TrimSpace(keyword)
	status = strings.TrimSpace(status)
	if status != "" {
		if _, ok := validRecycleStatuses[status]; !ok {
			return RecycleListResult{}, errors.New("invalid recycle status")
		}
	}
	query := g.DB().Model("mailbox_recycle_items").Ctx(ctx)
	if keyword != "" {
		query = query.WhereLike("username", "%"+keyword+"%")
	}
	if status != "" {
		query = query.Where("archive_status", status)
	}
	total, err := query.Count()
	if err != nil {
		return RecycleListResult{}, fmt.Errorf("count recycle items: %w", err)
	}
	rows := make([]RecycleListItem, 0)
	err = query.Fields("id,username,source_type,activation_keycode_snapshot,deleted_at,purge_at,mail_size_bytes,file_count,archive_status,delete_reason,last_error").
		OrderDesc("deleted_at").Page(page, pageSize).Scan(&rows)
	if err != nil {
		return RecycleListResult{}, fmt.Errorf("list recycle items: %w", err)
	}
	return RecycleListResult{Total: total, Page: page, PageSize: pageSize, List: rows}, nil
}

func nearestExistingPath(path string) (string, error) {
	current, err := filepath.Abs(path)
	if err != nil {
		return "", err
	}
	for {
		if _, statErr := os.Stat(current); statErr == nil {
			return current, nil
		} else if !os.IsNotExist(statErr) {
			return "", statErr
		}
		parent := filepath.Dir(current)
		if parent == current {
			return "", errors.New("no existing path for disk statistics")
		}
		current = parent
	}
}

func GetRecycleStats(ctx context.Context) (RecycleStats, error) {
	var stats RecycleStats
	err := g.DB().GetScan(ctx, &stats, `SELECT
		COUNT(*)::bigint AS total_items,
		COALESCE(SUM(mail_size_bytes), 0)::bigint AS total_bytes,
		COUNT(*) FILTER (WHERE archive_status IN ('pending','archiving','restoring','purging'))::bigint AS pending_items,
		COUNT(*) FILTER (WHERE archive_status IN ('archive_failed','restore_failed','purge_failed'))::bigint AS failed_items
		FROM mailbox_recycle_items`)
	if err != nil {
		return RecycleStats{}, fmt.Errorf("query recycle statistics: %w", err)
	}
	_, recycleRoot := lifecycleRoots()
	statPath, err := nearestExistingPath(recycleRoot)
	if err != nil {
		return RecycleStats{}, fmt.Errorf("resolve recycle disk: %w", err)
	}
	var stat syscall.Statfs_t
	if err := syscall.Statfs(statPath, &stat); err != nil {
		return RecycleStats{}, fmt.Errorf("read recycle disk statistics: %w", err)
	}
	stats.DiskTotalBytes = uint64(stat.Blocks) * uint64(stat.Bsize)
	stats.DiskFreeBytes = uint64(stat.Bavail) * uint64(stat.Bsize)
	return stats, nil
}

func loadRecycleItemForState(ctx context.Context, tx gdb.TX, id int64, states []string, nextState string) (*RecycleItem, error) {
	var item RecycleItem
	if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", id).LockUpdate().Scan(&item); err != nil {
		return nil, err
	}
	if item.ID == 0 {
		return nil, fmt.Errorf("recycle item %d does not exist", id)
	}
	if !recycleStateAllowed(item.ArchiveStatus, states) {
		return nil, fmt.Errorf("recycle item %d is in state %s", id, item.ArchiveStatus)
	}
	claimedAt := time.Now().UTC()
	result, err := tx.Model("mailbox_recycle_items").Ctx(ctx).
		Where("id", id).Where("archive_status", item.ArchiveStatus).
		Data(g.Map{
			"archive_status": nextState, "last_error": "", "status_updated_at": claimedAt,
		}).Update()
	if err != nil {
		return nil, err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("verify recycle operation claim: %w", err)
	}
	if affected != 1 {
		return nil, errLifecycleLeaseLost
	}
	item.ArchiveStatus = nextState
	item.LastError = ""
	item.StatusUpdatedAt = claimedAt
	return &item, nil
}

func markRecycleOperationFailure(ctx context.Context, item *RecycleItem, operationState, failureState string, operationErr error) error {
	if item == nil || item.ID == 0 {
		return operationErr
	}
	markErr := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var locked RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", item.ID).LockUpdate().Scan(&locked); err != nil {
			return err
		}
		if locked.ID == 0 || locked.ArchiveStatus != operationState || !sameLifecycleLease(locked.StatusUpdatedAt, item.StatusUpdatedAt) {
			return errLifecycleLeaseLost
		}
		result, err := tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", item.ID).Where("archive_status", operationState).
			Data(g.Map{
				"archive_status": failureState, "last_error": safeLifecycleError(operationErr),
				"status_updated_at": time.Now().UTC(),
			}).Update()
		if err != nil {
			return err
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}
		if affected != 1 {
			return errLifecycleLeaseLost
		}
		return nil
	})
	if markErr != nil {
		return errors.Join(operationErr, fmt.Errorf("record recycle operation failure: %w", markErr))
	}
	return operationErr
}

func restoreActivationBindingInTx(ctx context.Context, tx gdb.TX, item *RecycleItem, now time.Time) error {
	if item == nil || item.DeleteReason != "activation_clear_binding" {
		return nil
	}
	keyID := item.RelatedActivationKeyID
	if keyID == nil {
		keyID = item.ActivationKeyID
	}
	if keyID == nil || *keyID <= 0 {
		return errors.New("activation-bound mailbox recycle item has no activation key")
	}

	var key struct {
		ID     int64  `json:"id"`
		Status int    `json:"status"`
		Email  string `json:"email"`
	}
	if err := tx.Model("activation_keys").Ctx(ctx).Fields("id,status,email").
		Where("id", *keyID).LockUpdate().Scan(&key); err != nil {
		return fmt.Errorf("lock activation key for mailbox restore: %w", err)
	}
	if key.ID == 0 {
		return errors.New("activation key for mailbox restore no longer exists")
	}

	email := strings.TrimSpace(key.Email)
	if key.Status == 1 && strings.EqualFold(email, item.Username) {
		return nil
	}
	if key.Status != 0 || email != "" {
		return errors.New("activation key has already been assigned to another mailbox")
	}

	result, err := tx.Model("activation_keys").Ctx(ctx).
		Where("id", key.ID).Where("status", 0).
		Where("email IS NULL OR BTRIM(email) = ''").
		Data(g.Map{"status": 1, "email": item.Username, "used_at": now, "used_ip": nil}).Update()
	if err != nil {
		return fmt.Errorf("rebind activation key for mailbox restore: %w", err)
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("verify activation key rebind: %w", err)
	}
	if affected != 1 {
		return errors.New("activation key changed while restoring mailbox")
	}
	return nil
}

func restoreRecycleItem(ctx context.Context, id int64) error {
	var item *RecycleItem
	err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var err error
		item, err = loadRecycleItemForState(ctx, tx, id,
			restoreStartRecycleStatuses(), ArchiveStatusRestoring)
		if err != nil {
			return err
		}
		count, err := tx.Model("mailbox").Ctx(ctx).Where("username", item.Username).Count()
		if err != nil {
			return err
		}
		if count != 0 {
			return fmt.Errorf("mailbox %s already exists", item.Username)
		}
		return nil
	})
	if err != nil {
		return err
	}
	return completeRecycleRestore(ctx, item)
}

func completeRecycleRestore(ctx context.Context, item *RecycleItem) error {
	if item == nil || item.ID == 0 || item.ArchiveStatus != ArchiveStatusRestoring || item.StatusUpdatedAt.IsZero() {
		return errors.New("recycle item is not claimed for restore")
	}
	vmailRoot, recycleRoot := lifecycleRoots()
	if err := moveArchiveToMailbox(vmailRoot, recycleRoot, item); err != nil {
		return markRecycleOperationFailure(ctx, item, ArchiveStatusRestoring, ArchiveStatusRestoreFailed, err)
	}
	finalErr := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var locked RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", item.ID).LockUpdate().Scan(&locked); err != nil {
			return err
		}
		if locked.ID == 0 || locked.ArchiveStatus != ArchiveStatusRestoring || !sameLifecycleLease(locked.StatusUpdatedAt, item.StatusUpdatedAt) {
			return errLifecycleLeaseLost
		}
		now := time.Now().UTC()
		if err := restoreActivationBindingInTx(ctx, tx, &locked, now); err != nil {
			return err
		}
		if _, err := tx.Model("mailbox").Ctx(ctx).Data(mailboxDataFromRecycle(&locked, now)).Insert(); err != nil {
			return fmt.Errorf("restore mailbox row: %w", err)
		}
		result, err := tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", item.ID).Where("archive_status", ArchiveStatusRestoring).Delete()
		if err != nil {
			return fmt.Errorf("remove restored recycle item: %w", err)
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("verify restored recycle item removal: %w", err)
		}
		if affected != 1 {
			return errLifecycleLeaseLost
		}
		return nil
	})
	if finalErr != nil {
		if errors.Is(finalErr, errLifecycleLeaseLost) {
			return finalErr
		}
		// Best effort rollback of the file move. If it cannot be reversed, the
		// retry path recognizes source-present/target-missing and finalizes again.
		rollbackErr := moveMailboxToSpecificArchive(vmailRoot, recycleRoot, item)
		return markRecycleOperationFailure(ctx, item, ArchiveStatusRestoring, ArchiveStatusRestoreFailed, errors.Join(finalErr, rollbackErr))
	}
	_ = os.Remove(filepath.Dir(item.ArchivePath))
	return nil
}

func moveMailboxToSpecificArchive(vmailRoot, recycleRoot string, item *RecycleItem) error {
	source, err := resolveMailboxPath(vmailRoot, item)
	if err != nil {
		return err
	}
	target, err := resolveArchivePath(recycleRoot, item.ArchiveUUID, item.ArchivePath)
	if err != nil {
		return err
	}
	sourceExists, sourceErr := pathExistence(source)
	targetExists, targetErr := pathExistence(target)
	if sourceErr != nil || targetErr != nil {
		return errors.Join(sourceErr, targetErr)
	}
	if !sourceExists && targetExists {
		return nil
	}
	if !sourceExists || targetExists {
		return errors.New("cannot roll restored mailbox storage back safely")
	}
	if err := validateExistingDirectory(vmailRoot, source); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o750); err != nil {
		return err
	}
	return os.Rename(source, target)
}

func RestoreRecycleItems(ctx context.Context, ids []int64) (RecycleMutationResult, error) {
	return mutateRecycleItems(ctx, ids, restoreRecycleItem)
}

func safeRemoveArchive(item *RecycleItem) error {
	_, recycleRoot := lifecycleRoots()
	target, err := resolveArchivePath(recycleRoot, item.ArchiveUUID, item.ArchivePath)
	if err != nil {
		return err
	}
	archiveDir := filepath.Dir(target)
	exists, err := pathExistence(archiveDir)
	if err != nil {
		return err
	}
	if !exists {
		return nil
	}
	if err := validateExistingDirectory(recycleRoot, archiveDir); err != nil {
		return err
	}
	if targetExists, targetErr := pathExistence(target); targetErr != nil {
		return targetErr
	} else if targetExists {
		if err := validateExistingDirectory(recycleRoot, target); err != nil {
			return err
		}
	}
	return os.RemoveAll(archiveDir)
}

func purgeRecycleItem(ctx context.Context, id int64) error {
	var item *RecycleItem
	err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var err error
		item, err = loadRecycleItemForState(ctx, tx, id,
			purgeStartRecycleStatuses(), ArchiveStatusPurging)
		return err
	})
	if err != nil {
		return err
	}
	return completeRecyclePurge(ctx, item)
}

func completeRecyclePurge(ctx context.Context, item *RecycleItem) error {
	if item == nil || item.ID == 0 || item.ArchiveStatus != ArchiveStatusPurging || item.StatusUpdatedAt.IsZero() {
		return errors.New("recycle item is not claimed for purge")
	}
	if err := safeRemoveArchive(item); err != nil {
		return markRecycleOperationFailure(ctx, item, ArchiveStatusPurging, ArchiveStatusPurgeFailed, err)
	}
	if err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var locked RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", item.ID).LockUpdate().Scan(&locked); err != nil {
			return err
		}
		if locked.ID == 0 {
			return nil
		}
		if locked.ArchiveStatus != ArchiveStatusPurging || !sameLifecycleLease(locked.StatusUpdatedAt, item.StatusUpdatedAt) {
			return errLifecycleLeaseLost
		}
		result, err := tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", item.ID).Where("archive_status", ArchiveStatusPurging).Delete()
		if err != nil {
			return err
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}
		if affected != 1 {
			return errLifecycleLeaseLost
		}
		return nil
	}); err != nil {
		if errors.Is(err, errLifecycleLeaseLost) {
			return err
		}
		return markRecycleOperationFailure(ctx, item, ArchiveStatusPurging, ArchiveStatusPurgeFailed, err)
	}
	return nil
}

func PurgeRecycleItems(ctx context.Context, ids []int64) (RecycleMutationResult, error) {
	return mutateRecycleItems(ctx, ids, purgeRecycleItem)
}

func mutateRecycleItems(ctx context.Context, ids []int64, fn func(context.Context, int64) error) (RecycleMutationResult, error) {
	if len(ids) == 0 || len(ids) > 100 {
		return RecycleMutationResult{}, errors.New("select 1-100 recycle items")
	}
	seen := make(map[int64]struct{}, len(ids))
	var result RecycleMutationResult
	var mutationErrors []error
	for _, id := range ids {
		if id <= 0 {
			result.Failed++
			mutationErrors = append(mutationErrors, fmt.Errorf("invalid recycle item id %d", id))
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		if err := fn(ctx, id); err != nil {
			result.Failed++
			mutationErrors = append(mutationErrors, fmt.Errorf("recycle item %d: %w", id, err))
			continue
		}
		result.Succeeded++
	}
	return result, errors.Join(mutationErrors...)
}

func claimStaleLifecycleItem(ctx context.Context, id int64, expectedState string, cutoff time.Time) (*RecycleItem, error) {
	var claimed *RecycleItem
	err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var item RecycleItem
		if err := tx.Model("mailbox_recycle_items").Ctx(ctx).Where("id", id).LockUpdate().Scan(&item); err != nil {
			return err
		}
		if item.ID == 0 || item.ArchiveStatus != expectedState || !lifecycleLeaseIsStale(item.StatusUpdatedAt, cutoff) {
			return errLifecycleNotClaimed
		}
		claimedAt := time.Now().UTC()
		result, err := tx.Model("mailbox_recycle_items").Ctx(ctx).
			Where("id", id).Where("archive_status", expectedState).
			Data(g.Map{"status_updated_at": claimedAt}).Update()
		if err != nil {
			return err
		}
		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}
		if affected != 1 {
			return errLifecycleNotClaimed
		}
		item.StatusUpdatedAt = claimedAt
		claimed = &item
		return nil
	})
	return claimed, err
}

func completeClaimedLifecycleItem(ctx context.Context, item *RecycleItem) error {
	if item == nil {
		return errors.New("claimed lifecycle item is nil")
	}
	switch item.ArchiveStatus {
	case ArchiveStatusArchiving:
		return CompleteArchive(ctx, item, true)
	case ArchiveStatusRestoring:
		return completeRecycleRestore(ctx, item)
	case ArchiveStatusPurging:
		return completeRecyclePurge(ctx, item)
	default:
		return fmt.Errorf("unsupported stale lifecycle state %s", item.ArchiveStatus)
	}
}

// ReconcileStaleLifecycleItems reclaims lifecycle work whose lease has not been
// refreshed for ten minutes. Filesystem operations are idempotent, while the
// status timestamp prevents a second reconciler from taking the same item.
func ReconcileStaleLifecycleItems(ctx context.Context, limit int) (RecycleMutationResult, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	cutoff := time.Now().UTC().Add(-lifecycleStaleAfter)
	var candidates []struct {
		ID            int64  `json:"id"`
		ArchiveStatus string `json:"archive_status"`
	}
	if err := g.DB().Model("mailbox_recycle_items").Ctx(ctx).
		Fields("id,archive_status").
		WhereIn("archive_status", staleLifecycleStatuses()).
		WhereLTE("status_updated_at", cutoff).
		OrderAsc("status_updated_at").Limit(limit).Scan(&candidates); err != nil {
		return RecycleMutationResult{}, fmt.Errorf("list stale mailbox lifecycle items: %w", err)
	}

	var result RecycleMutationResult
	var reconcileErrors []error
	for _, candidate := range candidates {
		item, err := claimStaleLifecycleItem(ctx, candidate.ID, candidate.ArchiveStatus, cutoff)
		if errors.Is(err, errLifecycleNotClaimed) {
			continue
		}
		if err != nil {
			result.Failed++
			reconcileErrors = append(reconcileErrors, fmt.Errorf("claim stale recycle item %d: %w", candidate.ID, err))
			continue
		}
		if err := completeClaimedLifecycleItem(ctx, item); err != nil {
			result.Failed++
			reconcileErrors = append(reconcileErrors, fmt.Errorf("reconcile stale recycle item %d: %w", candidate.ID, err))
			continue
		}
		result.Succeeded++
	}
	return result, errors.Join(reconcileErrors...)
}

func CleanupExpiredRecycleItems(ctx context.Context, limit int) (RecycleMutationResult, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	rows, err := g.DB().Model("mailbox_recycle_items").Ctx(ctx).
		Where("archive_status", ArchiveStatusArchived).WhereLTE("purge_at", time.Now().UTC()).
		OrderAsc("purge_at").Limit(limit).Array("id")
	if err != nil {
		return RecycleMutationResult{}, fmt.Errorf("list expired recycle items: %w", err)
	}
	ids := make([]int64, 0, len(rows))
	for _, row := range rows {
		ids = append(ids, row.Int64())
	}
	if len(ids) == 0 {
		return RecycleMutationResult{}, nil
	}
	// Internal cleanup can process more than the public API's 100-ID batch.
	var total RecycleMutationResult
	var cleanupErrors []error
	for _, id := range ids {
		if err := purgeRecycleItem(ctx, id); err != nil {
			total.Failed++
			cleanupErrors = append(cleanupErrors, err)
		} else {
			total.Succeeded++
		}
	}
	return total, errors.Join(cleanupErrors...)
}
