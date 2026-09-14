import { useGlobalStore, useUserStore } from '@/store'
import { setLanguage } from '@/i18n'
import { clearPendingRequests } from '@/api'
import router from '@/router/router'
import loadingBar from '@/config/loadingBar'

// Route white list
const whitePathList = ['/login', '/activate', '/activate/']

const syncLanguage = () => {
	const globalStore = useGlobalStore()

	// Apply the persisted/default language immediately. Language discovery is auxiliary
	// and must never block authentication redirects or initial route rendering.
	setLanguage(globalStore.lang)
	void globalStore
		.getLang()
		.then(() => setLanguage(globalStore.lang))
		.catch(() => setLanguage(globalStore.lang))
}

router.beforeEach((to, from, next) => {
	loadingBar.start()

	clearPendingRequests()

	const userStore = useUserStore()

	// Resolve authentication synchronously before starting any network request.
	if (!userStore.isLogin && !whitePathList.includes(to.path)) {
		next('/login')
		return
	}

	if (userStore.isLogin && to.path === '/login') {
		next('/')
		return
	}

	syncLanguage()
	next()
})

router.afterEach(() => {
	loadingBar.finish()
})

export default router
