/**
 * 关键词匹配器 - 基于正则快速匹配常见查询意图，提取实体名称
 *
 * 在消息发送前进行本地拦截，识别意图后直接调用工具，避免不必要的 AI 调用。
 * 每个规则包含：
 *   pattern  - 正则表达式，使用命名捕获组 (?<entity>...) 提取实体名
 *   toolName - 命中的工具名
 *   buildParams - 根据正则匹配结果构建工具参数
 */

/** @type {Array<MatcherRule>} */
const rules = [
  // ---- 员工信息查询 ----
  {
    pattern: /^(?:帮我)?(?:查(?:询|一下|看)?|看看|看看|显示|展示)?(.{1,20}?)(?:的)?(?:资料|信息|详情|档案|个人资料|员工信息)$/,
    toolName: 'queryStaff',
    buildParams(match) {
      const name = match[1].trim()
      if (!name) return null
      return { staffName: name }
    }
  },
  {
    pattern: /^(?:查(?:询|一下|看)?|看看|搜索)?(.{1,20})(?:是|在)哪(?:个部门|个部门|部门)/,
    toolName: 'queryStaff',
    buildParams(match) {
      const name = match[1].trim()
      if (!name) return null
      return { staffName: name }
    }
  },
  {
    pattern: /^(.{1,20})(?:的)?(?:手机号|电话|工号|部门|岗位|职级|薪资|社保|公积金|入职日期|转正日期)(?:是|多少|是什么)/,
    toolName: 'queryStaff',
    buildParams(match) {
      const name = match[1].trim()
      if (!name) return null
      return { staffName: name }
    }
  },
  {
    pattern: /^(?:查询|搜索|查找)(?:员工)?[：:]?\s*(.{1,20})$/,
    toolName: 'queryStaff',
    buildParams(match) {
      const name = match[1].trim()
      if (!name) return null
      return { staffName: name }
    }
  },
  {
    pattern: /^(.{2,4})资料$/,
    toolName: 'queryStaff',
    buildParams(match) {
      const name = match[1].trim()
      if (!name) return null
      return { staffName: name }
    }
  }
]

/**
 * 匹配用户输入，判断是否命中某个工具
 * @param {string} text 用户输入文本
 * @returns {{ hit: boolean, toolName?: string, params?: object }}
 */
export function match(text) {
  if (!text || typeof text !== 'string') return { hit: false }

  for (const rule of rules) {
    const matchResult = text.match(rule.pattern)
    if (matchResult) {
      const params = rule.buildParams(matchResult)
      if (params) {
        return {
          hit: true,
          toolName: rule.toolName,
          params
        }
      }
    }
  }

  return { hit: false }
}

/**
 * 添加自定义匹配规则
 * @param {MatcherRule} rule
 */
export function addRule(rule) {
  rules.push(rule)
}

/**
 * 获取当前所有规则
 * @returns {MatcherRule[]}
 */
export function getRules() {
  return rules
}

/**
 * @typedef {object} MatcherRule
 * @property {RegExp} pattern - 匹配正则
 * @property {string} toolName - 工具名
 * @property {function(RegExpMatchArray): object|null} buildParams - 从匹配结果提取参数
 */
