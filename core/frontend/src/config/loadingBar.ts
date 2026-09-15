import { createDiscreteApi } from 'naive-ui'

const { loadingBar } = createDiscreteApi(['loadingBar'], {
	configProviderProps: {
		themeOverrides: {
			LoadingBar: {
				colorLoading: '#2563EB',
				colorError: '#ef0808',
			},
		},
	},
})

export default loadingBar
