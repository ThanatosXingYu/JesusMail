<template>
	<div class="p-24px mailbox-page">
		<div class="bt-title">{{ t('layout.menu.mailboxes') }}</div>
		<bt-table-layout class="mailbox-table-layout">
			<template #toolsLeft>
				<n-flex class="mailbox-tool-group" :wrap="true" :size="8">
					<n-button type="primary" @click="handleAdd">
						<i class="i-mdi-plus mr-4px"></i>
						{{ t('mailbox.actions.add') }}
					</n-button>
					<n-button @click="handleBatchAdd">
						<i class="i-mdi-account-multiple-plus-outline mr-4px"></i>
						{{ $t('mailbox.actions.batchAdd') }}
					</n-button>
					<n-button @click="handleImport">
						<i class="i-mdi-import mr-4px"></i>
						{{ $t('common.actions.import') }}
					</n-button>
					<n-button @click="handleExport">
						<i class="i-mdi-export mr-4px"></i>
						{{ t('mailbox.actions.exportAll') }}
					</n-button>
				</n-flex>
			</template>
			<template #toolsRight>
				<n-flex class="mailbox-tool-group" :wrap="true" :size="8">
					<div class="w-220px">
						<domain-select v-model:value="tableParams.domain" @update:value="() => resetTable()">
						</domain-select>
					</div>
					<bt-search
						v-model:value="tableParams.keyword"
						:width="280"
						:placeholder="t('mailbox.search.usernamePlaceholder')"
						@search="() => resetTable()">
					</bt-search>
				</n-flex>
			</template>
			<template #table>
				<n-data-table class="mailbox-table" v-bind="tableProps" :columns="columns" :scroll-x="1770">
					<template #empty>
						<bt-table-help> </bt-table-help>
					</template>
				</n-data-table>
			</template>
			<template #pageLeft>
				<bt-table-batch v-bind="batchProps" :options="batchOptions" @select="handleBatchSelect">
				</bt-table-batch>
			</template>
			<template #pageRight>
				<bt-table-page v-bind="pageProps" @refresh="fetchTable"> </bt-table-page>
			</template>
			<template #modal>
				<form-modal></form-modal>
				<batch-add-modal ref="batchAddRef" @refresh="fetchTable"></batch-add-modal>
				<import-modal ref="importRef" @refresh="fetchTable"></import-modal>
				<export-modal ref="exportRef"></export-modal>
			</template>
		</bt-table-layout>
	</div>
</template>

<script lang="tsx" setup>
import { DataTableColumns, NButton, NFlex, NSwitch } from 'naive-ui'
import { useBrowserLocation } from '@vueuse/core'
import { confirm, getByteUnit, Message } from '@/utils'
import { useModal } from '@/hooks/modal/useModal'
import { useCopy } from '@/hooks/useCopy'
import { useDataTable } from '@/hooks/useDataTable'
import {
	createMailboxLoginTicket,
	deleteMailbox,
	getMailboxList,
	updateMailbox,
} from '@/api/modules/mailbox'
import { MailBox, MailBoxParams } from './interface'
import { buildWebmailLoginUrl, isMailboxLoginAvailable } from './login'

import TablePassword from '@/components/base/bt-table-password/index.vue'
import DomainSelect from './components/DomainSelect.vue'
import MailboxForm from './components/MailboxForm.vue'
import BatchAddModal from './components/MailboxBatchAdd.vue'
import ImportModal from './components/MailboxImport.vue'
import ExportModal from './components/MailboxExport.vue'

const location = useBrowserLocation()

const { t } = useI18n()

const { copyText } = useCopy()

const loginTicketLoading = reactive<Record<string, boolean>>({})

