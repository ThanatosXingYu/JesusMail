import { describe, expect, it } from 'vitest'
import { buildWebmailLoginUrl, isMailboxLoginAvailable } from './login'

const ticket = 'A'.repeat(43)

describe('mailbox one-click login helpers', () => {
	it('builds a same-origin Roundcube URL containing only the opaque ticket', () => {
		const url = new URL(buildWebmailLoginUrl('https://admin.example.com', ticket))
		expect(url.origin).toBe('https://admin.example.com')
		expect(url.pathname).toBe('/roundcube/')
		expect(url.searchParams.get('_task')).toBe('login')
		expect(url.searchParams.get('jesusmail_ticket')).toBe(ticket)
		expect(url.toString()).not.toContain('password')
	})

	it('rejects malformed tickets', () => {
		expect(() => buildWebmailLoginUrl('https://admin.example.com', 'bad-ticket')).toThrow(
			'Invalid login ticket response'
		)
	})

	it('allows only active and unexpired mailboxes', () => {
		const now = Date.parse('2026-09-15T00:00:00Z')
		expect(isMailboxLoginAvailable({ active: 1, expires_at: null }, now)).toBe(true)
		expect(
			isMailboxLoginAvailable({ active: 1, expires_at: '2026-09-16T00:00:00Z' }, now)
		).toBe(true)
		expect(isMailboxLoginAvailable({ active: 0, expires_at: null }, now)).toBe(false)
		expect(
			isMailboxLoginAvailable({ active: 1, expires_at: '2026-09-14T23:59:59Z' }, now)
		).toBe(false)
	})
})
