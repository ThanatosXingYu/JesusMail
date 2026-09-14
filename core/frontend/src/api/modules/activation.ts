import { instance } from '@/api'

export interface ActivationKey {
	id: number
	keycode: string
	status: number
	used_at?: string | null
	used_ip?: string
	email?: string
	note: string
	group_name: string
	created_at: string
}

export interface ActivationList {
	total: number
	page: number
	page_size: number
	groups: string[]
	list: ActivationKey[]
}

export const activateMailbox = (params: { key: string; prefix: string; password: string }) =>
	instance.post('/public/activation/activate', params)

export const getActivationStats = () => instance.get('/activation/stats')
export const getActivationList = (params: {
	page: number
	page_size: number
	status: number
	group: string
}) => instance.get('/activation/list', { params })
export const generateActivationKeys = (params: { count: number; note: string; group: string }) =>
	instance.post('/activation/generate', params, { fetchOptions: { successMessage: true } })
export const setActivationGroup = (params: { ids: number[]; group: string }) =>
	instance.post('/activation/set_group', params, { fetchOptions: { successMessage: true } })
export const deleteActivationKeys = (params: { ids: number[]; force: boolean }) =>
	instance.post('/activation/delete', params, { fetchOptions: { successMessage: true } })
