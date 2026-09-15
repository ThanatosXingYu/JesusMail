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
			'/mailbox-recycle',
			'/smtp',
			'/logs',
			'/settings',
			'/automation',
			'/activation',
		])
		expect(menuList.at(-1)?.path).toBe('/activation')
	})

	it('includes mailbox, recycle, and activation routes without registering video outreach', () => {
		expect(routes.some(route => route.path === '/mailbox')).toBe(true)
		expect(routes.some(route => route.path === '/mailbox-recycle')).toBe(true)
		expect(routes.some(route => route.path === '/activation')).toBe(true)
		expect(routes.some(route => route.path === '/video-outreach')).toBe(false)
		expect(router.resolve('/mailbox').matched.length).toBeGreaterThan(0)
		expect(router.resolve('/mailbox-recycle').matched.length).toBeGreaterThan(0)
		expect(router.resolve('/activation').matched.length).toBeGreaterThan(0)
	})
})
