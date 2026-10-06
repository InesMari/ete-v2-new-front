/**
 * extract-api.js — EDB 前端 API 调用提取脚本
 *
 * 功能：
 *   递归扫描 src 下所有 .js/.vue 文件，提取 common.postUrl("bean","method")
 *   与 $refs.xxx.load("bean","method") 形式的后端接口调用，
 *   按「端（pt/hz/edu/wx/sh/demo）+ 业务域」分组归类，
 *   生成 docs/api-00-接口清单.md（唯一事实源）。
 *
 * 用法（零依赖，任意环境直接运行）：
 *   node docs/tools/extract-api.js
 *
 * 说明：
 *   - 由脚本生成 docs/api-00-接口清单.md，如需修改请改本脚本后重新运行
 *   - 模板字符串 / 变量拼接的调用（动态 bean/method）无法静态解析，
 *     脚本会将其列入"动态调用（需人工核对）"清单
 *   - 特殊 URL 调用（如 "api/sysPrintBO.ajax?cmd=queryPrinters"）单独成表
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..'); // 项目根目录
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'docs', 'api-00-接口清单.md');

const FILE_EXT = ['.js', '.vue'];
// 排除目录
const IGNORE_DIRS = ['node_modules', 'static'];

// ---------------------------------------------------------------------------
// 1. 文件收集
// ---------------------------------------------------------------------------
function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (IGNORE_DIRS.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (FILE_EXT.includes(path.extname(e.name))) acc.push(full);
  }
  return acc;
}

// ---------------------------------------------------------------------------
// 2. 文本预处理：剥离注释（块注释 + 行注释），保留字符串
// ---------------------------------------------------------------------------
function stripComments(code) {
  let out = '';
  let i = 0;
  const len = code.length;
  let quote = null; // null | "'" | '"' | '`'
  while (i < len) {
    const c = code[i];
    const n = code[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') { out += n || ''; i += 2; continue; }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '/' && n === '/') { while (i < len && code[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < len - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++; i += 2; continue; }
    if (c === "'" || c === '"' || c === '`') quote = c;
    out += c;
    i++;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 3. 调用提取
//   匹配: postUrl("bean","method", ...) | .load("bean","method", ...)
// ---------------------------------------------------------------------------
const CALL_RE = /(?:postUrl|\.load)\s*\(\s*(["'`])([^"']+)\1\s*,\s*(["'`])([^"']+)\3/g;
// 动态调用（参数为变量/表达式）
const DYN_CALL_RE = /(?:postUrl|\.load)\s*\(\s*[^"'`\s][^,)]*,\s*[^)]*\)/g;

function isUrlLike(arg) {
  return /^(api\/|https?:|\/)/.test(arg);
}

function extract(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const cleaned = stripComments(code);
  const apis = new Map(); // key: bean|method -> {bean, method, file: filePath}
  const dyn = new Set();
  let urlCalls = 0;

  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(cleaned)) !== null) {
    const bean = m[2];
    const method = m[4];
    if (isUrlLike(bean)) { urlCalls++; continue; }
    if (!bean || !method || bean.length > 80 || method.length > 120) continue;
    const key = `${bean}\u0001${method}`;
    if (!apis.has(key)) apis.set(key, { bean, method, files: new Set() });
    apis.get(key).files.add(filePath);
  }

  DYN_CALL_RE.lastIndex = 0;
  while ((m = DYN_CALL_RE.exec(cleaned)) !== null) {
    dyn.add(m[0].replace(/\s+/g, ' '));
  }

  return { apis, dyn, urlCalls };
}

// ---------------------------------------------------------------------------
// 4. 归类：端 + 业务域
// ---------------------------------------------------------------------------
function classify(filePath) {
  const rel = path.relative(SRC, filePath).split(path.sep).join('/');
  const m = rel.match(/^page\/([^/]+)(?:\/([^/]+))?/);
  if (m) return { group: m[1], domain: m[2] || '其他' };
  if (rel.startsWith('components/')) {
    const seg = rel.split('/')[1] || '其他';
    return { group: 'components', domain: seg };
  }
  if (rel.startsWith('utils/')) return { group: 'utils', domain: '工具函数' };
  return { group: 'other', domain: '基础架构' };
}

// ---------------------------------------------------------------------------
// 5. 生成 Markdown
// ---------------------------------------------------------------------------
function render(groupData) {
  const lines = [];
  lines.push('# API 接口清单（前端调用事实源）');
  lines.push('');
  lines.push('> 本文档由 `docs/tools/extract-api.js` 脚本自动生成。');
  lines.push('> **修改入口**：请修改脚本后重新执行 `node docs/tools/extract-api.js`，勿直接编辑本文档。');
  lines.push('> 数据来源：`src` 下全部 `.js`/`.vue` 文件中 `common.postUrl("beanName","methodName",...)` 与 `$refs.xxx.load("beanName","methodName",...)` 调用。');
  lines.push('> 接口名约定：`beanName` 为后端服务标识，`methodName` 为服务方法名（与后端 Dubbo/Http 服务对应）。');
  lines.push('> 统计：__STATS__');
  lines.push('');

  let totalApi = 0;
  let totalFile = 0;

  const groupOrder = ['pt', 'hz', 'edu', 'wx', 'sh', 'demo', 'components', 'utils', 'other'];
  const groups = [...groupData.entries()].sort(
    (a, b) => groupOrder.indexOf(a[0]) - groupOrder.indexOf(b[0])
  );

  for (const [group, domainData] of groups) {
    lines.push(`## ${group}`);
    lines.push('');
    for (const [domain, apis] of domainData) {
      const apiArr = [...apis.values()].sort((a, b) => a.bean.localeCompare(b.bean) || a.method.localeCompare(b.method));
      lines.push(`### ${group}/${domain}`);
      lines.push('');
      lines.push(`共 ${apiArr.length} 个接口调用（去重后）。`);
      lines.push('');
      lines.push('| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |');
      lines.push('| --- | --- | --- | --- | --- |');
      apiArr.forEach((a, idx) => {
        const files = [...a.files].sort();
        const sample = files[0] ? files[0].split(path.sep).slice(-3).join('/') : '-';
        lines.push(`| ${idx + 1} | ${a.bean} | ${a.method} | ${files.length} | ${sample} |`);
      });
      totalApi += apiArr.length;
      lines.push('');
    }
  }

  return { lines: lines.join('\n'), totalApi };
}

// ---------------------------------------------------------------------------
// 6. 主流程
// ---------------------------------------------------------------------------
function main() {
  const files = walk(SRC);
  const groupData = new Map(); // group -> Map<domain, Map<key, api>>
  const allDyn = new Map();    // group -> Set<动态调用片段>
  let urlCalls = 0;

  for (const f of files) {
    const { apis, dyn, urlCalls: uc } = extract(f);
    urlCalls += uc;
    const { group, domain } = classify(f);

    if (!groupData.has(group)) groupData.set(group, new Map());
    const domainData = groupData.get(group);
    if (!domainData.has(domain)) domainData.set(domain, new Map());
    const domainApis = domainData.get(domain);

    for (const a of apis.values()) {
      const key = `${a.bean}\u0001${a.method}`;
      if (!domainApis.has(key)) domainApis.set(key, { bean: a.bean, method: a.method, files: new Set() });
      for (const fp of a.files) domainApis.get(key).files.add(fp);
    }

    if (dyn.size) {
      if (!allDyn.has(group)) allDyn.set(group, new Set());
      for (const d of dyn) allDyn.get(group).add(d);
    }
  }

  const { lines, totalApi } = render(groupData);
  const stats = `共扫描 ${files.length} 个文件，提取去重后接口调用 ${totalApi} 个，特殊 URL 调用 ${urlCalls} 次。`;

  // 动态调用清单
  let dynSection = '\n## 动态调用（需人工核对）\n\n';
  dynSection += '> 以下调用使用了变量/模板字符串拼接 bean 或 method，无法静态解析，请人工核对补充：\n\n';
  let dynCount = 0;
  for (const [group, dynSet] of allDyn) {
    dynSection += `### ${group}\n\n`;
    for (const d of dynSet) {
      dynSection += `- \`${d}\`\n`;
      dynCount++;
    }
    dynSection += '\n';
  }
  if (dynCount === 0) dynSection = '\n## 动态调用（需人工核对）\n\n暂未发现动态拼接调用。\n';

  const content = lines.replace('__STATS__', stats);
  const final = content + dynSection;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, final, 'utf8');
  console.log(`[OK] 已生成 ${path.relative(ROOT, OUT)}`);
  console.log(`     扫描文件: ${files.length}`);
  console.log(`     接口调用(去重): ${totalApi}`);
  console.log(`     特殊URL调用: ${urlCalls}`);
  console.log(`     动态调用: ${dynCount}`);
}

main();
