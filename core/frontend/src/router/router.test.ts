import { describe, expect, it, vi } from 'vitest'

vi.mock('@/utils', () => ({ isDev: false }))

import router, { menuList, routes } from './router'

describe('application router', () => {
	it('registers every menu module as a dense, ordered route list', () => {
		expect(menuList.every(Boolean)).toBe(true)
		expect(menuList.map(route => route.path)).toEqual([
			'/overview',
			'/market',
			'/template',
			'/send',
			'/contacts',
			'/domain',
			'/mailbox',
			'/activation',
			'/smtp',
			'/logs',
			'/settings',
			'/automation',
			'/video-outreach',
		])
	})

	it('includes the mailbox and activation routes in the router', () => {
		expect(routes.some(route => route.path === '/mailbox')).toBe(true)
		expect(routes.some(route => route.path === '/activation')).toBe(true)
		expect(router.resolve('/mailbox').matched.length).toBeGreaterThan(0)
		expect(router.resolve('/activation').matched.length).toBeGreaterThan(0)
	})
})
