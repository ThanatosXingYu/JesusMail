import type { MailBox } from './interface'

const LOGIN_TICKET_PATTERN = /^[A-Za-z0-9_-]{43}$/

export const isMailboxLoginAvailable = (row: Pick<MailBox, 'active' | 'expires_at'>, now = Date.now()) =>
	row.active === 1 && (!row.expires_at || new Date(row.expires_at).getTime() > now)

export const buildWebmailLoginUrl = (origin: string, ticket: string) => {
	if (!LOGIN_TICKET_PATTERN.test(ticket)) {
		throw new Error('Invalid login ticket response')
	}

	const url = new URL('/roundcube/', origin)
	url.searchParams.set('_task', 'login')
	url.searchParams.set('jesusmail_ticket', ticket)
	return url.toString()
}
