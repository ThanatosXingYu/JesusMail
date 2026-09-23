<template>
	<div class="p-24px activation-admin">
		<div class="page-head">
			<div>
				<div class="bt-title">激活码管理</div>
				<div class="description">管理 JesusMail 原生邮箱开户激活码</div>
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
		<n-card class="activation-list-card">
			<div class="toolbar">
				<n-space class="filters" :wrap="true">
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
					<n-button :loading="loading" @click="refresh">刷新</n-button>
					<n-button
						:disabled="!checked.length"
						:loading="mutationLoading === 'group'"
						@click="openGroup"
						>批量分组</n-button
					>
					<n-button
						:disabled="!checked.length"
						:loading="mutationLoading === 'unbind'"
						@click="clearSelectedBindings"
						>清除绑定</n-button
					>
					<n-button
						type="error"
						:disabled="!checked.length"
						:loading="mutationLoading === 'delete'"
						@click="removeSelected"
						>批量删除</n-button
					>
				</n-space>
				<n-space align="center">
					<span class="selected-count">已选 {{ checked.length }} 项</span>
					<n-button :loading="exporting" @click="exportCsv">导出当前筛选 CSV</n-button>
				</n-space>
			</div>
			<n-data-table
				remote
				:loading="loading"
				:columns="columns"
				:data="rows"
				:row-key="row => row.id"
				:checked-row-keys="checked"
				:scroll-x="1790"
				class="activation-table"
				flex-height
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
				<n-form-item label="生成数量" :feedback="generateCountFeedback">
					<n-input-number
						v-model:value="generateForm.count"
						:min="1"
						:max="500"
						:precision="0"
						class="w-full" />
				</n-form-item>
				<n-form-item label="分组">
					<n-input
						v-model:value="generateForm.group"
						maxlength="100"
						placeholder="可选，例如：2026 新生" />
				</n-form-item>
				<n-form-item label="备注">
					<n-input v-model:value="generateForm.note" maxlength="255" placeholder="可选" />
				</n-form-item>
			</n-form>
			<template #footer>
				<n-space justify="end">
					<n-button :disabled="mutationLoading === 'generate'" @click="showGenerate = false"
						>取消</n-button
					>
					<n-button
						type="primary"
						:disabled="!isValidGenerateCount(generateForm.count)"
						:loading="mutationLoading === 'generate'"
						@click="generate"
						>确认生成</n-button
					>
				</n-space>
			</template>
		</n-modal>
		<n-modal v-model:show="showGroup" preset="card" title="批量设置分组" class="w-420px">
			<n-input
				v-model:value="groupName"
				maxlength="100"
				placeholder="输入已有或新分组，留空表示移出分组" />
			<template #footer>
				<n-space justify="end">
					<n-button :disabled="mutationLoading === 'group'" @click="showGroup = false"
						>取消</n-button
					>
					<n-button type="primary" :loading="mutationLoading === 'group'" @click="saveGroup"
						>保存</n-button
					>
				</n-space>
			</template>
		</n-modal>
	</div>
</template>

<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import { confirm, Message } from '@/utils'
import { useCopy } from '@/hooks/useCopy'
import {
	clearActivationBindings,
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
	{ label: '激活码总数', value: stats.total },
	{ label: '未使用', value: stats.unused },
	{ label: '已使用', value: stats.used },
	{ label: '已禁用', value: stats.disabled },
])
const params = reactive({ page: 1, page_size: 50, status: -1, group: '' })
const rows = ref<ActivationKey[]>([]),
	total = ref(0),
	groups = ref<string[]>([]),
	checked = ref<number[]>([]),
	loading = ref(false),
	exporting = ref(false)
const mutationLoading = ref<'generate' | 'group' | 'delete' | 'unbind' | null>(null)
const statusOptions = [
	{ label: '全部状态', value: -1 },
	{ label: '未使用', value: 0 },
	{ label: '已使用', value: 1 },
	{ label: '已禁用', value: 2 },
]
const groupOptions = computed(() => [
	{ label: '全部分组', value: '' },
	{ label: '未分组', value: '__none__' },
	...groups.value.map(value => ({ label: value, value })),
])
const statusText = ['未使用', '已使用', '已禁用'],
	statusType = ['success', 'error', 'warning'] as const
