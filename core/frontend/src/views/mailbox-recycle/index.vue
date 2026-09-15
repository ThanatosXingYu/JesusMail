<template>
	<div class="p-24px recycle-page">
		<div class="page-head">
			<div>
				<div class="bt-title">邮箱回收站</div>
				<div class="description">已删除邮箱及邮件默认保留 30 天，可在到期前恢复。</div>
			</div>
			<n-space>
				<n-button :loading="loading" @click="refresh">刷新</n-button>
				<n-button type="error" ghost :disabled="!stats.total_items" @click="cleanupExpired">
					清理已到期
				</n-button>
			</n-space>
		</div>

		<n-grid responsive="screen" cols="4 m:2 s:1" :x-gap="16" :y-gap="16" class="stats">
			<n-gi v-for="card in statCards" :key="card.label">
				<n-card size="small">
					<n-statistic :label="card.label" :value="card.value" />
				</n-card>
			</n-gi>
		</n-grid>

		<n-alert v-if="stats.failed_items" type="error" class="mb-16px">
			有 {{ stats.failed_items }} 个邮箱归档失败。失败记录不会被自动清理，请先检查错误并重试或恢复。
		</n-alert>

		<n-card>
			<div class="toolbar">
				<n-space :wrap="true">
					<n-select
						v-model:value="params.status"
						:options="statusOptions"
						class="w-180px"
						@update:value="reset" />
					<n-input
						v-model:value="params.keyword"
						clearable
						class="w-260px"
						placeholder="搜索邮箱账号"
						@keyup.enter="reset" />
					<n-button @click="reset">搜索</n-button>
					<n-button :disabled="!checked.length" @click="restoreSelected">恢复选中</n-button>
					<n-button type="error" ghost :disabled="!checked.length" @click="purgeSelected">
						永久删除选中
					</n-button>
				</n-space>
				<span class="selected-count">已选 {{ checked.length }} 项</span>
			</div>

			<n-data-table
				remote
				:loading="loading"
				:columns="columns"
				:data="rows"
				:row-key="row => row.id"
				:checked-row-keys="checked"
				:scroll-x="1500"
				@update:checked-row-keys="keys => checked = keys as number[]" />
			<div class="pager">
				<n-pagination
					v-model:page="params.page"
					v-model:page-size="params.page_size"
					:item-count="total"
					:page-sizes="[20, 50, 100]"
					show-size-picker
					@update:page="load"
					@update:page-size="reset" />
			</div>
		</n-card>
	</div>
</template>

<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import { confirm, getByteUnit, Message } from '@/utils'
import {
	cleanupExpiredMailboxRecycleItems,
	getMailboxRecycleList,
	getMailboxRecycleStats,
	purgeMailboxRecycleItems,
	restoreMailboxRecycleItems,
	type MailboxRecycleItem,
	type MailboxRecycleList,
	type MailboxRecycleStats,
} from '@/api/modules/mailbox-recycle'

const stats = reactive<MailboxRecycleStats>({
	total_items: 0,
	total_bytes: 0,
	disk_total_bytes: 0,
	disk_free_bytes: 0,
	pending_items: 0,
	failed_items: 0,
})
const rows = ref<MailboxRecycleItem[]>([])
const total = ref(0)
const checked = ref<number[]>([])
const loading = ref(false)
const params = reactive({ page: 1, page_size: 20, keyword: '', status: '' })

const statCards = computed(() => [
	{ label: '回收邮箱', value: `${stats.total_items} 个` },
	{ label: '回收站占用', value: getByteUnit(stats.total_bytes || 0) },
	{ label: '磁盘可用空间', value: getByteUnit(stats.disk_free_bytes || 0) },
	{
		label: '处理状态',
		value: stats.failed_items ? `${stats.failed_items} 个失败` : `${stats.pending_items} 个处理中`,
	},
])

const statusOptions = [
	{ label: '全部归档状态', value: '' },
	{ label: '已归档', value: 'archived' },
	{ label: '处理中', value: 'pending' },
	{ label: '归档失败', value: 'archive_failed' },
	{ label: '恢复中', value: 'restoring' },
]
const sourceLabels: Record<string, string> = {
	legacy: '历史数据',
	manual: '管理员添加',
	activation: '激活码添加',
	batch: '批量添加',
	import: '导入添加',
	system_expiry: '系统到期',
	domain_delete: '域名删除',
}
const statusLabels: Record<string, string> = {
	pending: '处理中',
	archiving: '归档中',
	archived: '已归档',
	archive_failed: '归档失败',
	restoring: '恢复中',
	restored: '已恢复',
	purging: '清理中',
}
const statusTypes: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
	pending: 'warning',
	archiving: 'warning',
	archived: 'success',
	archive_failed: 'error',
	restoring: 'info',
	restored: 'info',
	purging: 'warning',
}
const formatDate = (value?: string) => (value ? new Date(value).toLocaleString() : '-')

