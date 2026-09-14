import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isDev } from '@/utils'
import activationRoute from './modules/activation'
import apiRoute from './modules/api'
import automationRoute from './modules/automation'
import contactsRoute from './modules/contacts'
import domainRoute from './modules/domain'
import logsRoute from './modules/logs'
import mailboxRoute from './modules/mailbox'
import marketRoute from './modules/market'
import overviewRoute from './modules/overview'
import settingsRoute from './modules/settings'
import smtpRoute from './modules/smtp'
import templateRoute from './modules/template'
import videoOutreachRoute from './modules/video-outreach'

// Routes reflect list
const routesReflectList = [
	'Overview',
	'Email Marketing',
	'template',
	'Send API',
	'Contacts',
	'Sequences',
	'Leads',
	'Enrichment',
	'MailDomain',
	'MailBoxes',
	'Activation Keys',
	'SMTP',
	'Logs',
	'Settings',
	'Automation',
	'Video Outreach',
]

const moduleRoutes: RouteRecordRaw[] = [
	activationRoute,
	apiRoute,
	automationRoute,
	contactsRoute,
	domainRoute,
	logsRoute,
	mailboxRoute,
	marketRoute,
	overviewRoute,
	settingsRoute,
	smtpRoute,
	templateRoute,
	videoOutreachRoute,
]

const routeOrder = new Map(routesReflectList.map((title, index) => [title, index]))

// Keep the route list dense. Sparse entries are invalid Vue Router records.
export const menuList: RouteRecordRaw[] = moduleRoutes.sort((a, b) => {
	const aIndex = routeOrder.get(String(a.meta?.title)) ?? Number.MAX_SAFE_INTEGER
	const bIndex = routeOrder.get(String(b.meta?.title)) ?? Number.MAX_SAFE_INTEGER
	return aIndex - bIndex
})

const otherArray: RouteRecordRaw[] = []

if (isDev) {
	otherArray.push({
		path: '/test',
		name: 'Test',
		component: () => import('@/views/test/index.vue'),
	})
}

export const routes: RouteRecordRaw[] = [
	{
		path: '/activate',
		name: 'Activate',
		component: () => import('@/views/activate/index.vue'),
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
	},
	{
		path: '/',
		redirect: '/overview',
	},
	...menuList,
	...otherArray,
]

const router = createRouter({
	history: createWebHistory('/'),
	routes,
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
