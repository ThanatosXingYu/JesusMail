<template>
	<div class="p-24px mail-list-page">
		<div class="page-head">
			<div>
				<div class="bt-title">{{ t('mailList.title') }}</div>
				<div class="description">{{ t('mailList.description') }}</div>
			</div>
			<n-button :loading="syncing" @click="syncIndex">
				<i class="i-mdi-database-refresh-outline mr-4px"></i>
				{{ t('mailList.actions.sync') }}
			</n-button>
		</div>

		<bt-table-layout>
			<template #toolsLeft>
				<n-tabs
					v-model:value="direction"
					type="line"
					animated
					class="mail-direction-tabs"
					@update:value="resetPage">
					<n-tab name="received" :tab="t('mailList.tabs.received')" />
					<n-tab name="sent" :tab="t('mailList.tabs.sent')" />
				</n-tabs>
			</template>
			<template #toolsRight>
				<n-flex :wrap="true" :size="8" align="center">
					<div class="w-260px">
						<bt-search
							v-model:value="keyword"
							:width="260"
							:placeholder="t('mailList.search.placeholder')"
							@search="resetPage">
						</bt-search>
					</div>
					<n-input
						v-model:value="mailbox"
						clearable
						class="w-220px"
						:placeholder="t('mailList.search.mailboxPlaceholder')"
						@keyup.enter="resetPage"
						@clear="resetPage" />
					<n-date-picker
						v-model:value="timeRange"
						type="datetimerange"
						clearable
						class="w-360px"
						@update:value="resetPage" />
					<n-button type="primary" @click="resetPage">
						<i class="i-mdi-magnify mr-4px"></i>
						{{ t('common.actions.search') }}
					</n-button>
				</n-flex>
			</template>
			<template #table>
				<n-data-table
					:loading="loading"
					:columns="columns"
					:data="rows"
					:row-key="row => row.id"
					:scroll-x="1440"
					flex-height>
					<template #empty>
						<bt-table-help />
					</template>
				</n-data-table>
			</template>
			<template #pageRight>
				<n-pagination
					v-model:page="page"
					v-model:page-size="pageSize"
					:item-count="total"
					:page-sizes="[20, 50, 100]"
					show-size-picker
					@update:page="load"
					@update:page-size="resetPage" />
			</template>
		</bt-table-layout>
	</div>
</template>

<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui'
import { Message, formatTime } from '@/utils'
import {
	getUserMessages,
	reindexUserMessages,
	type UserMessage,
	type UserMessageParams,
} from '@/api/modules/mailbox'

const { t } = useI18n()

const direction = ref<'received' | 'sent'>('received')
const keyword = ref('')
const mailbox = ref('')
const timeRange = ref<[number, number] | null>(null)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const rows = ref<UserMessage[]>([])
const loading = ref(false)
const syncing = ref(false)
let latestRequest = 0

const columns = computed<DataTableColumns<UserMessage>>(() => [
	{
		key: 'sent_at',
		title: t('mailList.columns.time'),
		width: 175,
		render: row => formatTime(row.sent_at),
	},
	{
		key: 'mailbox_username',
		title: t('mailList.columns.mailbox'),
		width: 220,
		ellipsis: { tooltip: true },
	},
	{
		key: 'sender',
		title: t('mailList.columns.sender'),
		minWidth: 220,
		ellipsis: { tooltip: true },
		render: row => row.sender || '-',
	},
	{
		key: 'recipients',
		title: t('mailList.columns.recipients'),
		minWidth: 240,
		ellipsis: { tooltip: true },
		render: row => row.recipients || '-',
	},
	{
		key: 'subject',
		title: t('mailList.columns.subject'),
		minWidth: 260,
		ellipsis: { tooltip: true },
		render: row => row.subject || t('mailList.noSubject'),
	},
	{
		key: 'body_preview',
		title: t('mailList.columns.preview'),
		minWidth: 320,
		ellipsis: { tooltip: true },
		render: row => row.body_preview || '-',
	},
])

const load = async () => {
	const requestID = ++latestRequest
	loading.value = true
	try {
		const params: UserMessageParams = {
			page: page.value,
			page_size: pageSize.value,
			direction: direction.value,
			keyword: keyword.value.trim(),
			mailbox: mailbox.value.trim(),
		}
		if (timeRange.value) {
			params.start_time = Math.floor(timeRange.value[0] / 1000)
			params.end_time = Math.floor(timeRange.value[1] / 1000)
		}
		const data = (await getUserMessages(params)) as { list?: UserMessage[]; total?: number }
		if (requestID !== latestRequest) return
		rows.value = data.list || []
		total.value = data.total || 0
	} finally {
		if (requestID === latestRequest) loading.value = false
	}
}

const resetPage = () => {
	page.value = 1
	load()
}

const syncIndex = async () => {
	syncing.value = true
	try {
		const result = (await reindexUserMessages()) as { indexed?: number; removed?: number; failed?: number }
		Message.success(
			t('mailList.syncResult', {
				indexed: result.indexed || 0,
				removed: result.removed || 0,
				failed: result.failed || 0,
			})
		)
		await resetPage()
	} finally {
		syncing.value = false
	}
}

onMounted(load)
</script>

<style scoped>
.mail-list-page {
	box-sizing: border-box;
	height: calc(100dvh - 48px);
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.page-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 18px;
}

.description {
	margin-top: 6px;
	color: var(--color-text-3);
}

.mail-direction-tabs {
	min-width: 220px;
}

:deep(.table-layout) {
	flex: 1;
	min-height: 0;
}

@media (max-width: 900px) {
	.mail-list-page {
		height: auto;
		min-height: calc(100dvh - 48px);
		overflow: visible;
		padding: 16px;
	}

	.page-head {
		flex-direction: column;
	}
}
</style>
