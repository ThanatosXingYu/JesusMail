export const ADMIN_PATH = '/admin'

export const resolveAdminPath = (pathname: string): string => {
	const path = pathname || '/'
	return path === ADMIN_PATH || path.startsWith(`${ADMIN_PATH}/`) ? ADMIN_PATH : ''
}

export const adminPath = resolveAdminPath(window.location.pathname)

export const toAdminApiUrl = (url: string, currentAdminPath = adminPath): string => {
	if (!currentAdminPath || !url.startsWith('/api/')) {
		return url
	}
	return `${currentAdminPath}${url}`
}
