<template>
	<div>
		<div class="mb-4 text-sm font-medium text-basic">
			{{ t('settings.common.activationWelcome.title') }}
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<n-form-item :label="t('settings.common.activationWelcome.enabled')">
				<div class="flex items-center gap-3">
					<n-switch v-model:value="form.enabled" />
					<span class="text-sm text-desc">
						{{ form.enabled ? t('settings.common.activationWelcome.on') : t('settings.common.activationWelcome.off') }}
					</span>
				</div>
			</n-form-item>
			<n-form-item :label="t('settings.common.activationWelcome.sender')">
				<n-input
					v-model:value="form.sender"
					:placeholder="t('settings.common.activationWelcome.senderPlaceholder')"
				/>
			</n-form-item>
			<n-form-item class="md:col-span-2" :label="t('settings.common.activationWelcome.subject')">
				<n-input v-model:value="form.subject" :maxlength="200" show-count />
			</n-form-item>
		</div>
		<div class="mt-1">
			<n-button type="primary" :loading="saving" :disabled="!canSave" @click="save">
				{{ t('settings.common.activationWelcome.save') }}
			</n-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { setSystemConfigKey } from '@/api/modules/settings/common'
import { getSettingsStore } from '../../store'

const { t } = useI18n()
const { welcomeEmail } = getSettingsStore()
const saving = ref(false)
const form = reactive({
	enabled: true,
	sender: '',
	subject: '',
})

watch(
	welcomeEmail,
	value => {
		form.enabled = value.enabled
		form.sender = value.sender
		form.subject = value.subject
	},
	{ immediate: true, deep: true }
)

const canSave = computed(() => form.subject.trim().length > 0)

const save = async () => {
	if (!canSave.value || saving.value) return
	saving.value = true
	try {
		await Promise.all([
			setSystemConfigKey(
				{ key: 'welcome_email_enabled', value: String(form.enabled) },
				{ successMessage: false }
			),
			setSystemConfigKey(
				{ key: 'welcome_email_sender', value: form.sender.trim() },
				{ successMessage: false }
			),
			setSystemConfigKey({ key: 'welcome_email_subject', value: form.subject.trim() }),
		])
		welcomeEmail.value.enabled = form.enabled
		welcomeEmail.value.sender = form.sender.trim().toLowerCase()
		welcomeEmail.value.subject = form.subject.trim()
	} finally {
		saving.value = false
	}
}
</script>
