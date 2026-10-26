package welcome

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/gogf/gf/v2/database/gdb"
	"github.com/gogf/gf/v2/frame/g"
)

const (
	StatusPending = "pending"
	StatusSent    = "sent"
	StatusFailed  = "failed"

	maxAttempts = 5
	claimLease  = 2 * time.Minute
	batchSize   = 20
)

type Job struct {
	ID            int64      `orm:"id"`
	Email         string     `orm:"email"`
	Status        string     `orm:"status"`
	RetryCount    int        `orm:"retry_count"`
	NextAttemptAt time.Time  `orm:"next_attempt_at"`
	LastError     string     `orm:"last_error"`
	CreatedAt     time.Time  `orm:"created_at"`
	SentAt        *time.Time `orm:"sent_at"`
}

// Queue records one idempotent welcome-email job. Delivery happens outside activation.
func Queue(ctx context.Context, email string) error {
	if !LoadConfig(ctx).Enabled {
		return nil
	}

	recipient, _, err := splitRecipient(email)
	if err != nil {
		return err
	}
	_, err = g.DB().Model("activation_welcome_jobs").Ctx(ctx).Data(g.Map{
		"email":           recipient,
		"status":          StatusPending,
		"next_attempt_at": time.Now().UTC(),
	}).InsertIgnore()
	return err
}

func splitRecipient(value string) (recipient, domain string, err error) {
	recipient = strings.ToLower(strings.TrimSpace(value))
	address, parseErr := mail.ParseAddress(recipient)
	if parseErr != nil || address.Name != "" || strings.ToLower(address.Address) != recipient {
		return "", "", fmt.Errorf("recipient email format is invalid")
	}
	parts := strings.SplitN(recipient, "@", 2)
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", fmt.Errorf("recipient email format is invalid")
	}
	return recipient, parts[1], nil
}

func claimJob(ctx context.Context, now time.Time) (*Job, error) {
	var claimed *Job
	err := g.DB().Transaction(ctx, func(ctx context.Context, tx gdb.TX) error {
		var job Job
		if err := tx.GetScan(&job, `SELECT id, email, status, retry_count, next_attempt_at, last_error, created_at, sent_at
            FROM activation_welcome_jobs
            WHERE status = ? AND next_attempt_at <= ?
            ORDER BY next_attempt_at, id
            LIMIT 1
            FOR UPDATE SKIP LOCKED`, StatusPending, now); err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil
			}
			return err
		}
		if job.ID == 0 {
			return nil
		}

		nextAttemptAt := now.Add(claimLease)
		if _, err := tx.Model("activation_welcome_jobs").Ctx(ctx).
			Where("id", job.ID).
			Where("status", StatusPending).
			Data(g.Map{"next_attempt_at": nextAttemptAt}).
			Update(); err != nil {
			return err
		}
		job.NextAttemptAt = nextAttemptAt
		claimed = &job
		return nil
	})
	return claimed, err
}

type failureState struct {
	RetryCount    int
	Status        string
	NextAttemptAt time.Time
	LastError     string
}

func evaluateFailure(job Job, sendErr error, now time.Time) failureState {
	attempt := job.RetryCount + 1
	state := failureState{
		RetryCount:    attempt,
		Status:        StatusPending,
		NextAttemptAt: now.Add(backoffDelay(attempt)),
		LastError:     truncateError(sendErr),
	}
	if attempt >= maxAttempts {
		state.Status = StatusFailed
		state.NextAttemptAt = now
	}
	return state
}

func backoffDelay(attempt int) time.Duration {
	if attempt < 1 {
		attempt = 1
	}
	return time.Minute * time.Duration(1<<(attempt-1))
}

func truncateError(err error) string {
	if err == nil {
		return ""
	}
	const maxRunes = 2000
	message := []rune(err.Error())
	if len(message) > maxRunes {
		message = message[:maxRunes]
	}
	return string(message)
}

func markSent(ctx context.Context, job Job, now time.Time) error {
	result, err := g.DB().Model("activation_welcome_jobs").Ctx(ctx).
		Where("id", job.ID).
		Where("status", StatusPending).
		Data(g.Map{
			"status":          StatusSent,
			"next_attempt_at": now,
			"last_error":      "",
			"sent_at":         now,
		}).
		Update()
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected != 1 {
		return fmt.Errorf("welcome job %d changed while marking it sent", job.ID)
	}
	return nil
}

func markFailed(ctx context.Context, job Job, sendErr error, now time.Time) error {
	state := evaluateFailure(job, sendErr, now)
	result, err := g.DB().Model("activation_welcome_jobs").Ctx(ctx).
		Where("id", job.ID).
		Where("status", StatusPending).
		Data(g.Map{
			"status":          state.Status,
			"retry_count":     state.RetryCount,
			"next_attempt_at": state.NextAttemptAt,
			"last_error":      state.LastError,
		}).
		Update()
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected != 1 {
		return fmt.Errorf("welcome job %d changed while recording a failure", job.ID)
	}
	return nil
}
