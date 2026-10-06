# 工具函数库 — EDB 企业数字化管理平台

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 项目架构 |
| [web-01-开发规范.md](./web-01-开发规范.md) | API 调用与权限规范 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | 组件如何消费工具函数 |

## 1. 模块总览

`src/utils/` 下共 11 个工具模块：

| 文件 | 定位 | 核心能力 |
|------|------|---------|
| `common.js` | 核心工具（全项目引用） | API 请求封装、精确计算、日期处理、校验、下载、WebSocket 等 65+ 方法 |
| `directive.js` | 自定义指令 | 权限（v-entity）与数字输入限制指令 |
| `filter.js` | 全局过滤器 | 金额格式化、千分位、空值兜底 |
| `bus.js` | 事件总线 | 跨组件通信 |
| `excelOut.js` | Excel 导出 | 前端导出带样式的 xlsx |
| `coordtransform.js` | 坐标系转换 | BD09 / GCJ02 / WGS84 互转 |
| `md5.js` | MD5 加密 | 字符串 MD5 |
| `sha.js` | SHA 加密 | SHA1/SHA256 等 |
| `base64.js` | Base64 编码 | Base64 编解码 |
| `lodop/` | 打印 | LODOP 打印控件封装 |
| `filter.js` 挂载方式 | Vue.filter | 模板内直接使用 |

## 2. common.js（核心工具）

> 位置：`src/utils/common.js`，默认导出 `common` 对象，页面中通过 `this.common.xxx()` 或 `import common from '@/utils/common'` 使用。

### 2.1 API 请求封装

| 方法 | 签名 | 说明 |
|------|------|------|
| `postUrl` | `postUrl(beanName, methodName, param, successFun, errorFun, type, shadow)` | 通用接口调用（Promise），所有业务请求入口 |
| `downloadExcelFile` | `(fileName, beanName, methodName, params)` | 后端导出 Excel 文件 |
| `frontDownloadExcelFile` | `(fileName, rows, header, merges, multiHeader, noBg)` | 前端本地导出 Excel |
| `downloadFile` | `(url, fileName)` | 下载文件 |
| `visitPDF` | `(url)` | 查看 PDF |
| `uploadFile` | `(file, beanName, methodName)` | 上传文件/图片 |
| `getFileFullPath` | `async (filePaths, isBigImg)` | 获取文件完整路径（含图片大小模式） |
| `startWebSocket` | `(url, onmessage)` | 初始化 WebSocket 连接 |

### 2.2 精确计算（decimal.js）

| 方法 | 说明 |
|------|------|
| `accAdd(arg1, arg2)` | 精确加法 |
| `accSub(arg1, arg2)` | 精确减法 |
| `accMul(arg1, arg2)` | 精确乘法（任一参数为空返回 0） |
| `accDiv(arg1, arg2)` | 精确除法 |
| `Number.prototype.myToFixed(digit)` | 四舍五入截取指定位数并补零 |

> 金额计算必须使用上述方法，禁止浮点直接运算（见 [web-01-开发规范.md](./web-01-开发规范.md)）。

### 2.3 校验工具

| 方法 | 说明 |
|------|------|
| `isBlank(value)` | 是否为空（null/undefined/''/[]/{}） |
| `isNotBlank(value)` | 是否非空 |
| `validatemobile(mobile)` | 手机号校验 |
| `validateTel(tel)` | 固定电话校验 |
| `checkNum(value)` | 数字校验 |

### 2.4 日期与时间

| 方法 | 说明 |
|------|------|
| `formatDate(date, fmt)` | 日期格式化 |
| `formatTime(time)` | 时间格式化 |
| `formatSeconds(seconds)` | 秒 → 时分秒 |
| `getYearMonths()` | 获取接下来一年的年月列表 |
| `queryMonthList()` | 获取近 3 个月列表 |
| `getDaysInMonthByString(dateString)` | 获取指定月份的天数 |
| `getFormatDate_XLSX(serial)` | Excel 日期序列号 → Date 对象 |
| `getYearMonths` / `queryMonthList` | 月历选项生成（供选择器使用） |

### 2.5 对象与数据处理

| 方法 | 说明 |
|------|------|
| `copyObj(obj)` | 对象深度拷贝 |
| `mergeObj(...)` | 对象合并或拷贝 |
| `getMapLength(json)` | 获取 JSON 第一层长度 |
| `treeFn(tree, idField)` | el-tree 控件获取全部 id |
| `formatData(content)` | 内容格式化 |
| `setTableTitle(title, key)` | 生成表格 title |
| `setSearchIsshowAll()` | 搜索栏条件是否全部展示 |
| `tableStretch()` | 表格列宽自由拖动 |
| `initTableHeight()` | 计算表格高度 |

### 2.6 业务辅助

