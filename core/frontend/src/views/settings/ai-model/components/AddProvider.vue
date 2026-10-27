<template>
	<n-modal
		v-model:show="show"
		preset="card"
		:close-on-esc="false"
		:mask-closable="false"
		draggable
		class="w-150"
		title="添加服务商">
		<n-form ref="addProviderFormDataRef" :model="addProviderFormData" :rules="rules">
			<n-form-item :label="$t('settings.aiModel.supplierTitle')" path="supplierTitle">
				<n-input v-model:value="addProviderFormData.supplierTitle"></n-input>
			</n-form-item>
			<n-form-item :label="$t('settings.aiModel.supplierName')" path="supplierName">
				<n-input v-model:value="addProviderFormData.supplierName"></n-input>
			</n-form-item>
			<n-form-item label="接口地址" path="baseUrl">
				<n-input v-model:value="addProviderFormData.baseUrl"></n-input>
			</n-form-item>
			<n-form-item label="接口密钥" path="apiKey">
				<n-input v-model:value="addProviderFormData.apiKey"></n-input>
			</n-form-item>
		</n-form>
		<template #footer>
			<div class="flex justify-end gap-5">
				<n-button>取消</n-button>
				<n-button type="primary" @click="confirmAddProvider(store)">确认</n-button>
			</div>
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import { confirmAddProvider } from '../controller'
import { ModelStore } from '../dto'
const store = inject<ModelStore>('modelStore')!
const { addProviderFormData, addProviderFormDataRef } = store
const show = ref(false)
const rules = {
	supplierTitle: [{ required: true, message: '请输入服务商标题', trigger: 'blur' }],
	supplierName: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
	baseUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
	apiKey: [{ required: true, message: '请输入接口密钥', trigger: 'blur' }],
}

/**
 * @description Open modal
 */
function open() {
	show.value = true
}

/**
 * @description Close modal
 */
function close() {
	show.value = false
}

defineExpose({
	open,
	close,
})
</script>

<style scoped></style>
