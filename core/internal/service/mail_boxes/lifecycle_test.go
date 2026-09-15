package mail_boxes

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
)

func lifecycleTestItem(archiveID string) *RecycleItem {
	return &RecycleItem{
		ArchiveUUID: archiveID,
		Username:    "user@example.com",
		Maildir:     "user@example.com/",
		LocalPart:   "user",
		Domain:      "example.com",
	}
}

func TestResolveMailboxPathSanitizesDatabaseFields(t *testing.T) {
	root := t.TempDir()
	valid := lifecycleTestItem(uuid.NewString())
	got, err := resolveMailboxPath(root, valid)
	if err != nil {
		t.Fatalf("resolveMailboxPath() unexpected error: %v", err)
	}
	want := filepath.Join(root, "example.com", "user")
	if got != want {
		t.Fatalf("resolveMailboxPath() = %q, want %q", got, want)
	}

	tests := []struct {
		name   string
		mutate func(*RecycleItem)
	}{
		{name: "parent local part", mutate: func(item *RecycleItem) { item.LocalPart = ".." }},
		{name: "absolute local part", mutate: func(item *RecycleItem) { item.LocalPart = filepath.Join(string(filepath.Separator), "tmp") }},
		{name: "slash in domain", mutate: func(item *RecycleItem) { item.Domain = "example.com/other" }},
		{name: "backslash in domain", mutate: func(item *RecycleItem) { item.Domain = `example.com\\other` }},
		{name: "username mismatch", mutate: func(item *RecycleItem) { item.Username = "other@example.com" }},
		{name: "maildir mismatch", mutate: func(item *RecycleItem) { item.Maildir = "other@example.com/" }},
		{name: "absolute maildir", mutate: func(item *RecycleItem) { item.Maildir = filepath.Join(string(filepath.Separator), "tmp", "maildir") }},
		{name: "backslash maildir", mutate: func(item *RecycleItem) { item.Maildir = `user@example.com\\` }},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			item := lifecycleTestItem(uuid.NewString())
			tt.mutate(item)
			if _, err := resolveMailboxPath(root, item); err == nil {
				t.Fatal("resolveMailboxPath() error = nil, want rejection")
			}
		})
	}
}

func TestResolveArchivePathRequiresCanonicalUUIDPath(t *testing.T) {
	root := t.TempDir()
	archiveID := uuid.NewString()
	want := filepath.Join(root, archiveID, "maildir")

	got, err := resolveArchivePath(root, archiveID, want)
	if err != nil {
		t.Fatalf("resolveArchivePath() unexpected error: %v", err)
	}
	if got != want {
		t.Fatalf("resolveArchivePath() = %q, want %q", got, want)
	}
	if _, err := resolveArchivePath(root, "not-a-uuid", ""); err == nil {
		t.Fatal("resolveArchivePath() accepted invalid UUID")
	}
	if _, err := resolveArchivePath(root, archiveID, filepath.Join(root, "forged", "maildir")); err == nil {
		t.Fatal("resolveArchivePath() accepted forged archive path")
	}
}

