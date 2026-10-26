import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mocks = vi.hoisted(() => ({
	getSystemConfig: vi.fn(),
}))

vi.mock('@/api/modules/settings/common', () => ({
	getSystemConfig: mocks.getSystemConfig,
}))

import { useSettingsStore } from './index'

describe('settings common store activation welcome email', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		vi.clearAllMocks()
	})

	it('loads activation welcome email configuration from system config', async () => {
		mocks.getSystemConfig.mockResolvedValue({
			admin_username: 'admin',
			safe_path: 'admin',
			hostname: 'mail.example.com',
			server_ip: '192.0.2.1',
			ip_whitelist_enable: false,
			ip_whitelist: [],
			retention_days: 7,
			welcome_email: {
				enabled: false,
				sender: 'welcome@example.com',
				subject: '欢迎使用邮箱',
			},
		})

		const store = useSettingsStore()
		await store.getCommonConfig()

		expect(store.welcomeEmail).toEqual({
			enabled: false,
			sender: 'welcome@example.com',
			subject: '欢迎使用邮箱',
		})
	})
})
