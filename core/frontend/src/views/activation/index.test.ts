import { defineComponent, h, nextTick, type VNode } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NTag } from 'naive-ui'
import type { ActivationKey, ActivationList } from '@/api/modules/activation'

const mocks = vi.hoisted(() => ({
	confirm: vi.fn(),
	messageError: vi.fn(),
	messageWarning: vi.fn(),
	copyText: vi.fn(),
	clearActivationBindings: vi.fn(),
	deleteActivationKeys: vi.fn(),
	generateActivationKeys: vi.fn(),
	getActivationList: vi.fn(),
	getActivationStats: vi.fn(),
	setActivationGroup: vi.fn(),
}))

vi.mock('@/utils', () => ({
	confirm: mocks.confirm,
	Message: {
		error: mocks.messageError,
		warning: mocks.messageWarning,
	},
}))

vi.mock('@/hooks/useCopy', () => ({
	useCopy: () => ({ copyText: mocks.copyText }),
}))

vi.mock('@/api/modules/activation', () => ({
	clearActivationBindings: mocks.clearActivationBindings,
	deleteActivationKeys: mocks.deleteActivationKeys,
	generateActivationKeys: mocks.generateActivationKeys,
	getActivationList: mocks.getActivationList,
	getActivationStats: mocks.getActivationStats,
	setActivationGroup: mocks.setActivationGroup,
}))

import ActivationAdmin from './index.vue'

const rows: ActivationKey[] = [
	{
		id: 11,
		keycode: 'UNUSED-CODE',
		status: 0,
		note: '未使用备注',
		group_name: '新生',
		created_at: '2026-09-15T01:00:00Z',
	},
	{
		id: 12,
		keycode: 'USED-CODE',
		status: 1,
		email: 'student@example.com',
		used_ip: '192.0.2.1',
		used_at: '2026-09-15T02:00:00Z',
		note: '已使用备注',
		group_name: '新生',
		created_at: '2026-09-15T01:30:00Z',
	},
]

const listResult = (overrides: Partial<ActivationList> = {}): ActivationList => ({
	total: rows.length,
	page: 1,
	page_size: 50,
	groups: ['新生', '教师'],
	list: rows,
	...overrides,
})

const NButtonStub = defineComponent({
	name: 'NButton',
	inheritAttrs: false,
	props: {
		disabled: Boolean,
		loading: Boolean,
	},
	emits: ['click'],
	setup(props, { attrs, emit, slots }) {
		return () =>
			h(
				'button',
				{
					...attrs,
					disabled: props.disabled,
					'data-loading': String(props.loading),
					onClick: () => emit('click'),
				},
				slots.default?.()
			)
	},
})

const NDataTableStub = defineComponent({
	name: 'NDataTable',
	props: {
		columns: { type: Array, default: () => [] },
		data: { type: Array, default: () => [] },
		checkedRowKeys: { type: Array, default: () => [] },
		scrollX: Number,
		flexHeight: Boolean,
	},
	emits: ['update:checked-row-keys'],
	template: '<div data-test="activation-table" />',
})

const NSelectStub = defineComponent({
	name: 'NSelect',
	props: {
		value: [String, Number],
		options: { type: Array, default: () => [] },
	},
	emits: ['update:value'],
	template: '<div class="select-stub" />',
})

const NInputStub = defineComponent({
	name: 'NInput',
	props: { value: String },
	emits: ['update:value'],
	template: '<input />',
})

const NInputNumberStub = defineComponent({
	name: 'NInputNumber',
	props: {
		value: Number,
		min: Number,
		max: Number,
		precision: Number,
	},
	emits: ['update:value'],
	template: '<input type="number" />',
})

const NStatisticStub = defineComponent({
	name: 'NStatistic',
	props: { label: String, value: Number },
	template: '<div class="statistic-stub">{{ label }}:{{ value }}</div>',
})

const NModalStub = defineComponent({
	name: 'NModal',
	props: { show: Boolean, title: String },
	emits: ['update:show'],
	setup(props, { slots }) {
		return () =>
			h('section', { 'data-modal-title': props.title, 'data-show': String(props.show) }, [
				slots.default?.(),
				slots.footer?.(),
			])
	},
})

