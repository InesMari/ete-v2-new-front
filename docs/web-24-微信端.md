# 辅助模块 — 微信端（wx）

> 本文档覆盖 EDB 系统的微信端（`wx`）公众号下单 H5：通过二维码扫码进入下单页，无需登录，填单后直接创建货主订单。页面基于 Vant H5 组件库构建，是移动端轻量下单入口。

## 关联文档

| 文档 | 说明 |
|------|------|
| [web-20-登录与主框架](web-20-登录与主框架.md) | `/wxOrder` 入口分发 |
| [web-05-核心业务-订单管理](web-05-核心业务-订单管理.md) | orderService 下单服务 |
| [web-02-公共组件库](web-02-公共组件库.md) | mycityH5 省市区组件 |
| [api-00-接口清单](api-00-接口清单.md) | wx/order 接口事实源 |

## 模块总览

| 维度 | 说明 |
|------|------|
| 代码路径 | `src/page/wx/order/addOrder.vue` / `addOrder.js` / `addOrder.scss` |
| 入口 | `/wxOrder?code=<二维码ID>`，由 `App.vue` 分发 |
| UI 框架 | Vant 2（Icon/Button/Popup/Picker/Stepper/Switch/Field/Overlay/Loading）+ 自定义 H5 样式 |
| 流程 | 二维码校验 → 地址维护 → 下单信息 → 提交成功（四步向导） |
| 免登录 | 无登录页，靠二维码 `QRCodeID` 识别下单人/货主 |

## 目录树

```
src/page/wx/order/
├── addOrder.vue     # 模板（4 步向导 + 底部弹层）
├── addOrder.js      # 逻辑（含接口调用）
└── addOrder.scss    # 样式
```

## 一、进入流程

### 1.1 二维码校验（mounted 第一件事）

```js
this.codeValid = await this.common.postUrl("orderService", "checkQRCodeID", {
  QRCodeID: this.$route.query.code,
});
```

- `codeValid == 0`：页面显示「该二维码已失效」，不渲染表单
- `codeValid == 1`：初始化字典数据 + 装货时间选择数据，进入下单流程

### 1.2 移动端适配

- `setMeta()` 动态注入 viewport meta：禁缩放、适配移动端
- 依赖 Vant 组件按需注册（`[Icon.name]: Icon` 形式）

## 二、四步向导

| 步骤 | 标题 | 内容 | 校验/动作 |
|------|------|------|-----------|
| 1 | 去下单 | 装货地址列表（`workListTi`）+ 卸货地址列表（`workListXie`）、业务类型、装货时间 | 校验地址与时间后进入步骤 3 |
| 2 | 地址 | 粘贴识别 / 省市区选择（mycityH5）/ 详细地址 / 联系人 / 电话 | `sureSite` 校验省市区+详细地址+联系人+电话 |
| 3 | 完善信息 | 货物名称、总重量/体积、车长车型、结算方式、回单开关、结算价、是否含税、公司名称（含税时）、订单备注 | `save` 校验货物/重量体积/运费后提交 |
| 4 | 完成 | 提交成功图标 | 无 |

## 三、核心逻辑

### 3.1 地址模型

- 装货/卸货各维护一个列表（`workListTi` / `workListXie`），支持增删，列表顶部显示「一装一卸 / 多装多卸」
- 点击地址项进入步骤 2 编辑，`workType`（1 装货 / 2 卸货）+ `index` 定位回填
- 提交时合并为 `info.workList = [...workListTi, ...workListXie]`

### 3.2 地址识别（identify）

```js
this.common.postUrl("commonTF", "getSplitAddress", { addressStr }, null, null, null, true)
```

- 粘贴整段文字（含省市区+详细地址+联系人+电话），调用 `commonTF.getSplitAddress` 自动拆分
- 拆分结果回填省市区（province/city/district）、详细地址（address）、联系人（linkmanName）、电话（bill）

### 3.3 字典数据（initData）

| codeType | 用途 | 过滤规则 |
|----------|------|----------|
| `VEHICLE_TYPE_QUOTE` | 车型 | 仅保留 codeValue ∈ {2, 5, 10}，默认 5 |
| `VEHICLE_LENGTH` | 车长 | 仅保留 9.6m / 16.5m，默认 9.6m |
| `PAY_MODE` | 结算方式 | 全量，默认第 4 项（回单付） |
| `BIZ_TYPE` | 业务类型 | 仅取前两项，默认第一项 |

### 3.4 装货时间（initPickerDates）

- 本地生成 30 天日期（今天/明天/日期）+ 24 小时 + 每 10 分钟级联数据
- 三列 `van-picker` 选择，结果格式：`2026-08-21 14:30`

### 3.5 提交订单（save）

```js
this.info.workList = [...this.workListTi, ...this.workListXie];
this.info.haveReceipt = this.info.haveReceipt ? '1' : '0';   // 回单开关
this.info.isInvoice = this.info.isInvoice ? '1' : '0';        // 含税开关
this.info.QRCodeID = this.$route.query.code;                  // 二维码关联
this.common.postUrl("orderService", "saveOrder", this.info, successFn, errorFn);
```

- 提交后 `step = 4` 显示成功页；`showOverlay` 遮罩防止重复提交
- 该单以二维码携带的货主信息归属（`QRCodeID` 关联下单人），无需账号

## 四、接口汇总

| beanName | methodName | 用途 |
|----------|------------|------|
| `orderService` | `checkQRCodeID` | 校验二维码是否有效（0 失效 / 1 有效） |
| `orderService` | `saveOrder` | 保存微信下单订单 |
| `commonTF` | `getSysStaticData` | 车型/车长/结算方式/业务类型字典 |
| `commonTF` | `getSplitAddress` | 地址文本智能拆分 |

## 五、注意事项

1. **二维码即身份**：微信端不登录，二维码（`QRCodeID`）是订单归属的唯一凭据，二维码须由后台定向生成并管理有效期。
2. **车型/车长受限**：仅开放 2/5/10 车型与 9.6m/16.5m 车长，如需扩展在 `initData` 过滤逻辑中调整。
3. **地址识别依赖接口**：`getSplitAddress` 失败会提示「地址识别有误」并停留，可手动填写。
4. **移动端体验**：`van-picker` 底部弹层选择；步进器（Stepper）输入重量/体积；含税开关开启时才显示公司名称。
5. **与 hz 端下单差异**：wx 端为轻量四步向导且无账号体系，hz 端 `addOrderHZ` 为完整表单；两者最终都走 `orderTF.saveOrUpdateOrder` / `orderService.saveOrder` 创建订单。