const handleOneClickLogin = async (row: MailBox) => {
	if (!isMailboxLoginAvailable(row) || loginTicketLoading[row.username]) return

	const popup = window.open('about:blank', '_blank')
	if (popup) popup.opener = null
	loginTicketLoading[row.username] = true

	try {
		const { ticket } = await createMailboxLoginTicket({ username: row.username })
		const webmailUrl = buildWebmailLoginUrl(window.location.origin, ticket)

		if (popup && !popup.closed) {
			popup.location.replace(webmailUrl)
		} else {
			window.location.assign(webmailUrl)
		}
	} catch {
		if (popup && !popup.closed) popup.close()
		Message.error(t('mailbox.loginInfo.oneClickLoginFailed'))
	} finally {
		delete loginTicketLoading[row.username]
	}
}

const batchAddRef = useTemplateRef('batchAddRef')

const handleBatchAdd = () => {
	batchAddRef.value?.open()
}

const importRef = useTemplateRef('importRef')

const handleImport = () => {
	importRef.value?.open()
}

const exportRef = useTemplateRef('exportRef')

const handleExport = () => {
	exportRef.value?.open(tableParams.value.domain)
}

const { tableParams, tableProps, pageProps, batchProps, fetchTable, resetTable } = useDataTable<
	MailBox,
	MailBoxParams
>({
	loading: true,
	immediate: true,
	params: {
		page: 1,
		page_size: 10,
		domain: location.value.state.domain || '',
		keyword: '',
	},
	rowKey: row => row.username,
	fetchFn: getMailboxList,
})

// Table columns
const columns = ref<DataTableColumns<MailBox>>([
	{
		type: 'selection',
		width: 48,
		fixed: 'left',
	},
	{
		key: 'username',
		title: t('mailbox.columns.username'),
		width: 220,
		fixed: 'left',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		key: 'password',
		title: t('mailbox.columns.password'),
		width: 200,
		render: row => <TablePassword value={row.password || `--`} />,
	},
	{
		key: 'login',
		title: t('mailbox.columns.loginInfo'),
		width: 120,
		render: row => {
			return (
				<NFlex class="mailbox-login-actions" inline={true} align="center">
					<NButton
						class="shrink-0"
						text
						type="primary"
						onClick={() => {
							copyText(
								t('mailbox.loginInfo.template', {
									webmail: window.location.origin + '/roundcube',
									username: row.username,
									password: row.password,
									mx: row.mx,
								})
							)
						}}>
						<i class="i-mdi-content-copy mr-4px"></i>
						{t('common.actions.copy')}
					</NButton>
				</NFlex>
			)
		},
	},
	{
		key: 'received_count',
		title: t('mailbox.columns.receivedCount'),
		width: 100,
		render: row => Number(row.received_count ?? 0).toLocaleString(),
	},
	{
		key: 'sent_count',
		title: t('mailbox.columns.sentCount'),
		width: 100,
		render: row => Number(row.sent_count ?? 0).toLocaleString(),
	},
	{
		key: 'expires_at',
		title: t('mailbox.columns.expiresAt'),
		width: 170,
		render: row =>
			row.expires_at
				? new Date(row.expires_at).toLocaleString()
				: t('mailbox.expiration.permanent'),
	},
	{
		key: 'source_type',
		title: t('mailbox.columns.sourceType'),
		width: 130,
		render: row => {
			const sourceType = row.source_type || 'legacy'
			const translated = t(`mailbox.sourceType.${sourceType}`)
			return translated === `mailbox.sourceType.${sourceType}` ? sourceType : translated
		},
	},
	{
		key: 'quota',
		title: t('mailbox.columns.quota'),
		width: 150,
		render: row => {
			if (row.quota_active === 1) {
				return `${getByteUnit(row.used_quota)} / ${getByteUnit(row.quota)}`
			}
			return <i class="i-common:quota w-20px h-20px"></i>
		},
	},
	{
		key: 'is_admin',
		title: t('mailbox.columns.type'),
		width: 110,
		render: row => {
			return row.is_admin === 1 ? t('mailbox.userType.admin') : t('mailbox.userType.general')
		},
	},
	{
		key: 'status',
		title: t('mailbox.columns.status'),
		width: 90,
		render: row => {
			return (
				<NSwitch
					value={row.active}
					checked-value={1}
					unchecked-value={0}
					size="small"
					onUpdateValue={val => {
						handleStatusChange(row, val)
					}}
				/>
			)
		},
	},
	{
		title: t('common.columns.actions'),
		key: 'actions',
		align: 'right',
		width: 290,
		fixed: 'right',
		render: row => (
			<NFlex class="mailbox-row-actions" inline={true} justify="end">
				<NButton
					class="shrink-0"
					text
					type="primary"
					loading={Boolean(loginTicketLoading[row.username])}
					disabled={!isMailboxLoginAvailable(row)}
					onClick={() => handleOneClickLogin(row)}>
					<i class="i-mdi-login-variant mr-4px"></i>
					{t('mailbox.actions.oneClickLogin')}
				</NButton>
				<NButton
					class="shrink-0"
					type="primary"
					text={true}
					onClick={() => {
						handleEdit(row)
					}}>
					<i class="i-mdi-pencil-outline mr-4px"></i>
					{t('common.actions.edit')}
				</NButton>
				<NButton
					class="shrink-0"
					type="error"
					text={true}
					onClick={() => {
						handleDelete(row)
					}}>
					<i class="i-mdi-delete-outline mr-4px"></i>
					{t('common.actions.delete')}
				</NButton>
			</NFlex>
		),
	},
])

