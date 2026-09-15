import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'

const route: RouteRecordRaw = {
	path: '/mailbox-recycle',
	component: Layout,
	meta: {
		sort: 7,
		key: 'mailbox-recycle',
		title: 'Mailbox Recycle Bin',
		titleKey: 'layout.menu.mailboxRecycle',
	},
	children: [
		{
			path: '/mailbox-recycle',
			name: 'MailboxRecycle',
			component: () => import('@/views/mailbox-recycle/index.vue'),
		},
	],
}

export default route
