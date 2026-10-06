/**
 * Dify provider 解析逻辑单元测试
 *
 * 验证：
 *  - message 事件返回增量 answer 文本
 *  - message_end 事件提取 outputs.tool_calls 结构化 JSON（含容错解析）
 *  - 其他事件返回 null
 */
import { describe, it, expect } from 'vitest'
import { difyProvider, parseJsonFuzzy, extractToolCalls } from '../providers/dify.js'

describe('difyProvider.parseStreamLine', () => {
  it('message 事件返回增量 answer 文本', () => {
    const data = { event: 'message', answer: '正在为您查询' }
    expect(difyProvider.parseStreamLine(data)).toBe('正在为您查询')
  })

  it('message 事件 answer 为空时返回空串', () => {
    expect(difyProvider.parseStreamLine({ event: 'message', answer: '' })).toBe('')
  })

  it('message_end 事件提取 outputs.tool_calls（数组）', () => {
    const data = {
      event: 'message_end',
      outputs: {
        tool_calls: [
          { beanName: 'staffService', methodName: 'queryStaffPage', params: { staffName: '张三' } }
        ]
      }
    }
    const result = difyProvider.parseStreamLine(data)
    expect(result).toEqual({
      type: 'tool_calls',
      toolCalls: [
        { beanName: 'staffService', methodName: 'queryStaffPage', params: { staffName: '张三' } }
      ]
    })
  })

  it('message_end 事件 outputs.tool_calls 缺失时返回 null', () => {
    expect(difyProvider.parseStreamLine({ event: 'message_end', outputs: {} })).toBeNull()
  })

  it('message_end 事件 tool_calls 为空数组时返回 null', () => {
    expect(
      difyProvider.parseStreamLine({ event: 'message_end', outputs: { tool_calls: [] } })
    ).toBeNull()
  })

  it('非 message / message_end 事件返回 null', () => {
    expect(difyProvider.parseStreamLine({ event: 'node_finished', data: {} })).toBeNull()
    expect(difyProvider.parseStreamLine({ event: 'agent_message', answer: 'x' })).toBeNull()
  })

  it('异常/空输入返回 null', () => {
    expect(difyProvider.parseStreamLine(null)).toBeNull()
    expect(difyProvider.parseStreamLine(undefined)).toBeNull()
  })
})

describe('parseJsonFuzzy 容错解析', () => {
  it('解析标准 JSON 字符串', () => {
    expect(parseJsonFuzzy('{"a":1}')).toEqual({ a: 1 })
  })

  it('解析 markdown 代码块包裹的 JSON', () => {
    const str = '```json\n[{"beanName":"x","methodName":"y","params":{}}]\n```'
    expect(parseJsonFuzzy(str)).toEqual([{ beanName: 'x', methodName: 'y', params: {} }])
  })

  it('解析被前后文本包裹的 JSON 对象', () => {
    expect(parseJsonFuzzy('结果如下 {"beanName":"x","methodName":"y"} 请查收')).toEqual({
      beanName: 'x',
      methodName: 'y'
    })
  })

  it('无效字符串返回 null', () => {
    expect(parseJsonFuzzy('not json at all')).toBeNull()
    expect(parseJsonFuzzy('')).toBeNull()
  })
})

describe('extractToolCalls', () => {
  it('从 outputs 提取合法调用，过滤缺 beanName/methodName 的项', () => {
    const data = {
      outputs: {
        tool_calls: [
          { beanName: 'staffService', methodName: 'queryStaffPage', params: { staffName: '李四' } },
          { beanName: 'foo', params: {} }, // 缺 methodName，应被过滤
          'invalid-string'                  // 非对象，应被过滤
        ]
      }
    }
    const calls = extractToolCalls(data)
    expect(calls).toEqual([
      { beanName: 'staffService', methodName: 'queryStaffPage', params: { staffName: '李四' } }
    ])
  })

  it('支持单对象（非数组）归一化', () => {
    const data = {
      outputs: {
        tool_calls: { beanName: 'staffService', methodName: 'queryStaffPage', params: {} }
      }
    }
    expect(extractToolCalls(data)).toEqual([
      { beanName: 'staffService', methodName: 'queryStaffPage', params: {} }
    ])
  })

  it('无 outputs 返回 null', () => {
    expect(extractToolCalls({})).toBeNull()
    expect(extractToolCalls(null)).toBeNull()
  })
})
