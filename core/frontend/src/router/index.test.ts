import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const mocks = vi.hoisted(() => ({
	beforeEach: vi.fn(),
	afterEach: vi.fn(),
	loadingStart: vi.fn(),
	loadingFinish: vi.fn(),
	clearPendingRequests: vi.fn(),
	setLanguage: vi.fn(),
	getLang: vi.fn(),
	globalStore: { lang: 'en' },
	userStore: { isLogin: false },
}))

vi.mock('@/router/router', () => ({
	default: {
		beforeEach: mocks.beforeEach,
		afterEach: mocks.afterEach,
	},
}))

vi.mock('@/store', () => ({
	useGlobalStore: () => ({ ...mocks.globalStore, getLang: mocks.getLang }),
	useUserStore: () => mocks.userStore,
}))

vi.mock('@/i18n', () => ({
	setLanguage: mocks.setLanguage,
}))

vi.mock('@/api', () => ({
	clearPendingRequests: mocks.clearPendingRequests,
}))

vi.mock('@/config/loadingBar', () => ({
	default: {
		start: mocks.loadingStart,
		finish: mocks.loadingFinish,
	},
}))

await import('./index')

type Guard = (
	to: Pick<RouteLocationNormalized, 'path'>,
	from: Pick<RouteLocationNormalized, 'path'>,
	next: NavigationGuardNext
) => void

const guard = mocks.beforeEach.mock.calls[0][0] as Guard
const afterEachGuard = mocks.afterEach.mock.calls[0][0] as () => void

const navigateTo = (path: string) => {
	const next = vi.fn() as unknown as NavigationGuardNext
	guard({ path }, { path: '/' }, next)
	return next
}

describe('authentication navigation guard', () => {
	beforeEach(() => {
		mocks.loadingStart.mockClear()
		mocks.loadingFinish.mockClear()
		mocks.clearPendingRequests.mockClear()
		mocks.setLanguage.mockClear()
		mocks.getLang.mockReset()
		mocks.getLang.mockResolvedValue(undefined)
		mocks.globalStore.lang = 'en'
		mocks.userStore.isLogin = false
	})

	it('redirects an unauthenticated mailbox request before language discovery', () => {
		mocks.getLang.mockReturnValue(new Promise(() => {}))

		const next = navigateTo('/mailbox')

		expect(next).toHaveBeenCalledOnce()
		expect(next).toHaveBeenCalledWith('/login')
		expect(mocks.getLang).not.toHaveBeenCalled()
	})

	it('allows public routes without waiting for language discovery', () => {
		mocks.getLang.mockReturnValue(new Promise(() => {}))

		const next = navigateTo('/login')

		expect(next).toHaveBeenCalledOnce()
		expect(next).toHaveBeenCalledWith()
		expect(mocks.setLanguage).toHaveBeenCalledWith('en')
		expect(mocks.getLang).toHaveBeenCalledOnce()
	})

	it('allows the public activation route with or without a trailing slash', () => {
		mocks.getLang.mockReturnValue(new Promise(() => {}))

		const exact = navigateTo('/activate')
		const trailingSlash = navigateTo('/activate/')

		expect(exact).toHaveBeenCalledWith()
		expect(trailingSlash).toHaveBeenCalledWith()
		expect(mocks.getLang).toHaveBeenCalledTimes(2)
	})

	it('redirects an authenticated user away from login synchronously', () => {
		mocks.userStore.isLogin = true
		mocks.getLang.mockReturnValue(new Promise(() => {}))

		const next = navigateTo('/login')

		expect(next).toHaveBeenCalledWith('/')
		expect(mocks.getLang).not.toHaveBeenCalled()
	})

	it('allows an authenticated mailbox request', () => {
		mocks.userStore.isLogin = true

		const next = navigateTo('/mailbox')

		expect(next).toHaveBeenCalledWith()
		expect(mocks.getLang).toHaveBeenCalledOnce()
	})

	it('finishes the loading bar after navigation', () => {
		afterEachGuard()
		expect(mocks.loadingFinish).toHaveBeenCalledOnce()
	})
})
