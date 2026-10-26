import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGet = vi.fn()

vi.mock('@/api', () => ({
	instance: {
		get: (...args: unknown[]) => mockGet(...args),
	},
}))

import { getUserLogs } from './index'

describe('user logs API', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads paginated user logs from the dedicated endpoint', async () => {
		const params = {
			page: 1,
			page_size: 20,
			username: 'user@example.com',
			event_type: 'receive',
			start_time: 1_700_000_000,
			end_time: 1_700_000_100,
		}

		await getUserLogs(params)

		expect(mockGet).toHaveBeenCalledWith('/operation_log/users', { params })
	})
})
