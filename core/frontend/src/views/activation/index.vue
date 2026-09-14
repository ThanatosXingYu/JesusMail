<template>
	<div class="p-24px activation-admin">
		<div class="page-head">
			<div>
				<div class="bt-title">激活码管理</div>
				<div class="description">管理 JessusMail 原生邮箱开户激活码</div>
			</div>
			<n-space>
				<n-button tag="a" href="/activate" target="_blank">打开激活页</n-button>
				<n-button type="primary" @click="showGenerate = true">生成激活码</n-button>
			</n-space>
		</div>
		<n-grid :cols="4" :x-gap="16" class="stats">
			<n-gi v-for="item in statCards" :key="item.label"
				><n-card size="small"><n-statistic :label="item.label" :value="item.value" /></n-card
			></n-gi>
		</n-grid>
		<n-card>
			<n-space justify="space-between" class="filters">
				<n-space>
					<n-select
						v-model:value="params.status"
						:options="statusOptions"
						class="w-140px"
						@update:value="reset" />
					<n-select
						v-model:value="params.group"
						:options="groupOptions"
						class="w-180px"
						@update:value="reset" />
					<n-button :disabled="!checked.length" @click="openGroup">设置分组</n-button>
					<n-button type="error" ghost :disabled="!checked.length" @click="remove(false)"
						>删除未使用</n-button
					>
					<n-button type="error" :disabled="!checked.length" @click="remove(true)"
						>强制删除</n-button
					>
				</n-space>
				<n-button @click="exportCsv">导出当前筛选</n-button>
			</n-space>
			<n-data-table
				remote
				:loading="loading"
				:columns="columns"
				:data="rows"
				:row-key="row => row.id"
				:checked-row-keys="checked"
				@update:checked-row-keys="keys => checked = keys as number[]" />
			<div class="pager">
				<n-pagination
					v-model:page="params.page"
					v-model:page-size="params.page_size"
					:item-count="total"
					:page-sizes="[20, 50, 100, 200]"
					show-size-picker
					@update:page="load"
					@update:page-size="reset" />
			</div>
		</n-card>
		<n-modal v-model:show="showGenerate" preset="card" title="生成激活码" class="w-460px">
			<n-form label-placement="top">
				<n-form-item label="生成数量"
					><n-input-number v-model:value="generateForm.count" :min="1" :max="500" class="w-full"
				/></n-form-item>
				<n-form-item label="分组"
					><n-input v-model:value="generateForm.group" maxlength="100" placeholder="可选"
				/></n-form-item>
				<n-form-item label="备注"
					><n-input v-model:value="generateForm.note" maxlength="255" placeholder="可选"
				/></n-form-item>
			</n-form>
			<template #footer
				><n-space justify="end"
					><n-button @click="showGenerate = false">取消</n-button
					><n-button type="primary" @click="generate">确认生成</n-button></n-space
				></template
			>
		</n-modal>
		<n-modal v-model:show="showGroup" preset="card" title="设置分组" class="w-420px">
			<n-input v-model:value="groupName" maxlength="100" placeholder="留空表示移出分组" />
			<template #footer
				><n-space justify="end"
					><n-button @click="showGroup = false">取消</n-button
					><n-button type="primary" @click="saveGroup">保存</n-button></n-space
				></template
			>
		</n-modal>
	</div>
</template>

<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui'
import { NTag, NButton } from 'naive-ui'
import { confirm } from '@/utils'
import { useCopy } from '@/hooks/useCopy'
import {
	deleteActivationKeys,
	generateActivationKeys,
	getActivationList,
	getActivationStats,
	setActivationGroup,
	type ActivationKey,
	type ActivationList,
} from '@/api/modules/activation'

const { copyText } = useCopy()
const stats = reactive({ total: 0, unused: 0, used: 0, disabled: 0 })
const statCards = computed(() => [
	{ label: '总数', value: stats.total },
	{ label: '未使用', value: stats.unused },
	{ label: '已使用', value: stats.used },
	{ label: '已禁用', value: stats.disabled },
])
const params = reactive({ page: 1, page_size: 50, status: -1, group: '' })
const rows = ref<ActivationKey[]>([]),
	total = ref(0),
	groups = ref<string[]>([]),
	checked = ref<number[]>([]),
	loading = ref(false)
