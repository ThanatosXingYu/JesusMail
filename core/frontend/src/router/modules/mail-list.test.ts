import { describe, expect, it, vi } from 'vitest'

vi.mock('@/router/constant', () => ({
	Layout: () => Promise.resolve({ template: '<router-view />' }),
}))

import route from './mail-list'

describe('mail list route', () => {
	it('registers the mail search page under the main menu', () => {
		expect(route.path).toBe('/mail-list')
		expect(route.meta).toMatchObject({
			key: 'mail-list',
			titleKey: 'layout.menu.mailList',
		})
		expect(route.children?.[0]).toMatchObject({
			path: '/mail-list',
			name: 'MailList',
		})
	})
})
