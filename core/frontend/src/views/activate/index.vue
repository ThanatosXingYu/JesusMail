<template>
	<div class="activate-page">
		<n-card class="activate-card" :bordered="false">
			<div v-if="!email" class="brand">
				<img src="@/assets/images/logo.png" alt="JesusMail" />
				<h1>JesusMail</h1>
				<p>使用激活密钥开通你的邮箱</p>
			</div>
			<div v-if="email" class="success-box">
				<div class="success-icon">✓</div>
				<h2>你的邮箱已就绪</h2>
				<div class="email">{{ email }}</div>
				<p>登录密码为你刚才设置的密码，请妥善保管。邮箱永久有效，不会过期。本次激活密钥已作废，请勿重复使用。</p>
				<n-button type="primary" size="large" block tag="a" href="/roundcube/">前往登录邮箱</n-button>
			</div>
			<n-form
				v-else
				ref="formRef"
				:model="form"
				:rules="rules"
				label-placement="top"
				@submit.prevent="submit">
				<n-form-item label="激活密钥" path="key">
					<n-input
						v-model:value="form.key"
						maxlength="24"
						placeholder="JESUSMAIL-XXXX-XXXX-XXXX"
						@update:value="form.key = form.key.toUpperCase()" />
				</n-form-item>
				<n-form-item label="邮箱前缀" path="prefix">
					<n-input-group>
						<n-input
							v-model:value="form.prefix"
							maxlength="30"
							placeholder="3-30 位字母、数字或 . _ -"
							@update:value="form.prefix = form.prefix.toLowerCase()" />
						<n-input-group-label>{{ domainSuffix }}</n-input-group-label>
					</n-input-group>
				</n-form-item>
				<n-form-item label="设置密码" path="password">
					<n-input
						v-model:value="form.password"
						type="password"
						show-password-on="click"
						maxlength="64"
						placeholder="8-64 位，须同时包含字母和数字" />
				</n-form-item>
				<n-form-item label="确认密码" path="password2">
					<n-input
						v-model:value="form.password2"
						type="password"
						show-password-on="click"
						maxlength="64"
						placeholder="再次输入密码"
						@keyup.enter="submit" />
				</n-form-item>
				<n-form-item label="邮箱有效期">
					<div class="expiry-tip">永久有效：激活成功后邮箱不会过期，可长期使用。</div>
				</n-form-item>
				<n-button type="primary" size="large" block :loading="loading" attr-type="submit"
					>立即开通邮箱</n-button
				>
			</n-form>
			<div class="foot">
				<a href="/roundcube/" rel="noopener">用户登录</a>
			</div>
		</n-card>
	</div>
</template>

<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'
import { activateMailbox, getActivationConfig } from '@/api/modules/activation'

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const email = ref('')
const domain = ref('')
const form = reactive({ key: '', prefix: '', password: '', password2: '' })

const domainSuffix = computed(() => (domain.value ? `@${domain.value}` : '@...'))

const fetchConfig = async () => {
	try {
		const data = await getActivationConfig()
		if (data?.domain) {
			domain.value = data.domain
		}
	} catch {
		// 配置获取失败时保持占位域名，用户提交后仍会得到正确结果
	}
}

onMounted(fetchConfig)

const rules: FormRules = {
	key: [
		{
			required: true,
			pattern: /^(?:JESUSMAIL|QLU)-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/,
			message: '请输入正确格式的激活密钥',
			trigger: ['blur', 'input'],
		},
	],
	prefix: [
		{
			required: true,
			pattern: /^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/,
			message: '请输入 3-30 位合法邮箱前缀',
			trigger: ['blur', 'input'],
		},
	],
	password: [
		{
			required: true,
			min: 8,
			max: 64,
			validator: (_rule, value: string) => /[A-Za-z]/.test(value) && /\d/.test(value),
			message: '密码需 8-64 位且同时包含字母和数字',
			trigger: ['blur', 'input'],
		},
	],
	password2: [
		{
			required: true,
			validator: (_rule, value: string) => value === form.password,
			message: '两次输入的密码不一致',
			trigger: ['blur', 'input'],
		},
	],
}

const submit = async () => {
	await formRef.value?.validate()
	loading.value = true
	try {
		const data = (await activateMailbox({
			key: form.key,
			prefix: form.prefix,
			password: form.password,
		})) as { email: string }
		email.value = data.email
		if (data.email.includes('@')) {
			domain.value = data.email.slice(data.email.indexOf('@') + 1)
		}
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
.activate-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: linear-gradient(135deg, #263b48, #40545d 55%, #31586a);
}
.activate-card {
	width: 100%;
	max-width: 460px;
	padding: 14px 12px 6px;
	border-radius: 16px;
	box-shadow: 0 20px 55px rgba(0, 0, 0, 0.35);
}
.brand {
	text-align: center;
	margin-bottom: 24px;
	img {
		width: 64px;
		height: 64px;
		object-fit: contain;
	}
	h1 {
		font-size: 24px;
		margin: 8px 0 2px;
	}
	p {
		color: var(--color-text-3);
		margin: 0;
	}
}
.expiry-tip {
	color: var(--color-text-3);
	font-size: 12px;
	line-height: 1.6;
}
.success-box {
	text-align: center;
	.success-icon {
		width: 58px;
		height: 58px;
		border-radius: 50%;
		margin: 4px auto 12px;
		color: white;
		background: var(--color-primary-1);
		font-size: 38px;
		line-height: 58px;
	}
	h2 {
		margin: 0 0 12px;
	}
	.email {
		display: inline-block;
		padding: 10px 18px;
		margin-bottom: 14px;
		color: #2563eb;
		background: #eff6ff;
		border: 1px dashed #93c5fd;
		border-radius: 8px;
		font-size: 17px;
		font-weight: 600;
		user-select: all;
	}
	p {
		color: var(--color-text-3);
		line-height: 1.7;
		text-align: left;
		margin: 0 0 20px;
	}
}
.foot {
	margin-top: 20px;
	text-align: center;
	font-size: 12px;
	a {
		color: var(--color-text-3);
	}
}
</style>