const PassThroughStub = defineComponent({
	name: 'PassThroughStub',
	setup(_, { slots }) {
		return () => h('div', slots.default?.())
	},
})

const NFormItemStub = defineComponent({
	name: 'NFormItem',
	props: { label: String, feedback: String },
	setup(props, { slots }) {
		return () => h('label', [props.label, slots.default?.(), props.feedback])
	},
})

const mountPage = async () => {
	const wrapper = mount(ActivationAdmin, {
		global: {
			stubs: {
				NButton: NButtonStub,
				NCard: PassThroughStub,
				NDataTable: NDataTableStub,
				NForm: PassThroughStub,
				NFormItem: NFormItemStub,
				NGi: PassThroughStub,
				NGrid: PassThroughStub,
				NInput: NInputStub,
				NInputNumber: NInputNumberStub,
				NModal: NModalStub,
				NPagination: PassThroughStub,
				NSelect: NSelectStub,
				NSpace: PassThroughStub,
				NStatistic: NStatisticStub,
			},
		},
	})
	await flushPromises()
	return wrapper
}

const getColumn = (wrapper: Awaited<ReturnType<typeof mountPage>>, key: string) => {
	const table = wrapper.getComponent(NDataTableStub)
	return (
		table.props('columns') as Array<{ key?: string; title?: string; render?: Function }>
	).find(column => column.key === key)
}

const findButton = (wrapper: Awaited<ReturnType<typeof mountPage>>, text: string) => {
	const button = wrapper.findAll('button').find(item => item.text() === text)
	if (!button) throw new Error(`找不到按钮：${text}`)
	return button
}

