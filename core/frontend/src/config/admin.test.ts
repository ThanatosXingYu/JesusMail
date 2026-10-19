import { describe, expect, it } from 'vitest'
import { resolveAdminPath, toAdminApiUrl } from './admin'

describe('admin path helpers', () => {
	it('detects the admin root and nested pages', () => {
		expect(resolveAdminPath('/admin')).toBe('/admin')
		expect(resolveAdminPath('/admin/')).toBe('/admin')
		expect(resolveAdminPath('/admin/overview')).toBe('/admin')
	})

	it('leaves normal, activation, and similarly named paths unchanged', () => {
		expect(resolveAdminPath('/')).toBe('')
		expect(resolveAdminPath('/activate')).toBe('')
		expect(resolveAdminPath('/administrator')).toBe('')
		expect(resolveAdminPath('/roundcube/')).toBe('')
	})

	it('rewrites only admin API calls', () => {
		expect(toAdminApiUrl('/api/login', '/admin')).toBe('/admin/api/login')
		expect(toAdminApiUrl('/api/login', '')).toBe('/api/login')
		expect(toAdminApiUrl('/public/activation/config', '/admin')).toBe('/public/activation/config')
	})
})