const [FormModal, formModalApi] = useModal({
	component: MailboxForm,
	state: {
		isEdit: false,
		refresh: fetchTable,
	},
})

const handleAdd = () => {
	formModalApi.setState({ isEdit: false, row: null })
	formModalApi.open()
}

const handleStatusChange = async (row: MailBox, val: number) => {
	await updateMailbox({
		full_name: row.full_name,
		local_part: row.local_part,
		domain: row.domain,
		password: row.password,
		quota: row.quota,
		quota_active: row.quota_active,
		isAdmin: row.is_admin,
		active: val,
		expires_at: row.expires_at,
	})
	row.active = val
}

const handleEdit = (row: MailBox) => {
	formModalApi.setState({ isEdit: true, row })
	formModalApi.open()
}

const handleDelete = (row: MailBox) => {
	confirm({
		title: t('mailbox.delete.title'),
		content: t('mailbox.delete.confirm', { name: row.username }),
		confirmText: t('common.actions.delete'),
		confirmType: 'error',
		onConfirm: async () => {
			await deleteMailbox({ emails: [row.username] })
			fetchTable()
		},
	})
}

const batchOptions = [
	{
		label: t('common.actions.delete'),
		value: 'delete',
	},
]

const handleBatchSelect = (key: string, keys: string[]) => {
	switch (key) {
		case 'delete':
			handleBatchDelete(keys)
			break
	}
}

const handleBatchDelete = (keys: string[]) => {
	confirm({
		title: t('mailbox.actions.batchDelete'),
		content: t('mailbox.delete.batchConfirm', { count: keys.length }),
		confirmText: t('common.actions.delete'),
		confirmType: 'error',
		onConfirm: async () => {
			await deleteMailbox({ emails: keys })
			fetchTable()
		},
	})
}
</script>

<style scoped>
.mailbox-tool-group {
	max-width: 100%;
	align-items: center;
}

.mailbox-table-layout :deep(.table-layout-toolbar) {
	flex-wrap: wrap;
	row-gap: 12px;
}

.mailbox-table-layout :deep(.table-layout-toolbar > .n-flex) {
	min-width: 0;
}

.mailbox-table-layout :deep(.table-layout-toolbar > .n-flex:last-child) {
	justify-content: flex-end;
}

/*
 * JSX 渲染的表格单元格元素不会带上 data-v-* 作用域属性，
 * 因此这里不再依赖 scoped 选择器给按钮/图标留间距，
 * 统一改用 NFlex 的 gap 与 UnoCSS 工具类（mr-4px / shrink-0）。
 */

@media (max-width: 900px) {
	.mailbox-page {
		padding: 16px;
	}
}
</style>