const columns: DataTableColumns<MailboxRecycleItem> = [
	{ type: 'selection', fixed: 'left' },
	{ title: '邮箱账号', key: 'username', width: 230, ellipsis: { tooltip: true } },
	{
		title: '来源',
		key: 'source_type',
		width: 130,
		render: row => sourceLabels[row.source_type] || row.source_type || '未知',
	},
	{
		title: '激活码',
		key: 'activation_keycode_snapshot',
		width: 210,
		render: row => row.activation_keycode_snapshot || '-',
	},
	{
		title: '归档状态',
		key: 'archive_status',
		width: 110,
		render: row => (
			<NTag type={statusTypes[row.archive_status] || 'default'}>
				{statusLabels[row.archive_status] || row.archive_status}
			</NTag>
		),
	},
	{
		title: '邮件空间',
		key: 'mail_size_bytes',
		width: 120,
		render: row => getByteUnit(row.mail_size_bytes || 0),
	},
	{ title: '文件数', key: 'file_count', width: 90 },
	{ title: '删除原因', key: 'delete_reason', width: 150, ellipsis: { tooltip: true } },
	{ title: '删除时间', key: 'deleted_at', width: 175, render: row => formatDate(row.deleted_at) },
	{ title: '保留至', key: 'purge_at', width: 175, render: row => formatDate(row.purge_at) },
	{
		title: '错误',
		key: 'last_error',
		width: 180,
		ellipsis: { tooltip: true },
		render: row => row.last_error || '-',
	},
	{
		title: '操作',
		key: 'actions',
		width: 150,
		fixed: 'right',
		render: row => (
			<div class="flex gap-12px justify-end">
				<NButton
					text
					type="primary"
					disabled={row.archive_status !== 'archived'}
					onClick={() => restoreRows([row.id], row)}>
					恢复
				</NButton>
				<NButton
					text
					type="error"
					disabled={row.archive_status !== 'archived'}
					onClick={() => purgeRows([row.id], row)}>
					永久删除
				</NButton>
			</div>
		),
	},
]

let latestRequest = 0
const load = async () => {
	const requestId = ++latestRequest
	loading.value = true
	try {
		const data = (await getMailboxRecycleList({ ...params })) as MailboxRecycleList
		if (requestId !== latestRequest) return
		rows.value = data.list || []
		total.value = data.total || 0
		checked.value = []
	} finally {
		if (requestId === latestRequest) loading.value = false
	}
}
const loadStats = async () => Object.assign(stats, await getMailboxRecycleStats())
const refresh = () => Promise.all([load(), loadStats()])
const reset = async () => {
	params.page = 1
	await load()
}

const restoreRows = (ids: number[], row?: MailboxRecycleItem) => {
	if (!ids.length) return Message.warning('请先选择要恢复的邮箱')
	confirm({
		title: '恢复邮箱',
		content: row
			? `确定恢复邮箱「${row.username}」及其邮件吗？若同名邮箱已存在，恢复会被拒绝。`
			: `确定恢复选中的 ${ids.length} 个邮箱及其邮件吗？同名邮箱已存在的项目会被跳过。`,
		confirmText: '确认恢复',
		onConfirm: async () => {
			await restoreMailboxRecycleItems({ ids: [...ids] })
			await refresh()
		},
	})
}
const purgeRows = (ids: number[], row?: MailboxRecycleItem) => {
	if (!ids.length) return Message.warning('请先选择要永久删除的邮箱')
	confirm({
		title: '永久删除邮箱',
		content: row
			? `邮箱「${row.username}」的账号、密码备份和全部邮件将被永久删除，无法恢复。是否继续？`
			: `选中的 ${ids.length} 个邮箱、密码备份和全部邮件将被永久删除，无法恢复。是否继续？`,
		confirmText: '确认永久删除',
		confirmType: 'error',
		onConfirm: async () => {
			await purgeMailboxRecycleItems({ ids: [...ids], confirmation: 'PERMANENTLY DELETE' })
			await refresh()
		},
	})
}
const cleanupExpired = () =>
	confirm({
		title: '清理已到期回收项',
		content: '仅清理保留期已超过 30 天且归档完整的邮箱。清理后的邮件无法恢复，确定继续吗？',
		confirmText: '确认清理',
		confirmType: 'error',
		onConfirm: async () => {
			await cleanupExpiredMailboxRecycleItems({ confirmation: 'PURGE EXPIRED' })
			await refresh()
		},
	})
const restoreSelected = () => restoreRows(checked.value)
const purgeSelected = () => purgeRows(checked.value)

onMounted(() => void refresh().catch(() => undefined))
</script>

<style scoped>
.page-head,
.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
}
.page-head {
	margin-bottom: 18px;
}
.description,
.selected-count {
	color: var(--color-text-3);
}
.description {
	margin-top: 4px;
}
.stats {
	margin-bottom: 16px;
}
.toolbar {
	margin-bottom: 16px;
}
.pager {
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
}
@media (max-width: 900px) {
	.page-head,
	.toolbar {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>
