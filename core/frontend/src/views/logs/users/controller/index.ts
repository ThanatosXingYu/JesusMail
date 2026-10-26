import { instance } from '@/api'

export const getUserLogs = async (params: Record<string, unknown>) => {
	return await instance.get('/operation_log/users', { params })
}
