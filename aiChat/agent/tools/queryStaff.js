/**
 * 员工查询工具 - 封装 staffService.queryStaffPage 调用
 *
 * 使用 baseTool 声明式工厂，只需配置字段 + API 调用即可完成注册。
 * 新增其他业务查询工具时，复制此文件修改 config 即可，无需重写格式化/错误处理逻辑。
 */

import common from '/src/utils/common.js'
import { createQueryTool } from '../baseTool.js'

/** 单条结果展示字段 */
const DISPLAY_FIELDS = [
  { key: 'staffName',           label: '姓名' },
  { key: 'workNum',             label: '工号' },
  { key: 'sexName',             label: '性别' },
  { key: 'billId',              label: '手机号' },
  { key: 'idCard',              label: '证件号码' },
  { key: 'birthdayDate',        label: '出生日期' },
  { key: 'age',                 label: '年龄' },
  { key: 'settleBodyName',      label: '结算主体' },
  { key: 'orgNames',            label: '部门' },
  { key: 'positionNames',       label: '岗位' },
  { key: 'staffRankName',       label: '职级' },
  { key: 'staffClassName',      label: '员工级别' },
  { key: 'workNatureName',      label: '工作性质' },
  { key: 'staffStateName',      label: '入员状态' },
  { key: 'entryDate',           label: '入职日期' },
  { key: 'becomeDate',          label: '转正日期' },
  { key: 'resignDate',          label: '离职日期' },
  { key: 'companyAge',          label: '司龄' },
  { key: 'probationPeriodName', label: '试用期' },
  { key: 'educationName',       label: '学历' },
  { key: 'graduateName',        label: '毕业院校' },
  { key: 'bankCard',            label: '工资卡卡号' },
  { key: 'bankDeposit',         label: '开户行' },
  { key: 'schemeName',          label: '社保公积金方案' },
  { key: 'personSocialSecurity',     label: '个人社保' },
  { key: 'personAccumulationFund',   label: '个人公积金' },
  { key: 'companySocialSecurity',    label: '公司社保' },
  { key: 'companyAccumulationFund',  label: '公司公积金' },
  { key: 'remark',              label: '备注' }
]

/** 多条结果简要字段 */
const BRIEF_FIELDS = [
  { key: 'staffName',       label: '姓名' },
  { key: 'workNum',         label: '工号' },
  { key: 'orgNames',        label: '部门' },
  { key: 'positionNames',   label: '岗位' },
  { key: 'staffStateName',  label: '状态' }
]

/**
 * 查询适配器：将 tool 参数转为 staffService 调用
 */
async function queryFn(params) {
  const name = params.staffName?.trim()
  if (!name) {
    return { items: [], totalNum: 0 }
  }

  const result = await common.postUrl('staffService', 'queryStaffPage', {
    staffName: name,
    page: 1,
    rows: 50
  })

  // 限制最多返回 5 条，避免 token 过多
  if (result?.items?.length > 5) {
    result.items = result.items.slice(0, 5)
  }

  return result
}

/**
 * 注册员工查询工具到工具注册表
 */
export function registerQueryStaffTool() {
  createQueryTool({
    name: 'queryStaff',
    description: '根据员工姓名查询员工详细信息，包括部门、岗位、职级、手机号、入职日期、社保公积金等。当用户询问某个员工的资料、信息、部门、联系方式时调用此工具。',
    paramsSchema: {
      type: 'object',
      properties: {
        staffName: { type: 'string', description: '员工姓名，支持模糊匹配' }
      },
      required: ['staffName']
    },
    displayFields: DISPLAY_FIELDS,
    briefFields: BRIEF_FIELDS,
    queryFn
  })
}

export { queryFn }
