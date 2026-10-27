import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'

const route: RouteRecordRaw = {
	path: '/mail-list',
	component: Layout,
	meta: {
		sort: 7,
		key: 'mail-list',
		title: 'Mail List',
		titleKey: 'layout.menu.mailList',
	},
	children: [
		{
			path: '/mail-list',
			name: 'MailList',
			component: () => import('@/views/mail-list/index.vue'),
		},
	],
}

export default route