| 方法 | 说明 |
|------|------|
| `md5(str)` | MD5 加密 |
| `base64(str)` | Base64 转换 |
| `getUrlId(type, id)` | 根据打开类型生成页面 urlId（add/update/detail/verify/print/copy） |
| `getBigImgPath(path)` | 拼接大图路径 |
| `getFileType(file)` | 获取文件类型 |
| `getRealFileName` / `getSrcFileName` | 文件名处理 |
| `numberToChinese(num)` | 阿拉伯数字转繁体中文数字 |
| `initDevices()` | 初始化打印机 |
| `initTheme(theme)` | 设置主题色（edu=红，其他=蓝） |
| `diabledInput()` | 操作框禁用 |
| `isLocalHost()` | 判断是否本地打开 |
| `shade` | 遮罩层公用方法 |
| `parseBoxQrcodeInfo(qrcode)` | 解析 150 位箱二维码信息 |
| `getDisplayCodeNum(qrcode)` | 从二维码取显示编码 |
| `shareRate` | 分享比例常量 |

### 2.7 常量与状态

| 成员 | 说明 |
|------|------|
| `appId` | 应用标识 |
| `intfKey` | 接口密钥 |
| `userInfo` | 当前用户信息（localStorage） |

## 3. filter.js（全局过滤器）

| 过滤器 | 说明 | 示例 |
|--------|------|------|
| `double` | 保留两位小数 | `{{ price \| double }}` → `12.50` |
| `permill` | 千分位格式化 | `{{ amount \| permill }}` → `1,234,567.89` |
| `numberToCurrencyNo` | 千分位 + 小数 | `{{ amount \| numberToCurrencyNo }}` |
| `numberToCurrencyNoByFlag` | 带开关的千分位 | `{{ amount \| numberToCurrencyNoByFlag(flag) }}` |
| `emptyToStr` | 空值显示 `--` | `{{ value \| emptyToStr }}` |
| `emptyToZero` | 空值显示 `0` | `{{ value \| emptyToZero }}` |

## 4. bus.js（事件总线）

导出全局 `Vue` 实例作为事件总线，用于跨组件（非父子）通信：

```js
import bus from '@/utils/bus'
// 发送
bus.$emit('eventName', payload)
// 接收
bus.$on('eventName', handler)
// 移除
bus.$off('eventName')
```

## 5. excelOut.js（Excel 导出）

基于 `xlsx-style` 封装，支持表头样式、合并单元格、边框、加密保护：

| 导出函数 | 参数 | 说明 |
|----------|------|------|
| `export_table_to_excel(id)` | 表格 DOM id | 将页面表格导出为 xlsx |
| `export_json_to_excel({title, multiHeader, header, data, filename, merges, autoWidth, bookType, noBg, setStyle, disabled})` | 配置对象 | 按 JSON 数据导出带样式 Excel |

常用配置说明：

| 配置项 | 说明 |
|--------|------|
| `title` | 表标题（首行） |
| `multiHeader` | 多级表头（数组，从下往上排列） |
| `header` | 表头行 |
| `data` | 数据行 |
| `merges` | 合并单元格（如 `['A1:C1']`） |
| `autoWidth` | 自动列宽（默认 true） |
| `disabled` | 是否开启工作表保护（密码 `yqy168`） |

## 6. coordtransform.js（坐标系转换）

提供国内常用坐标系互转，用于地图轨迹、定位展示：

| 函数 | 说明 |
|------|------|
| `bd09togcj02(bd_lon, bd_lat)` | 百度 → 高德/谷歌 |
| `gcj02tobd09(lng, lat)` | 高德/谷歌 → 百度 |
| `wgs84togcj02(lng, lat)` | GPS(WGS84) → 高德/谷歌 |
| `gcj02towgs84(lng, lat)` | 高德/谷歌 → GPS |

> 国内坐标使用前自动判断是否在境外（`out_of_china`），境外不做偏移。

## 7. 加密与编码

| 模块 | 提供 | 用途 |
|------|------|------|
| `md5.js` | `md5(str)` | 参数签名/密码摘要（也通过 `common.md5` 暴露） |
| `sha.js` | SHA 系列哈希 | 接口签名计算 |
| `base64.js` | Base64 编解码 | 文件/参数编码 |
| `jsencrypt`（依赖） | RSA 加解密 | 敏感参数加密（`$getRsaCode`） |

## 8. lodop（打印）

`src/utils/lodop/` 封装 LODOP 打印控件，用于业务单据（订单、运单、回单等）的本地打印：

- 初始化打印机：`common.initDevices()`
- 打印页面的 `print-js` 兜底

---

> 各工具函数在业务中的实际调用分布可检索 [api-00-接口清单.md](./api-00-接口清单.md) 与业务模块文档。