const statusOptions = [
	{ label: '全部状态', value: -1 },
	{ label: '未使用', value: 0 },
	{ label: '已使用', value: 1 },
	{ label: '已禁用', value: 2 },
]
const groupOptions = computed(() => [
	{ label: '全部分组', value: '' },
	{ label: '未分组', value: '__none__' },
	...groups.value.map(v => ({ label: v, value: v })),
])
const statusText = ['未使用', '已使用', '已禁用'],
	statusType = ['success', 'info', 'warning'] as const
const getStatusText = (status: number) => statusText[status] || '未知'
const getStatusType = (status: number) => statusType[status] || 'default'
const columns: DataTableColumns<ActivationKey> = [
	{ type: 'selection' },
	{
		title: '激活码',
		key: 'keycode',
		width: 210,
		render: row => (
			<NButton text type="primary" onClick={() => copyText(row.keycode)}>
				{row.keycode}
			</NButton>
		),
	},
	{
		title: '状态',
		key: 'status',
		width: 90,
		render: row => <NTag type={getStatusType(row.status)}>{getStatusText(row.status)}</NTag>,
	},
	{ title: '分组', key: 'group_name', render: row => row.group_name || '-' },
	{ title: '关联邮箱', key: 'email', render: row => row.email || '-' },
	{ title: '使用 IP', key: 'used_ip', width: 140, render: row => row.used_ip || '-' },
	{ title: '使用时间', key: 'used_at', width: 175, render: row => fmt(row.used_at) },
	{ title: '备注', key: 'note', render: row => row.note || '-' },
	{ title: '创建时间', key: 'created_at', width: 175, render: row => fmt(row.created_at) },
]
const fmt = (value?: string | null) => (value ? new Date(value).toLocaleString() : '-')
const loadStats = async () => Object.assign(stats, await getActivationStats())
const load = async () => {
	loading.value = true
	try {
		const data = (await getActivationList(params)) as ActivationList
		rows.value = data.list
		total.value = data.total
		groups.value = data.groups
		checked.value = []
	} finally {
		loading.value = false
	}
}
const reset = () => {
	params.page = 1
	load()
}
const showGenerate = ref(false),
	generateForm = reactive({ count: 10, group: '', note: '' })
const generate = async () => {
	await generateActivationKeys(generateForm)
	showGenerate.value = false
	await Promise.all([load(), loadStats()])
}
const showGroup = ref(false),
	groupName = ref('')
const openGroup = () => {
	groupName.value = ''
	showGroup.value = true
}
const saveGroup = async () => {
	await setActivationGroup({ ids: checked.value, group: groupName.value })
	showGroup.value = false
	await load()
}
const remove = (force: boolean) =>
	confirm({
		title: force ? '强制删除激活码' : '删除未使用激活码',
		content: force
			? '强制删除会同时清理已使用激活码及其流水，确定继续吗？'
			: '只会删除选中的未使用激活码，已使用或已禁用的会被保留。',
		confirmText: '删除',
		confirmType: 'error',
		onConfirm: async () => {
			await deleteActivationKeys({ ids: checked.value, force })
			await Promise.all([load(), loadStats()])
		},
	})
const csvCell = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`
const exportCsv = async () => {
	const first = (await getActivationList({ ...params, page: 1, page_size: 500 })) as ActivationList
	const exportRows = [...first.list]
	const pageCount = Math.ceil(first.total / 500)
	for (let page = 2; page <= pageCount; page++) {
		const next = (await getActivationList({ ...params, page, page_size: 500 })) as ActivationList
		exportRows.push(...next.list)
	}
	const header = [
		'ID',
		'激活码',
		'状态',
		'分组',
		'关联邮箱',
		'使用IP',
		'使用时间',
		'备注',
		'创建时间',
	]
	const lines = exportRows.map(r =>
		[
			r.id,
			r.keycode,
			statusText[r.status],
			r.group_name,
			r.email,
			r.used_ip,
			fmt(r.used_at),
			r.note,
			fmt(r.created_at),
		]
			.map(csvCell)
			.join(',')
	)
	const blob = new Blob(['\ufeff' + [header.join(','), ...lines].join('\n')], {
		type: 'text/csv;charset=utf-8',
	})
	const a = document.createElement('a')
	a.href = URL.createObjectURL(blob)
	a.download = `jessusmail_activation_keys_${new Date().toISOString().slice(0, 10)}.csv`
	a.click()
	URL.revokeObjectURL(a.href)
}
Promise.all([load(), loadStats()])
</script>

<style scoped>
.page-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18px;
}
.description {
	color: var(--color-text-3);
	margin-top: 4px;
}
.stats {
	margin-bottom: 16px;
}
.filters {
	margin-bottom: 16px;
}
.pager {
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
}
</style>
