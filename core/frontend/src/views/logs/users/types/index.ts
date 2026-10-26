export type UserLogEventType = 'login' | 'logout' | 'send' | 'receive'

export type UserLog = {
	id: string
	username: string
	event_type: UserLogEventType
	event: string
	status: string
	ip: string
	user_agent: string
	detail: string
	time: number
}

export type UserLogQuery = {
	page: number
	page_size: number
	username: string
	event_type: '' | UserLogEventType
	keyword: string
	time_range: [number, number] | null
}
