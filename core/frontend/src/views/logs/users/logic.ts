import type { UserLogQuery } from './types'

export const buildUserLogParams = (query: UserLogQuery) => {
	const { time_range: timeRange, ...params } = query
	return {
		...params,
		start_time: timeRange ? Math.floor(timeRange[0] / 1000) : undefined,
		end_time: timeRange ? Math.floor(timeRange[1] / 1000) : undefined,
	}
}
