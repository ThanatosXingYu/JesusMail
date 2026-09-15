import { instance } from '@/api'
import i18n from '@/i18n'
import type { MailboxLoginTicket } from '@/views/mailbox/interface'

const { t } = i18n.global

export const getMailboxList = (params: {
	page: number
	page_size: number
	domain: string | null
	keyword?: string
}) => {
	return instance.get('/mailbox/list', { params })
}

export type MailboxMutationParams = {
	full_name: string
	local_part: string
	domain: string
	password: string
	active: number
	isAdmin: number
	quota: number
	quota_active: number
	expires_at: string | null
}

export const createMailbox = (params: MailboxMutationParams) => {
	return instance.post('/mailbox/create', params, {
		fetchOptions: {
			loading: t('mailbox.api.loading.creating'),
			successMessage: true,
		},
	})
}

export const createBatchMailbox = (params: {
	domain: string
	prefix: string
	count: number
	quota: number
}) => {
	return instance.post('/mailbox/batch_create', params, {
		fetchOptions: {
			loading: t('mailbox.api.loading.creating'),
			successMessage: true,
		},
	})
}

export const updateMailbox = (params: MailboxMutationParams) => {
	return instance.post('/mailbox/update', params, {
		fetchOptions: {
			loading: t('mailbox.api.loading.updating'),
			successMessage: true,
		},
	})
}

export const deleteMailbox = (params: { emails: string[] }) => {
	return instance.post('/mailbox/delete', params, {
		fetchOptions: {
			loading: t('mailbox.api.loading.deleting'),
			successMessage: true,
		},
	})
}

export const exportMailbox = (params: { domain: string; file_type: string }) => {
	return instance.post('/mailbox/export', params, {
		responseType: 'blob',
		fetchOptions: {
			loading: t('mailbox.api.loading.exporting'),
			successMessage: true,
		},
	})
}

export const importMailbox = (params: { file_data: string; file_type: string }) => {
	return instance.post('/mailbox/import', params, {
		fetchOptions: {
			loading: t('mailbox.api.loading.importing'),
			successMessage: true,
		},
	})
}

export const createMailboxLoginTicket = (params: { username: string }) => {
	return instance.post<MailboxLoginTicket, MailboxLoginTicket>('/mailbox/login_ticket', params)
}
