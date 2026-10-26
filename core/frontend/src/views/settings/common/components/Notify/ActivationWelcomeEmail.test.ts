import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
	setSystemConfigKey: vi.fn(),
	welcomeEmail: null as unknown,
}))

vi.mock('@/api/modules/settings/common', () => ({
	setSystemConfigKey: mocks.setSystemConfigKey,
}))

vi.mock('@/views/settings/common/store', () => ({
	getSettingsStore: () => ({ welcomeEmail: mocks.welcomeEmail }),
}))

import i18n from '@/i18n'
import ActivationWelcomeEmail from './ActivationWelcomeEmail.vue'

const PassthroughStub = defineComponent({
	setup(_, { slots }) {
		return () => h('div', slots.default?.())
	},
})

const NFormItemStub = defineComponent({
	props: { label: String },
	setup(props, { slots }) {
		return () => h('label', [props.label, slots.default?.()])
	},
})

const NInputStub = defineComponent({
	props: { value: String },
	emits: ['update:value'],
	setup(props, { attrs, emit }) {
		return () =>
			h('input', {
				...attrs,
				value: props.value,
				onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
			})
	},
})

const NSwitchStub = defineComponent({
	props: { value: Boolean },
	emits: ['update:value'],
	setup(props, { emit }) {
		return () =>
			h('button', {
				'data-test': 'switch',
				'data-value': String(props.value),
				onClick: () => emit('update:value', !props.value),
			})
	},
})

const NButtonStub = defineComponent({
	props: { loading: Boolean, disabled: Boolean },
	emits: ['click'],
	setup(props, { emit, slots }) {
		return () =>
			h(
				'button',
				{
					disabled: props.disabled,
					onClick: () => emit('click'),
				},
				slots.default?.()
			)
	},
})

describe('ActivationWelcomeEmail settings', () => {
	beforeEach(() => {
		i18n.global.locale.value = 'en'
		vi.clearAllMocks()
		mocks.setSystemConfigKey.mockResolvedValue(undefined)
		mocks.welcomeEmail = ref({
			enabled: true,
			sender: '',
			subject: '您的 JesusMail 邮箱已成功激活',
		})
	})

	it('saves enabled, sender and subject through the option API keys', async () => {
		const wrapper = mount(ActivationWelcomeEmail, {
			global: {
				plugins: [i18n],
				stubs: {
					NFormItem: NFormItemStub,
					NInput: NInputStub,
					NSwitch: NSwitchStub,
					NButton: NButtonStub,
					NDivider: PassthroughStub,
				},
			},
		})

		const inputs = wrapper.findAllComponents(NInputStub)
		await inputs[0].vm.$emit('update:value', ' Welcome@Example.COM ')
		await inputs[1].vm.$emit('update:value', '欢迎邮件')
		await wrapper.get('[data-test="switch"]').trigger('click')
		await flushPromises()
		const saveButton = wrapper.findAll('button').find(button => button.text() === 'Save Settings')
		if (!saveButton) throw new Error('save button not found')
		await saveButton.trigger('click')
		await flushPromises()

		expect(mocks.setSystemConfigKey).toHaveBeenCalledWith(
			{ key: 'welcome_email_enabled', value: 'false' },
			{ successMessage: false }
		)
		expect(mocks.setSystemConfigKey).toHaveBeenCalledWith(
			{ key: 'welcome_email_sender', value: 'Welcome@Example.COM' },
			{ successMessage: false }
		)
		expect(mocks.setSystemConfigKey).toHaveBeenCalledWith({
			key: 'welcome_email_subject',
			value: '欢迎邮件',
		})
	})
})
