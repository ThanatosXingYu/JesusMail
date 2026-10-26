<template>
	<bt-table-layout>
		<template #toolsLeft>
			<div class="flex flex-wrap items-center gap-12px">
				<div class="w-220px">
					<bt-search
						v-model:value="tableParams.username"
						:placeholder="t('logs.user.search.username')"
						@search="() => resetTable()">
					</bt-search>
				</div>
				<div class="w-160px">
					<n-select
						v-model:value="tableParams.event_type"
						:options="eventOptions"
						@update:value="() => resetTable()">
					</n-select>
				</div>
				<div class="w-220px">
					<bt-search
						v-model:value="tableParams.keyword"
						:placeholder="t('logs.user.search.keyword')"
						@search="() => resetTable()">
					</bt-search>
				</div>
				<n-date-picker
					v-model:value="tableParams.time_range"
					type="datetimerange"
					clearable
					class="w-360px"
					@update:value="() => resetTable()">
				</n-date-picker>
			</div>
		</template>
		<template #table>
			<n-data-table v-bind="tableProps" :columns="columns"></n-data-table>
		</template>
		<template #pageRight>
			<bt-table-page v-bind="pageProps" @refresh="fetchTable"></bt-table-page>
		</template>
	</bt-table-layout>
</template>

<script lang="ts" setup>
import type { DataTableColumns, SelectOption } from 'naive-ui'
import { useDataTable } from '@/hooks/useDataTable'
import { formatTime } from '@/utils'
import { getUserLogs } from './controller'
import { buildUserLogParams } from './logic'
import type { UserLog, UserLogQuery } from './types'

const { t } = useI18n()

const columns = ref<DataTableColumns<UserLog>>([
	{
		key: 'username',
		title: t('logs.user.columns.username'),
		minWidth: 200,
		ellipsis: { tooltip: true },
	},
	{
		key: 'event',
		title: t('logs.user.columns.event'),
		width: 120,
		render: row => t(`logs.user.events.${row.event_type}`),
	},
	{
		key: 'status',
		title: t('logs.user.columns.status'),
		width: 120,
		ellipsis: { tooltip: true },
	},
	{
		key: 'ip',
		title: 'IP',
		width: 140,
	},
	{
		key: 'detail',
		title: t('logs.user.columns.detail'),
		minWidth: 220,
		ellipsis: { tooltip: true },
		render: row => row.detail || row.user_agent || '-',
	},
	{
		key: 'time',
		title: t('logs.user.columns.time'),
		width: 170,
		render: row => formatTime(row.time),
	},
])

const eventOptions: SelectOption[] = [
	{ label: t('logs.user.events.all'), value: '' },
	{ label: t('logs.user.events.login'), value: 'login' },
	{ label: t('logs.user.events.logout'), value: 'logout' },
	{ label: t('logs.user.events.send'), value: 'send' },
	{ label: t('logs.user.events.receive'), value: 'receive' },
]

const initialQuery: UserLogQuery = {
	page: 1,
	page_size: 20,
	username: '',
	event_type: '',
	keyword: '',
	time_range: null,
}

const { tableParams, tableProps, pageProps, fetchTable, resetTable } = useDataTable<
	UserLog,
	UserLogQuery
>({
	params: initialQuery,
	immediate: true,
	fetchFn: getUserLogs,
	useParams: buildUserLogParams,
})
</script>
