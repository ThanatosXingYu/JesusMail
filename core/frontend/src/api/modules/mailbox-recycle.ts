import { instance } from '@/api'

export interface MailboxRecycleItem {
	id: number
	username: string
	source_type: string
	activation_keycode_snapshot?: string
	deleted_at: string
	purge_at: string
	mail_size_bytes: number
	file_count: number
	archive_status: string
	delete_reason: string
	last_error?: string
}

export interface MailboxRecycleList {
	total: number
	page: number
	page_size: number
	list: MailboxRecycleItem[]
}

export interface MailboxRecycleStats {
	total_items: number
	total_bytes: number
	disk_total_bytes: number
	disk_free_bytes: number
	pending_items: number
	failed_items: number
}

export const getMailboxRecycleStats = () =>
	instance.get('/mailbox/recycle/stats') as Promise<MailboxRecycleStats>

export const getMailboxRecycleList = (params: {
	page: number
	page_size: number
	keyword: string
	status: string
}) => instance.get('/mailbox/recycle/list', { params }) as Promise<MailboxRecycleList>

export const restoreMailboxRecycleItems = (params: { ids: number[] }) =>
	instance.post('/mailbox/recycle/restore', params, { fetchOptions: { successMessage: true } })

export const purgeMailboxRecycleItems = (params: { ids: number[]; confirmation: string }) =>
	instance.post('/mailbox/recycle/purge', params, { fetchOptions: { successMessage: true } })

export const cleanupExpiredMailboxRecycleItems = (params: { confirmation: string }) =>
	instance.post('/mailbox/recycle/cleanup', params, { fetchOptions: { successMessage: true } })
