import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'

const route: RouteRecordRaw = {
	path: '/activation',
	component: Layout,
	meta: {
		sort: 7,
		key: 'activation',
		title: 'Activation Keys',
		titleKey: 'layout.menu.activation',
	},
	children: [
		{
			path: '/activation',
			name: 'Activation',
			component: () => import('@/views/activation/index.vue'),
		},
	],
}

export default route
