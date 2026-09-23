import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(resolve(process.cwd(), 'src/views/mailbox/index.vue'), 'utf8')

describe('邮箱列表的固定视口布局', () => {
	it('工具栏和分页留在页面内，数据表格承担纵向滚动', () => {
		const template = source.split('<script')[0]
		const css = source.split('<style scoped>')[1]

		expect(template).toMatch(/class="p-24px mailbox-page"/)
		expect(template).toMatch(/class="mailbox-table-viewport"/)
		expect(template).toMatch(/<n-data-table[^>]*class="mailbox-table"[^>]*flex-height/s)
		expect(template).toContain('<template #pageRight>')
		expect(css).toMatch(/\.mailbox-page\s*\{[^}]*height:\s*calc\(100dvh - 48px\)/)
		expect(css).toMatch(/\.mailbox-table-viewport\s*\{[^}]*min-height:\s*0/)
		expect(css).toMatch(/\.mailbox-table\s*\{[^}]*height:\s*100%/)
	})

	it('操作列保留一键登录、编辑和删除，列宽收紧', () => {
		const script = source.split('<script lang="tsx" setup>')[1].split('</script>')[0]
		expect(script).toMatch(/key:\s*'actions',[\s\S]*?width:\s*230/)
		expect(script).toContain('size={8}')
		expect(script).toContain('handleOneClickLogin(row)')
		expect(script).toContain('handleEdit(row)')
		expect(script).toContain('handleDelete(row)')
	})
})
