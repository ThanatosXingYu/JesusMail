import { describe, expect, it } from 'vitest'
import { buildUserLogParams } from './logic'

describe('user log query parameters', () => {
	it('converts the date range to second timestamps', () => {
		const params = buildUserLogParams({
			page: 2,
			page_size: 20,
			username: 'user@example.com',
			event_type: 'login',
			keyword: 'webmail',
			time_range: [1_700_000_000_999, 1_700_000_100_999],
		})

		expect(params).toEqual({
			page: 2,
			page_size: 20,
			username: 'user@example.com',
			event_type: 'login',
			keyword: 'webmail',
			start_time: 1_700_000_000,
			end_time: 1_700_000_100,
		})
		expect(params).not.toHaveProperty('time_range')
	})

	it('omits empty date bounds', () => {
		const params = buildUserLogParams({
			page: 1,
			page_size: 20,
			username: '',
			event_type: '',
			keyword: '',
			time_range: null,
		})

		expect(params.start_time).toBeUndefined()
		expect(params.end_time).toBeUndefined()
	})
})