describe('原生激活码管理', () => {
	beforeEach(() => {
		vi.stubGlobal('React', { createElement: h })
		vi.clearAllMocks()
		mocks.getActivationList.mockResolvedValue(listResult())
		mocks.getActivationStats.mockResolvedValue({ total: 102, unused: 75, used: 27, disabled: 0 })
		mocks.deleteActivationKeys.mockResolvedValue({ deleted: 1, skipped_used: 0 })
		mocks.generateActivationKeys.mockResolvedValue({ created: 1 })
		mocks.setActivationGroup.mockResolvedValue({ updated: 1 })
	})

	it('列表固定在页面内滚动，未使用为绿、已使用为红', async () => {
		const wrapper = await mountPage()
		const table = wrapper.getComponent(NDataTableStub)
		expect(wrapper.classes()).toContain('activation-admin')
		expect(wrapper.find('.activation-list-card').exists()).toBe(true)
		expect(wrapper.find('.pager').exists()).toBe(true)
		expect(table.props('flexHeight')).toBe(true)
		expect(table.classes()).toContain('activation-table')

		const statusColumn = getColumn(wrapper, 'status')
		const unused = statusColumn?.render?.(rows[0], 0) as VNode
		const used = statusColumn?.render?.(rows[1], 1) as VNode
		expect(unused.type).toBe(NTag)
		expect(unused.props?.type).toBe('success')
		expect(unused.props?.color).toMatchObject({ textColor: '#166534', color: '#dcfce7' })
		expect(used.props?.type).toBe('error')
		expect(used.props?.color).toMatchObject({ textColor: '#991b1b', color: '#fee2e2' })
	})

	it('保留旧管理页的生成、筛选、批量操作、导出、统计和操作列', async () => {
		const wrapper = await mountPage()
		const text = wrapper.text()

		expect(text).toContain('激活码总数:102')
		expect(text).toContain('未使用:75')
		expect(text).toContain('已使用:27')
		expect(text).toContain('已禁用:0')
		expect(text).toContain('生成激活码')
		expect(text).toContain('分组')
		expect(text).toContain('备注')
		expect(text).toContain('批量分组')
		expect(text).toContain('清除绑定')
		expect(text).toContain('批量删除')
		expect(text).not.toContain('强制删除')
		expect(text).toContain('导出当前筛选 CSV')

		const selects = wrapper.findAllComponents(NSelectStub)
		expect(selects[0].props('options')).toEqual([
			{ label: '全部状态', value: -1 },
			{ label: '未使用', value: 0 },
			{ label: '已使用', value: 1 },
			{ label: '已禁用', value: 2 },
		])
		expect(selects[1].props('options')).toEqual([
			{ label: '全部分组', value: '' },
			{ label: '未分组', value: '__none__' },
			{ label: '新生', value: '新生' },
			{ label: '教师', value: '教师' },
		])

		const countInput = wrapper.getComponent(NInputNumberStub)
		expect(countInput.props()).toMatchObject({ min: 1, max: 500, precision: 0 })

		const table = wrapper.getComponent(NDataTableStub)
		expect(table.props('scrollX')).toBe(1790)
		const titles = (table.props('columns') as Array<{ title?: string }>).map(column => column.title)
		expect(titles).toContain('操作')
		expect(titles).toContain('激活码')
		expect(titles).toContain('状态')
		expect(titles).toContain('分组')
		expect(titles).toContain('备注')
	})

	it('点击激活码会复制完整内容', async () => {
		const wrapper = await mountPage()
		const codeColumn = getColumn(wrapper, 'keycode')
		const vnode = codeColumn?.render?.(rows[0], 0) as VNode

		await vnode.props?.onClick()

		expect(mocks.copyText).toHaveBeenCalledWith('UNUSED-CODE')
	})

	it('未使用激活码经二次确认后调用统一删除', async () => {
		const wrapper = await mountPage()
		const actionColumn = getColumn(wrapper, 'actions')
		const vnode = actionColumn?.render?.(rows[0], 0) as VNode
		const actions = vnode.children as Array<VNode | null>
		const deleteButton = actions.at(-1) as VNode

		expect(deleteButton.children).toBe('删除')
		deleteButton.props?.onClick()
		expect(mocks.confirm).toHaveBeenCalledOnce()

		const options = mocks.confirm.mock.calls[0][0]
		expect(options.title).toBe('删除激活码')
		expect(options.content).toContain('UNUSED-CODE')
		await options.onConfirm()

		expect(mocks.deleteActivationKeys).toHaveBeenCalledWith({ ids: [11] })
	})

	it('已使用激活码删除时保留记录并提示先清除绑定', async () => {
		const wrapper = await mountPage()
		const actionColumn = getColumn(wrapper, 'actions')
		const vnode = actionColumn?.render?.(rows[1], 1) as VNode
		const actions = vnode.children as VNode[]
		const deleteButton = actions.at(-1) as VNode

		expect(deleteButton.children).toBe('删除')
		deleteButton.props?.onClick()

		const options = mocks.confirm.mock.calls[0][0]
		expect(options.title).toBe('删除激活码')
		expect(options.content).toContain('先执行“清除绑定”')
		await options.onConfirm()

		expect(mocks.deleteActivationKeys).toHaveBeenCalledWith({ ids: [12] })
	})

	it('已使用激活码可以二次确认后清除邮箱绑定', async () => {
		const wrapper = await mountPage()
		const actionColumn = getColumn(wrapper, 'actions')
		const vnode = actionColumn?.render?.(rows[1], 1) as VNode
		const actions = vnode.children as VNode[]
		const clearButton = actions[0] as VNode

		expect(clearButton.children).toBe('清除绑定')
		clearButton.props?.onClick()
		const options = mocks.confirm.mock.calls[0][0]
		expect(options.title).toBe('清除激活码绑定')
		expect(options.content).toContain('进入回收站')
		await options.onConfirm()

		expect(mocks.clearActivationBindings).toHaveBeenCalledWith({ ids: [12] })
	})

	it('批量分组会使用选中 ID，并清理分组名称首尾空格', async () => {
		const wrapper = await mountPage()
		wrapper.getComponent(NDataTableStub).vm.$emit('update:checked-row-keys', [11, 12])
		await nextTick()
		await findButton(wrapper, '批量分组').trigger('click')

		const groupInput = wrapper.findAllComponents(NInputStub).at(-1)
		expect(groupInput).toBeTruthy()
		groupInput!.vm.$emit('update:value', '  2026 新生  ')
		await nextTick()
		await findButton(wrapper, '保存').trigger('click')
		await flushPromises()

		expect(mocks.setActivationGroup).toHaveBeenCalledWith({
			ids: [11, 12],
			group: '2026 新生',
		})
	})

	it('生成 1-500 个激活码，并清理分组和备注首尾空格', async () => {
		const wrapper = await mountPage()
		const countInput = wrapper.getComponent(NInputNumberStub)
		countInput.vm.$emit('update:value', 500)
		const inputs = wrapper.findAllComponents(NInputStub)
		inputs[0].vm.$emit('update:value', '  教师  ')
		inputs[1].vm.$emit('update:value', '  秋季批次  ')
		await nextTick()

		await findButton(wrapper, '确认生成').trigger('click')
		await flushPromises()

		expect(mocks.generateActivationKeys).toHaveBeenCalledWith({
			count: 500,
			group: '教师',
			note: '秋季批次',
		})
	})

	it('拒绝超出 1-500 范围的生成数量', async () => {
		const wrapper = await mountPage()
		const countInput = wrapper.getComponent(NInputNumberStub)
		countInput.vm.$emit('update:value', 501)
		await nextTick()

		const generateButton = findButton(wrapper, '确认生成')
		expect(generateButton.attributes('disabled')).toBeDefined()
		await generateButton.trigger('click')
		await flushPromises()

		expect(mocks.generateActivationKeys).not.toHaveBeenCalled()
	})

	it('CSV 导出会阻止备注和分组触发电子表格公式', async () => {
		const dangerousRow: ActivationKey = {
			...rows[0],
			group_name: '=HYPERLINK("https://example.invalid")',
			note: '  +SUM(1,1)',
		}
		mocks.getActivationList.mockResolvedValueOnce(listResult({ total: 1, list: [dangerousRow] }))
		const createObjectURL = vi.fn(() => 'blob:activation-export')
		Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true })
		Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true })
		vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
		const wrapper = await mountPage()

		mocks.getActivationList.mockReset()
		mocks.getActivationList.mockResolvedValueOnce(listResult({ total: 1, list: [dangerousRow] }))
		await findButton(wrapper, '导出当前筛选 CSV').trigger('click')
		await flushPromises()

		const blob = createObjectURL.mock.calls[0][0] as Blob
		const csv = await blob.text()
		expect(csv).toContain(`"'=HYPERLINK(""https://example.invalid"")"`)
		expect(csv).toContain(`"'  +SUM(1,1)"`)
	})

	it('CSV 导出会保持状态和分组筛选，并拉取全部分页', async () => {
		const wrapper = await mountPage()
		const selects = wrapper.findAllComponents(NSelectStub)
		selects[0].vm.$emit('update:value', 1)
		selects[1].vm.$emit('update:value', '新生')
		await flushPromises()

		mocks.getActivationList.mockReset()
		mocks.getActivationList
			.mockResolvedValueOnce(listResult({ total: 501, page: 1, page_size: 500 }))
			.mockResolvedValueOnce(listResult({ total: 501, page: 2, page_size: 500, list: [rows[1]] }))
		const createObjectURL = vi.fn(() => 'blob:activation-export')
		const revokeObjectURL = vi.fn()
		Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true })
		Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true })
		const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

		await findButton(wrapper, '导出当前筛选 CSV').trigger('click')
		await flushPromises()

		expect(mocks.getActivationList).toHaveBeenNthCalledWith(1, {
			status: 1,
			group: '新生',
			page: 1,
			page_size: 500,
		})
		expect(mocks.getActivationList).toHaveBeenNthCalledWith(2, {
			status: 1,
			group: '新生',
			page: 2,
			page_size: 500,
		})
		expect(createObjectURL).toHaveBeenCalledOnce()
		expect(click).toHaveBeenCalledOnce()
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:activation-export')
	})
})