const getStatusText = (status: number) => statusText[status] || '未知'
const getStatusType = (status: number) => statusType[status] || 'default'
const getStatusColor = (status: number) => {
	if (status === 0) return { color: '#dcfce7', textColor: '#166534', borderColor: '#86efac' }
	if (status === 1) return { color: '#fee2e2', textColor: '#991b1b', borderColor: '#fca5a5' }
	return undefined
}
const fmt = (value?: string | null) => (value ? new Date(value).toLocaleString() : '-')

const removeRows = (ids: number[], row?: ActivationKey) => {
	if (!ids.length) {
		Message.warning('请先选择要删除的激活码')
		return
	}
	const targetIds = [...ids]
	const isSingle = targetIds.length === 1 && row
	const content = isSingle
		? row.status === 0
			? `确定删除激活码「${row.keycode}」吗？删除后不可恢复。`
			: `激活码「${row.keycode}」当前不是未使用状态，系统会保留它。若要重新销售，请先执行“清除绑定”。仍要继续检查删除吗？`
		: `确定删除选中的 ${targetIds.length} 个激活码吗？仅未使用的激活码会被删除，已使用或已禁用的记录将保留。`

	confirm({
		title: isSingle ? '删除激活码' : '批量删除激活码',
		content,
		confirmText: '确认删除',
		confirmType: 'error',
		onConfirm: async () => {
			mutationLoading.value = 'delete'
			try {
				await deleteActivationKeys({ ids: targetIds })
				await Promise.all([load(), loadStats()])
				if (!rows.value.length && params.page > 1 && total.value > 0) {
					params.page = Math.ceil(total.value / params.page_size)
					await load()
				}
			} finally {
				mutationLoading.value = null
			}
		},
	})
}

const clearBindings = (ids: number[], row?: ActivationKey) => {
	if (!ids.length) {
		Message.warning('请先选择要清除绑定的激活码')
		return
	}
	const targetIds = [...ids]
	const isSingle = targetIds.length === 1 && row
	const content = isSingle
		? `确定清除激活码「${row.keycode}」与邮箱「${row.email || '-'}」的绑定吗？邮箱及邮件会进入回收站，激活码恢复为未使用。`
		: `确定清除选中激活码的邮箱绑定吗？所有受影响邮箱及邮件会进入回收站，成功处理的激活码恢复为未使用。`
	confirm({
		title: isSingle ? '清除激活码绑定' : '批量清除绑定',
		content,
		confirmText: '确认清除',
		confirmType: 'warning',
		onConfirm: async () => {
			mutationLoading.value = 'unbind'
			try {
				await clearActivationBindings({ ids: targetIds })
				await Promise.all([load(), loadStats()])
			} finally {
				mutationLoading.value = null
			}
		},
	})
}

const columns: DataTableColumns<ActivationKey> = [
	{ type: 'selection', fixed: 'left' },
	{ title: 'ID', key: 'id', width: 80 },
	{
		title: '激活码',
		key: 'keycode',
		width: 210,
		render: row => (
			<NButton text type="primary" title="点击复制激活码" onClick={() => copyText(row.keycode)}>
				{row.keycode}
			</NButton>
		),
	},
	{
		title: '状态',
		key: 'status',
		width: 90,
		render: row => (
			<NTag type={getStatusType(row.status)} color={getStatusColor(row.status)} strong>
				{getStatusText(row.status)}
			</NTag>
		),
	},
	{ title: '分组', key: 'group_name', width: 130, render: row => row.group_name || '未分组' },
	{ title: '关联邮箱', key: 'email', width: 210, render: row => row.email || '-' },
	{ title: '使用 IP', key: 'used_ip', width: 140, render: row => row.used_ip || '-' },
	{ title: '使用时间', key: 'used_at', width: 175, render: row => fmt(row.used_at) },
	{ title: '备注', key: 'note', minWidth: 150, render: row => row.note || '-' },
	{ title: '创建时间', key: 'created_at', width: 175, render: row => fmt(row.created_at) },
	{
		title: '操作',
		key: 'actions',
		width: 170,
		fixed: 'right',
		render: row => (
			<div class="flex gap-12px justify-end">
				{row.status === 1 ? (
					<NButton
						text
						type="warning"
						disabled={mutationLoading.value !== null}
						onClick={() => clearBindings([row.id], row)}>
						清除绑定
					</NButton>
				) : null}
				<NButton
					text
					type="error"
					disabled={mutationLoading.value !== null}
					onClick={() => removeRows([row.id], row)}>
					删除
				</NButton>
			</div>
		),
	},
]

