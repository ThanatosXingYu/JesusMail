import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
	getActivationConfig: vi.fn(),
	activateMailbox: vi.fn(),
}))

vi.mock('@/api/modules/activation', () => ({
	getActivationConfig: mocks.getActivationConfig,
	activateMailbox: mocks.activateMailbox,
}))

import ActivatePage from './index.vue'

const PassThroughStub = defineComponent({
	name: 'PassThroughStub',
	setup(_, { slots }) {
		return () => h('div', slots.default?.())
	},
})

const NFormStub = defineComponent({
	name: 'NForm',
	setup(_, { slots, expose }) {
		expose({ validate: () => Promise.resolve() })
		return () => h('form', slots.default?.())
	},
})

const NFormItemStub = defineComponent({
	name: 'NFormItem',
	props: { label: String, path: String },
	setup(props, { slots }) {
		return () => h('label', { 'data-label': props.label }, slots.default?.())
	},
})

const NInputStub = defineComponent({
	name: 'NInput',
	props: { value: String, type: String, placeholder: String },
	emits: ['update:value'],
	setup(props, { attrs, emit, slots }) {
		return () =>
			h(
				'input',
				{
					...attrs,
					value: props.value,
					placeholder: props.placeholder,
					onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
				},
				slots.default?.()
			)
	},
})

const NInputGroupLabelStub = defineComponent({
	name: 'NInputGroupLabel',
	setup(_, { slots }) {
		return () => h('span', { class: 'domain-suffix' }, slots.default?.())
	},
})

const mountPage = async () => {
	const wrapper = mount(ActivatePage, {
		global: {
			stubs: {
				NButton: PassThroughStub,
				NCard: PassThroughStub,
				NForm: NFormStub,
				NFormItem: NFormItemStub,
				NInput: NInputStub,
				NInputGroup: PassThroughStub,
				NInputGroupLabel: NInputGroupLabelStub,
			},
		},
	})
	await flushPromises()
	return wrapper
}

describe('公共激活页', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mocks.getActivationConfig.mockResolvedValue({ domain: 'mail.example.com', quota: 33554432 })
		mocks.activateMailbox.mockResolvedValue({ email: 'student@mail.example.com' })
	})

	it('首次加载即拉取公开配置，并用接口域名渲染邮箱后缀', async () => {
		const wrapper = await mountPage()

		expect(mocks.getActivationConfig).toHaveBeenCalledTimes(1)
		expect(wrapper.find('.domain-suffix').text()).toBe('@mail.example.com')
	})

	it('提交激活时不发送有效期字段', async () => {
		const wrapper = await mountPage()

		const inputs = wrapper.findAll('input')
		const [keyInput, prefixInput, passwordInput, password2Input] = inputs
		await keyInput.setValue('JESUSMAIL-ABCD-2345-EFGH')
		await prefixInput.setValue('student')
		await passwordInput.setValue('Passw0rd')
		await password2Input.setValue('Passw0rd')

		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()

		expect(mocks.activateMailbox).toHaveBeenCalledTimes(1)
		const payload = mocks.activateMailbox.mock.calls[0][0]
		expect(payload).toEqual({
			key: 'JESUSMAIL-ABCD-2345-EFGH',
			prefix: 'student',
			password: 'Passw0rd',
		})
		expect(payload).not.toHaveProperty('duration_days')
	})

	it('激活成功页提示永久有效并展示开通的邮箱', async () => {
		const wrapper = await mountPage()

		const inputs = wrapper.findAll('input')
		await inputs[0].setValue('JESUSMAIL-ABCD-2345-EFGH')
		await inputs[1].setValue('student')
		await inputs[2].setValue('Passw0rd')
		await inputs[3].setValue('Passw0rd')
		await wrapper.find('form').trigger('submit.prevent')
		await flushPromises()

		expect(wrapper.text()).toContain('student@mail.example.com')
		expect(wrapper.text()).toContain('永久有效')
		expect(wrapper.find('a').attributes('href')).toBe('/roundcube/')
	})

	it('底部入口跳转用户登录（Roundcube），而非管理后台登录', async () => {
		const wrapper = await mountPage()

		const footLink = wrapper.find('.foot a')
		expect(footLink.exists()).toBe(true)
		expect(footLink.text()).toBe('用户登录')
		expect(footLink.attributes('href')).toBe('/roundcube/')
		expect(wrapper.find('a[href="/login"]').exists()).toBe(false)
	})
})
