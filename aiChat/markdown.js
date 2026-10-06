import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.error('代码高亮失败:', e)
      }
    }
    try {
      return hljs.highlightAuto(code).value
    } catch (e) {
      return code
    }
  }
})

/**
 * 渲染 Markdown 内容为 HTML
 * @param {string} content - Markdown 文本
 * @returns {string} HTML 字符串
 */
export function renderMarkdown(content) {
  if (!content) return ''
  try {
    return marked.parse(content)
  } catch (e) {
    console.error('Markdown 解析失败:', e)
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

export default { renderMarkdown }