const loadStats = async () => Object.assign(stats, await getActivationStats())
let latestLoad = 0
const load = async () => {
	const requestId = ++latestLoad
	loading.value = true
	try {
		const data = (await getActivationList({ ...params })) as ActivationList
		if (requestId !== latestLoad) return
		rows.value = data.list || []
		total.value = data.total || 0
		groups.value = data.groups || []
		checked.value = []
	} finally {
		if (requestId === latestLoad) loading.value = false
	}
}
const refresh = () => Promise.all([load(), loadStats()])
const reset = async () => {
	params.page = 1
	await load()
}

const showGenerate = ref(false),
	generateForm = reactive<{ count: number | null; group: string; note: string }>({
		count: 10,
		group: '',
		note: '',
	})
const isValidGenerateCount = (value: number | null): value is number =>
	value !== null && Number.isInteger(value) && value >= 1 && value <= 500
const generateCountFeedback = computed(() =>
	isValidGenerateCount(generateForm.count) ? undefined : '生成数量必须是 1-500 之间的整数'
)
const generate = async () => {
	if (!isValidGenerateCount(generateForm.count)) {
		Message.warning('生成数量必须是 1-500 之间的整数')
		return
	}
	mutationLoading.value = 'generate'
	try {
		generateForm.group = generateForm.group.trim()
		generateForm.note = generateForm.note.trim()
		await generateActivationKeys({ ...generateForm, count: generateForm.count })
		showGenerate.value = false
		await refresh()
	} finally {
		mutationLoading.value = null
	}
}

const showGroup = ref(false),
	groupName = ref('')
const openGroup = () => {
	if (!checked.value.length) {
		Message.warning('请先选择要设置分组的激活码')
		return
	}
	groupName.value = ''
	showGroup.value = true
}
const saveGroup = async () => {
	if (!checked.value.length) {
		Message.warning('请先选择要设置分组的激活码')
		showGroup.value = false
		return
	}
	const ids = [...checked.value]
	mutationLoading.value = 'group'
	try {
		groupName.value = groupName.value.trim()
		await setActivationGroup({ ids, group: groupName.value })
		showGroup.value = false
		await load()
	} finally {
		mutationLoading.value = null
	}
}
const removeSelected = () => removeRows(checked.value)
const clearSelectedBindings = () => clearBindings(checked.value)

const csvCell = (value: unknown) => {
	const raw = String(value ?? '')
	const formula = /^[\s]*[=+\-@]/.test(raw) ? `'${raw}` : raw
	return `"${formula.replaceAll('"', '""')}"`
}
const exportCsv = async () => {
	if (exporting.value) return
	exporting.value = true
	try {
		const filter = { status: params.status, group: params.group }
		const first = (await getActivationList({
			...filter,
			page: 1,
			page_size: 500,
		})) as ActivationList
		const exportRows = [...(first.list || [])]
		const pageCount = Math.ceil(first.total / 500)
		for (let page = 2; page <= pageCount; page++) {
			const next = (await getActivationList({ ...filter, page, page_size: 500 })) as ActivationList
			exportRows.push(...(next.list || []))
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
		const lines = exportRows.map(row =>
			[
				row.id,
				row.keycode,
				getStatusText(row.status),
				row.group_name,
				row.email,
				row.used_ip,
				fmt(row.used_at),
				row.note,
				fmt(row.created_at),
			]
				.map(csvCell)
				.join(',')
		)
		const blob = new Blob(['\ufeff' + [header.join(','), ...lines].join('\n')], {
			type: 'text/csv;charset=utf-8',
		})
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `jesusmail_activation_keys_${new Date().toISOString().slice(0, 10)}.csv`
		document.body.appendChild(link)
		link.click()
		link.remove()
		URL.revokeObjectURL(link.href)
	} catch {
		Message.error('导出失败，请稍后重试')
	} finally {
		exporting.value = false
	}
}

onMounted(() => {
	void refresh().catch(() => undefined)
})
</script>

<style scoped>
.activation-admin {
	box-sizing: border-box;
	height: calc(100dvh - 48px);
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.activation-list-card {
	flex: 1;
	min-height: 0;
}
.activation-list-card :deep(.n-card__content) {
	display: flex;
	flex-direction: column;
	min-height: 0;
}
.activation-table {
	flex: 1;
	min-height: 0;
}

.page-head,
.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
}
.page-head {
	flex: none;
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
	flex: none;
	margin-bottom: 16px;
}
.toolbar {
	flex: none;
	flex-wrap: wrap;
	margin-bottom: 16px;
}
.pager {
	flex: none;
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
}
</style>