func TestMoveMailboxToArchiveStateTransitions(t *testing.T) {
	base := t.TempDir()
	vmailRoot := filepath.Join(base, "vmail")
	recycleRoot := filepath.Join(base, "recycle")
	if err := os.MkdirAll(vmailRoot, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(recycleRoot, 0o755); err != nil {
		t.Fatal(err)
	}

	item := lifecycleTestItem(uuid.NewString())
	source, err := resolveMailboxPath(vmailRoot, item)
	if err != nil {
		t.Fatal(err)
	}
	target, err := resolveArchivePath(recycleRoot, item.ArchiveUUID, "")
	if err != nil {
		t.Fatal(err)
	}
	item.ArchivePath = target
	if err := os.MkdirAll(filepath.Join(source, "cur"), 0o755); err != nil {
		t.Fatal(err)
	}
	message := []byte("archived-message")
	if err := os.WriteFile(filepath.Join(source, "cur", "1.eml"), message, 0o600); err != nil {
		t.Fatal(err)
	}

	size, count, err := moveMailboxToArchive(vmailRoot, recycleRoot, item)
	if err != nil {
		t.Fatalf("moveMailboxToArchive() unexpected error: %v", err)
	}
	if size != int64(len(message)) || count != 1 {
		t.Fatalf("archive measurements = (%d, %d), want (%d, 1)", size, count, len(message))
	}
	if exists, _ := pathExistence(source); exists {
		t.Fatal("mailbox source still exists after archive")
	}
	if exists, _ := pathExistence(target); !exists {
		t.Fatal("archive target does not exist after archive")
	}

	// A retry after the rename is idempotent and re-measures the existing target.
	size, count, err = moveMailboxToArchive(vmailRoot, recycleRoot, item)
	if err != nil || size != int64(len(message)) || count != 1 {
		t.Fatalf("idempotent archive retry = (%d, %d, %v)", size, count, err)
	}

	if err := os.MkdirAll(source, 0o755); err != nil {
		t.Fatal(err)
	}
	if _, _, err := moveMailboxToArchive(vmailRoot, recycleRoot, item); err == nil || !strings.Contains(err.Error(), "both exist") {
		t.Fatalf("both-present state error = %v, want rejection", err)
	}

	missing := lifecycleTestItem(uuid.NewString())
	missing.LocalPart = "missing"
	missing.Username = "missing@example.com"
	missing.Maildir = "missing@example.com/"
	missing.ArchivePath, err = resolveArchivePath(recycleRoot, missing.ArchiveUUID, "")
	if err != nil {
		t.Fatal(err)
	}
	size, count, err = moveMailboxToArchive(vmailRoot, recycleRoot, missing)
	if err != nil {
		t.Fatalf("missing Maildir should create an empty archive: %v", err)
	}
	if size != 0 || count != 0 {
		t.Fatalf("empty archive measurements = (%d, %d), want (0, 0)", size, count)
	}
	if exists, _ := pathExistence(missing.ArchivePath); !exists {
		t.Fatal("empty archive target was not created")
	}
}

func TestMoveMailboxToArchiveRejectsSymlinkEscape(t *testing.T) {
	base := t.TempDir()
	vmailRoot := filepath.Join(base, "vmail")
	recycleRoot := filepath.Join(base, "recycle")
	outside := filepath.Join(base, "outside")
	for _, directory := range []string{vmailRoot, recycleRoot, outside} {
		if err := os.MkdirAll(directory, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.MkdirAll(filepath.Join(outside, "user"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.Symlink(outside, filepath.Join(vmailRoot, "example.com")); err != nil {
		t.Skipf("symlink unavailable: %v", err)
	}

	item := lifecycleTestItem(uuid.NewString())
	item.ArchivePath = filepath.Join(recycleRoot, item.ArchiveUUID, "maildir")
	if _, _, err := moveMailboxToArchive(vmailRoot, recycleRoot, item); err == nil {
		t.Fatal("moveMailboxToArchive() accepted a source escaping through an intermediate symlink")
	}
	if exists, _ := pathExistence(filepath.Join(outside, "user")); !exists {
		t.Fatal("outside directory was moved despite symlink rejection")
	}
}

func TestArchiveFailureActive(t *testing.T) {
	if got := archiveFailureActive(1, false); got != 1 {
		t.Fatalf("manual archive failure active = %d, want original 1", got)
	}
	if got := archiveFailureActive(0, false); got != 0 {
		t.Fatalf("manual archive failure active = %d, want original 0", got)
	}
	if got := archiveFailureActive(1, true); got != 0 {
		t.Fatalf("expiration archive failure active = %d, want disabled 0", got)
	}
}

func TestIsMailboxExpiredBoundary(t *testing.T) {
	now := time.Date(2026, time.September, 15, 0, 0, 0, 0, time.UTC)
	past := now.Add(-time.Nanosecond)
	equal := now
	future := now.Add(time.Nanosecond)

	tests := []struct {
		name      string
		expiresAt *time.Time
		want      bool
	}{
		{name: "permanent", expiresAt: nil, want: false},
		{name: "past", expiresAt: &past, want: true},
		{name: "equal", expiresAt: &equal, want: true},
		{name: "future", expiresAt: &future, want: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isMailboxExpired(tt.expiresAt, now); got != tt.want {
				t.Fatalf("isMailboxExpired() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestRecycleOperationStartStatesDoNotTakeOverInProgressWork(t *testing.T) {
	tests := []struct {
		name     string
		allowed  []string
		accepted []string
		rejected []string
	}{
		{
			name:     "restore",
			allowed:  restoreStartRecycleStatuses(),
			accepted: []string{ArchiveStatusArchived, ArchiveStatusRestoreFailed},
			rejected: []string{ArchiveStatusRestoring, ArchiveStatusArchiving, ArchiveStatusPurging},
		},
		{
			name:     "purge",
			allowed:  purgeStartRecycleStatuses(),
			accepted: []string{ArchiveStatusArchived, ArchiveStatusPurgeFailed},
			rejected: []string{ArchiveStatusPurging, ArchiveStatusRestoring, ArchiveStatusArchiving},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			for _, status := range tt.accepted {
				if !recycleStateAllowed(status, tt.allowed) {
					t.Errorf("state %q should be accepted", status)
				}
			}
			for _, status := range tt.rejected {
				if recycleStateAllowed(status, tt.allowed) {
					t.Errorf("in-progress state %q must not be taken over", status)
				}
			}
		})
	}
}

func TestMailboxUpdateBlockingRecycleStatuses(t *testing.T) {
	blocking := mailboxUpdateBlockingRecycleStatuses()
	for _, status := range []string{ArchiveStatusPending, ArchiveStatusArchiving, ArchiveStatusArchiveFailed} {
		if !recycleStateAllowed(status, blocking) {
			t.Errorf("mailbox updates must be blocked in state %q", status)
		}
	}
	for _, status := range []string{ArchiveStatusArchived, ArchiveStatusRestoreFailed, ArchiveStatusPurgeFailed} {
		if recycleStateAllowed(status, blocking) {
			t.Errorf("mailbox updates should not be blocked by unrelated state %q", status)
		}
	}
}

func TestLifecycleLeaseComparisonUsesPostgresMicrosecondPrecision(t *testing.T) {
	base := time.Date(2026, time.September, 15, 8, 30, 0, 123456000, time.UTC)
	if !sameLifecycleLease(base, base.Add(999*time.Nanosecond)) {
		t.Fatal("timestamps in the same PostgreSQL microsecond should identify the same lease")
	}
	if sameLifecycleLease(base, base.Add(time.Microsecond)) {
		t.Fatal("timestamps in different microseconds must identify different leases")
	}
	if sameLifecycleLease(time.Time{}, base) {
		t.Fatal("zero timestamp must not identify a valid lease")
	}
}

func TestLifecycleLeaseStaleBoundary(t *testing.T) {
	cutoff := time.Date(2026, time.September, 15, 8, 30, 0, 0, time.UTC)
	if !lifecycleLeaseIsStale(cutoff, cutoff) {
		t.Fatal("lease at cutoff should be stale")
	}
	if !lifecycleLeaseIsStale(cutoff.Add(-time.Nanosecond), cutoff) {
		t.Fatal("lease before cutoff should be stale")
	}
	if lifecycleLeaseIsStale(cutoff.Add(time.Nanosecond), cutoff) {
		t.Fatal("lease after cutoff should remain active")
	}
}

func TestStaleLifecycleStatusesOnlyContainRecoverableInProgressStates(t *testing.T) {
	statuses := staleLifecycleStatuses()
	for _, status := range []string{ArchiveStatusArchiving, ArchiveStatusRestoring, ArchiveStatusPurging} {
		if !recycleStateAllowed(status, statuses) {
			t.Errorf("stale reconciler should handle %q", status)
		}
	}
	for _, status := range []string{ArchiveStatusArchived, ArchiveStatusArchiveFailed, ArchiveStatusRestoreFailed, ArchiveStatusPurgeFailed} {
		if recycleStateAllowed(status, statuses) {
			t.Errorf("stale reconciler must not claim terminal/retry state %q", status)
		}
	}
}
