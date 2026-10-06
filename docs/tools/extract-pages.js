/**
 * extract-pages.js — EDB 前端「页面索引」生成脚本
 *
 * 功能：
 *   1. 递归扫描 src/page/pt 下所有 .vue 页面文件，作为平台端页面全集；
 *   2. 从 pt 全部 .js/.vue 源码中抽取对每个页面的引用
 *      （openTab / devTab / urlPath 字面量）→ 得到 urlName 候选、urlPathName 候选、引用来源；
 *   3. 解析 docs/web-04 ~ web-21 模块文档的「页面清单表」，抽取页面功能描述与关键接口；
 *   4. 按页面 id（= /pt/...v.vue 路径）与既有 docs/pages-index.json 合并，
 *      保留人工精修字段（status=done 的 name/description/keywords/type/queryHint 等不被覆盖）；
 *   5. 输出 docs/pages-index.json（平台端页面索引事实源，供 AI 应用层/RAG 消费）。
 *
 * 用法（零依赖，任意环境直接运行）：
 *   node docs/tools/extract-pages.js
 *
 * 说明：
 *   - 平台端菜单树由后端 menuTF.loadMenuTree 动态下发，代码内不可见；
 *     本脚本只能收录「代码内可发现」的页面（源码 + devTab + router/config + docs 文档），
 *     后端菜单页需人工在 JSON 中补录（type/status 字段为此预留）。
 *   - docs 文档只覆盖核心页面；未命中文档的页面 descSource=none、status=todo，交由人工/AI 分批精修。
 *   - 人工精修请直接编辑 docs/pages-index.json；重新运行本脚本不会覆盖
 *     status=done 页面的 name/description/keywords/type/queryHint 等人工字段。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..'); // 项目根目录
const SRC = path.join(ROOT, 'src');
const SRC_PT = path.join(SRC, 'page', 'pt');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(DOCS, 'pages-index.json');
const GENERATOR = 'docs/tools/extract-pages.js';
const SCHEMA_VERSION = '1.0';
const EXTRA_SRC = ['src/router/config.js']; // 额外扫描的引用源（不在 src/page/pt 下）

// ---------------------------------------------------------------------------
// 0. pt 顶层目录 → 模块中文名 映射（同时是扫描后的归类依据）
// ---------------------------------------------------------------------------
const TOP_MODULES = {
  ord: '订单管理',
  wms: '仓储管理',
  fc: '财务管理',
  res: '资源管理',
  cm: '客户管理',
  purchase: '采购管理',
  dataReport: '数据报表',
  rpt: '数据报表',
  biz: '业务协同',
  base: '基础数据',
  device: '设备管理',
  pkg: '包裹管理',
  sp: '供应商管理',
  proj: '项目管理',
  hr: '人力资源',
  exc: '异常中心',
  operateLog: '操作日志',
  login: '登录',
  home: '主框架',
  notFindPage: '404',
};

// ---------------------------------------------------------------------------
// 1. 文档配置：web 文档 → 其覆盖的 pt 顶层目录
//    解析时：文档页面表内相对路径会依次尝试这些顶层目录拼接，命中磁盘文件才算解析成功
// ---------------------------------------------------------------------------
const DOC_LIST = [
  { file: 'web-05-核心业务-订单管理.md', tops: ['ord'] },
  { file: 'web-06-核心业务-仓储管理.md', tops: ['wms'] },
  { file: 'web-07-核心业务-财务管理.md', tops: ['fc'] },
  { file: 'web-08-核心业务-资源管理.md', tops: ['res'] },
  { file: 'web-09-核心业务-客户管理.md', tops: ['cm'] },
  { file: 'web-10-核心业务-采购管理.md', tops: ['purchase'] },
  { file: 'web-11-核心业务-数据报表.md', tops: ['dataReport', 'rpt'] },
  { file: 'web-12-核心业务-业务协同.md', tops: ['biz'] },
  { file: 'web-13-核心业务-基础数据.md', tops: ['base'] },
  { file: 'web-14-核心业务-设备管理.md', tops: ['device'] },
  { file: 'web-15-核心业务-包裹管理.md', tops: ['pkg'] },
  { file: 'web-16-核心业务-供应商管理.md', tops: ['sp'] },
  { file: 'web-17-核心业务-项目管理.md', tops: ['proj'] },
  { file: 'web-18-核心业务-人力资源.md', tops: ['hr'] },
  { file: 'web-19-核心业务-异常与日志.md', tops: ['exc', 'operateLog'] },
  // web-04 路由表、web-20 主框架、web-21 大屏看板：以绝对路径 / 相对 page/pt 写法为主，单独规则处理
  { file: 'web-20-登录与主框架.md', tops: ['login', 'home'], absoluteStyle: true },
  { file: 'web-21-大屏看板.md', tops: [], absoluteStyle: true },
  { file: 'web-04-状态管理与路由.md', tops: [], absoluteStyle: true },
];

// ---------------------------------------------------------------------------
// 2. 小工具
// ---------------------------------------------------------------------------
function walk(dir, acc = [], extSet) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc, extSet);
    else if (extSet.has(path.extname(e.name).toLowerCase())) acc.push(full);
  }
  return acc;
}

/** 剥离注释（块注释+行注释），保留字符串，避免注释/文档串干扰 */
function stripComments(code) {
  let out = '';
  let i = 0;
  const len = code.length;
  let quote = null;
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

/** 从一段代码文本中提取 common.postUrl/.load("bean","method") 接口调用 */
const CALL_RE = /(?:postUrl|\.load)\s*\(\s*(["'`])([^"']+)\1\s*,\s*(["'`])([^"']+)\3/g;
function extractApis(code) {
  const apis = [];
  const clean = stripComments(code);
  let m;
  while ((m = CALL_RE.exec(clean)) !== null) {
    const api = `${m[2]}.${m[4]}`;
    if (apis.indexOf(api) === -1) apis.push(api);
  }
  return apis;
}

/** 将绝对磁盘路径转为 src 相对路径（/ 分隔，不带前导 ./） */
function relOf(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

/**
 * 页面 id：相对 src/page 的 .vue 路径（含前导 / 与 .vue），
 * 形如 /pt/ord/order/orderManage.vue，与 myTab 动态 import('@/page'+urlPath) 约定一致
 */
function pageIdOf(abs) {
  const rel = path.relative(SRC, abs).replace(/^page[/\\]/, '');
  return '/' + rel.split(path.sep).join('/');
}

function cleanCellText(s) {
  if (!s) return '';
  return s
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// 3. 页面文件收集
// ---------------------------------------------------------------------------
const vueFiles = walk(SRC_PT, [], new Set(['.vue'])).sort();
console.log(`[1/5] 扫描到 pt 页面 .vue 文件：${vueFiles.length} 个`);

const pageIds = new Set(vueFiles.map(pageIdOf));

// ---------------------------------------------------------------------------
// 4. 源码引用抽取（openTab / devTab / urlPath 字面量）
//    refsByPath: { '/pt/...v.vue': { names: Map<urlName,count>, routeNames: Set, referrers: Set<srcRel> } }
// ---------------------------------------------------------------------------
const refsByPath = new Map();

function collectRefs(absFile) {
  let code;
  try { code = fs.readFileSync(absFile, 'utf8'); } catch { return; }
  const clean = stripComments(code);
  const re = /\/pt\/[\w/-]+\.vue/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const pathLit = m[0]; // 不含 query
    if (!pageIds.has(pathLit)) continue; // 只关心 pt 下存在的页面
    if (!refsByPath.has(pathLit)) refsByPath.set(pathLit, { names: new Map(), routeNames: new Set(), referrers: new Set() });
    const rec = refsByPath.get(pathLit);
    rec.referrers.add(relOf(absFile));
    // 在前后 800 字符窗口内寻找最近的 urlName / urlPathName 字面量
    const win = clean.slice(Math.max(0, m.index - 800), m.index + m[0].length + 800);
    const findNear = (key) => {
      const kRe = new RegExp(key + '\\s*[:=]\\s*["\']([^"\']+)["\']', 'g');
      let km; let best = null; let bestDist = Infinity;
      while ((km = kRe.exec(win)) !== null) {
        const pos = km.index + km[0].length;
        const dist = Math.abs(pos - 800); // 窗口中心即引用点附近
        if (dist < bestDist) { bestDist = dist; best = km[1]; }
      }
      return best;
    };
    const urlName = findNear('urlName');
    const urlPathName = findNear('urlPathName');
    if (urlName) rec.names.set(urlName, (rec.names.get(urlName) || 0) + 1);
    if (urlPathName) rec.routeNames.add(urlPathName);
  }
}

const refSrcFiles = walk(SRC_PT, [], new Set(['.js', '.vue']));
refSrcFiles.forEach(collectRefs);
for (const rel of EXTRA_SRC) collectRefs(path.join(ROOT, rel));

let totalRefs = 0;
refsByPath.forEach(r => { totalRefs += r.names.size + r.routeNames.size; });
console.log(`[2/5] 源码引用抽取完成：命中 ${refsByPath.size} 个页面，引用条目 ${totalRefs} 条`);

// ---------------------------------------------------------------------------
// 5. 页面级接口抽取（页面 .vue 及同名 .js 逻辑文件）
// ---------------------------------------------------------------------------
const apiByPage = new Map();
for (const absVue of vueFiles) {
  const apis = new Set();
  extractApis(fs.readFileSync(absVue, 'utf8')).forEach(a => apis.add(a));
  const siblingJs = absVue.replace(/\.vue$/i, '.js');
  if (fs.existsSync(siblingJs)) extractApis(fs.readFileSync(siblingJs, 'utf8')).forEach(a => apis.add(a));
  apiByPage.set(pageIdOf(absVue), Array.from(apis).sort());
}

// ---------------------------------------------------------------------------
// 6. docs 文档解析
// ---------------------------------------------------------------------------
const docHit = new Map();        // pageId -> { desc, apis: [], docFile }
const unresolvedRows = [];       // 文档中出现但无法落盘的行（供人工核对）

function resolveRelPath(rel, tops) {
  // rel 可能已带顶层前缀（如 dataReport/kanban/...），也可能不带（如 kanban/...）
  const firstSeg = rel.split('/')[0];
  if (tops.includes(firstSeg)) {
    const full = '/pt/' + rel;
    if (pageIds.has(full)) return full;
  }
  for (const t of tops) {
    const full = '/pt/' + t + '/' + rel;
    if (pageIds.has(full)) return full;
  }
  // 兜底：rel 本身就是相对 src/page/pt 的完整路径
  const full = '/pt/' + rel;
  if (pageIds.has(full)) return full;
  return null;
}

/** 从一行 markdown 表格中解析「路径所在单元格」，返回 { rowCells, pathCellIndex } */
function findPathCell(cells) {
  for (let i = 0; i < cells.length; i++) {
    const t = cells[i];
    if (/^`?[\w/.-]+\.vue`?$/.test(t.trim()) && /\.vue$/.test(t)) return { rowCells: cells, pathCellIndex: i };
  }
  return null;
}

function parseModuleDoc(docConf) {
  const abs = path.join(DOCS, docConf.file);
  if (!fs.existsSync(abs)) return;
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  let inPageTable = false; // 是否处于「页面 | 功能 | 关键接口」清单表中
  let sectionTitle = '';
  let pendingHeader = false;

  const flushSection = () => { sectionTitle = ''; };

  for (const line of lines) {
    const t = line.trim();
    // 节标题
    const hm = /^#{2,3}\s+(.*)$/.exec(t);
    if (hm) {
      // 只在大标题(##)层级更换 section，同时把 ## 3. 核心页面清单 后标记表格可能开始
      if (/^##\s+3\.|^##\s+核心页面清单/.test(t)) pendingHeader = true;
      flushSection();
      continue;
    }
    if (pendingHeader && /^##/.test(t)) { pendingHeader = false; }

    if (!/^\|/.test(t)) { inPageTable = false; continue; }

    const cells = t.split('|').slice(1, -1).map(cleanCellText);
    if (cells.length < 2) continue;

    // 表头识别：三列表「页面|功能|关键接口」或含「功能」的表格
    if (/^(页面|子模块|BeanName|功能|区域|图表|约定)$/.test(cells[0]) && /^(功能|说明|用途|核心功能)$/.test(cells[1] || '') && /(关键接口|接口|用途)/.test(cells[cells.length - 1] || '')) {
      if (cells[0] === '页面') inPageTable = true;
      continue; // 分隔行 `|---|`
    }
    if (/^:?-{2,}/.test(cells.join(''))) continue; // 表头分隔

    if (inPageTable) {
      const hit = findPathCell(cells);
      if (!hit) continue;
      const rel = hit.rowCells[hit.pathCellIndex].trim();
      const full = resolveRelPath(rel, docConf.tops);
      if (!full) {
        unresolvedRows.push({ doc: docConf.file, row: t });
        continue;
      }
      let desc = cells[hit.pathCellIndex + 1] || '';
      if (desc === '-' || desc === '—') desc = '';
      const apiCell = cells[hit.pathCellIndex + 2] || '';
      if (!docHit.has(full)) docHit.set(full, { desc: '', apis: [], names: [], docFile: docConf.file });
      const rec = docHit.get(full);
      if (desc && !rec.desc) rec.desc = desc;
      (apiCell.match(/[\w]+(?:\.[\w]+)+/g) || []).forEach(a => { if (rec.apis.indexOf(a) === -1) rec.apis.push(a); });
    }
  }
}

function parseAbsoluteDoc(docConf) {
  // web-04 / web-20 / web-21：绝对路径 /pt/xxx.vue 或 page/pt/xxx.vue 出现处，
  // 关联所在表格行的「中文名/说明」列
  const abs = path.join(DOCS, docConf.file);
  if (!fs.existsSync(abs)) return;
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!/^\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map(cleanCellText);
    if (!cells.length) continue;
    const joined = cells.join('|');
    const pm = /\/(?:page\/)?pt\/([\w/-]+\.vue)/.exec(joined);
    if (!pm) continue;
    const rel = pm[1];
    const full = '/pt/' + rel;
    if (!pageIds.has(full)) { unresolvedRows.push({ doc: docConf.file, row: line.trim() }); continue; }
    const pathCellIdx = cells.findIndex(c => c.indexOf(pm[0]) > -1 || c.indexOf(rel) > -1);
    if (pathCellIdx < 0) continue;
    let desc = cells[pathCellIdx + 1] || '';
    if (desc === '-' || desc === '—') desc = '';
    // 中文名候选：取路径单元格左侧最近的「含中文且非 URL」单元格
    let nameCandidate = '';
    for (let i = pathCellIdx - 1; i >= 0; i--) {
      const c = cells[i];
      if (c && !/^\//.test(c) && /[\u4e00-\u9fa5]/.test(c) && c.length <= 20) { nameCandidate = c; break; }
    }
    if (!docHit.has(full)) docHit.set(full, { desc: '', apis: [], names: [], docFile: docConf.file });
    const rec = docHit.get(full);
    if (desc && !rec.desc) rec.desc = desc;
    if (nameCandidate && rec.names.indexOf(nameCandidate) === -1) rec.names.push(nameCandidate);
  }
}

for (const dc of DOC_LIST) {
  if (dc.absoluteStyle) parseAbsoluteDoc(dc);
  else parseModuleDoc(dc);
}
console.log(`[3/5] docs 解析完成：命中 ${docHit.size} 个页面，未落盘 ${unresolvedRows.length} 行`);
if (unresolvedRows.length) {
  console.log(`      未落盘样例（前 5 条，全部见 meta.unresolvedRows）:`);
  unresolvedRows.slice(0, 5).forEach(r => console.log(`      - [${r.doc}] ${r.row}`));
}

// ---------------------------------------------------------------------------
// 7. 页面类型启发式推断（pageTypeHint 仅供初筛，type 可人工覆盖）
// ---------------------------------------------------------------------------
function pageTypeHint(pageId) {
  const lower = pageId.toLowerCase();
  const segs = pageId.split('/');               // ['', 'pt', top, ...]
  const top = segs[2];
  const base = segs[segs.length - 1].replace(/\.vue$/i, '');
  const dir = lower;

  if (/\/board\/|\/kanban\/|vehiclemonitorsaas\.vue$/.test(dir) || /(board|kanban)$/.test(base)) return 'bigScreen';
  if (top === 'login' || top === 'home' || top === 'notFindPage') return 'framework';
  // *Main.vue：页面签宿主（如 orderDetailMain / xxxMain），本身可作为独立标签页打开
  if (/main$/i.test(base)) return 'main';
  // 主列表/管理类页面
  if (/(manage|center|index|home|list|stat|summary|report|rpt|settle)$/i.test(base)) return 'menu';
  // 子页面签目录下的功能页 → 详情/子功能
  if (/\/subpage\//.test(dir)) return 'detail';
  // 详情/打印/新增/编辑/审核 等子功能页
  if (/(detail|print|preview|add|update|edit|create|save|change|modify|check|audit|review|scan|log|record|fee|income|verify|return|cancel|receive|refuse|upload|import|export|selstock)$/i.test(base)) return 'detail';
  if (segs.length > 4) return 'sub'; // 深目录多级子页
  return 'unknown';
}

// ---------------------------------------------------------------------------
// 8. 组装页面记录
// ---------------------------------------------------------------------------
function buildRecords() {
  const records = [];
  for (const absVue of vueFiles) {
    const id = pageIdOf(absVue); // 形如 /pt/ord/order/orderManage.vue
    const segs = id.split('/');
    const top = segs[2];
    const moduleName = TOP_MODULES[top] || top;
    const base = segs[segs.length - 1].replace(/\.vue$/i, '');
    const ref = refsByPath.get(id);

    const codeNameCandidates = ref ? Array.from(ref.names.entries()).sort((a, b) => b[1] - a[1]).map(e => e[0]) : [];
    const doc = docHit.get(id);
    const docNames = doc && doc.names ? doc.names : [];
    const nameCandidates = [];
    for (const n of [...codeNameCandidates, ...docNames]) {
      if (n && nameCandidates.indexOf(n) === -1) nameCandidates.push(n);
    }
    const routeNames = ref ? Array.from(ref.routeNames) : [];
    if (!routeNames.length) routeNames.push('/' + base); // 与 myTab 缺省 urlPathName 规则一致
    const apis = Array.from(new Set([...(apiByPage.get(id) || []), ...(doc ? doc.apis : [])])).sort();
    const referrers = ref ? Array.from(ref.referrers).sort() : [];

    const name = nameCandidates[0] || '';
    const description = doc ? doc.desc : '';
    const descSource = doc ? 'doc' : '';

    records.push({
      id,
      name,
      end: 'pt',
      module: top,
      moduleName,
      filePath: id,
      urlPath: id,
      routeNames,
      nameCandidates,
      type: 'page',
      pageTypeHint: pageTypeHint(id),
      description,
      descSource,
      keywords: [],
      relatedApis: apis.slice(0, 30),
      queryHint: '',
      referencedBy: referrers.slice(0, 10),
      fileExists: true,
      status: description ? 'draft' : 'todo',
    });
  }
  return records;
}

// ---------------------------------------------------------------------------
// 9. 与既有 JSON 合并（保护人工精修字段）
// ---------------------------------------------------------------------------
const MANUAL_FIELDS = ['name', 'description', 'keywords', 'type', 'queryHint'];

function mergeWithExisting(autoRecords) {
  let oldMap = new Map();
  // --fresh：忽略既有 JSON（历史 id 错乱或需全量重建时使用）
  const fresh = process.argv.includes('--fresh');
  if (!fresh && fs.existsSync(OUT)) {
    try {
      const old = JSON.parse(fs.readFileSync(OUT, 'utf8'));
      (old.pages || []).forEach(p => oldMap.set(p.id, p));
    } catch (e) {
      console.warn(`[warn] 解析既有 ${path.basename(OUT)} 失败，将直接全新生成：`, e.message);
    }
  }

  const outPages = [];
  let doneCount = 0;

  for (const auto of autoRecords) {
    const old = oldMap.get(auto.id);
    let merged;
    if (old && old.status === 'done') {
      // 人工已完成：整体保留人工版本，仅刷新机器字段
      merged = Object.assign({}, old);
      for (const f of MANUAL_FIELDS) {
        if (!merged[f] || (Array.isArray(merged[f]) && merged[f].length === 0)) {
          if (auto[f] && auto[f].length) merged[f] = auto[f];
        }
      }
      merged.module = auto.module; merged.moduleName = auto.moduleName; merged.end = 'pt';
      merged.filePath = auto.id; merged.urlPath = auto.id; merged.fileExists = true;
      merged.pageTypeHint = auto.pageTypeHint;
      merged.routeNames = Array.from(new Set([...(merged.routeNames || []), ...auto.routeNames]));
      merged.relatedApis = Array.from(new Set([...(merged.relatedApis || []), ...auto.relatedApis])).sort().slice(0, 30);
      merged.referencedBy = auto.referencedBy.length ? auto.referencedBy : merged.referencedBy || [];
      merged.descSource = merged.descSource || auto.descSource;
      doneCount++;
    } else {
      // 未人工完成：以本次自动结果为准，但保留旧条目中人工填过的非空字段（视为部分精修）
      merged = Object.assign({}, auto);
      if (old) {
        for (const f of MANUAL_FIELDS) {
          const v = old[f];
          if (v && (!(f in merged) || (Array.isArray(merged[f]) && merged[f].length === 0) || !merged[f])) {
            merged[f] = Array.isArray(v) ? v.slice() : v;
          }
        }
        if (old.status === 'done' || old.status === 'draft') merged.status = old.status;
        if (old.descSource) merged.descSource = old.descSource;
        merged.relatedApis = Array.from(new Set([...auto.relatedApis, ...(old.relatedApis || [])])).sort().slice(0, 30);
      }
      if (old && old.status === 'done') doneCount++;
    }
    oldMap.delete(auto.id);
    outPages.push(merged);
  }

  // 旧条目对应文件已不存在 → 标记 fileMissing，不删除
  oldMap.forEach((old) => {
    old.fileExists = false;
    outPages.push(old);
  });

  outPages.sort((a, b) => (a.id < b.id ? -1 : 1));
  return outPages;
}

// ---------------------------------------------------------------------------
// 10. 输出
// ---------------------------------------------------------------------------
function main() {
  const autoRecords = buildRecords();
  const pages = mergeWithExisting(autoRecords);

  const stat = { total: 0, done: 0, draft: 0, todo: 0, fileMissing: 0 };
  const perModule = {};
  for (const p of pages) {
    stat.total++;
    if (!p.fileExists) stat.fileMissing++;
    else if (p.status === 'done') stat.done++;
    else if (p.status === 'draft') stat.draft++;
    else stat.todo++;
    const key = `${p.module}(${p.moduleName})`;
    perModule[key] = (perModule[key] || 0) + 1;
  }

  const out = {
    schemaVersion: SCHEMA_VERSION,
    end: 'pt',
    generatedAt: new Date().toISOString().slice(0, 10),
    generator: GENERATOR,
    description: 'EDB 平台端(pt)页面索引事实源：页面路径 + 功能说明 + 引用关系，供 AI 应用层(导航/问答/关键词/RAG)消费。人工精修请直接编辑本文件；重新运行 ' + GENERATOR + ' 不会覆盖 status=done 的人工字段。',
    moduleNames: TOP_MODULES,
    stat,
    perModule: Object.entries(perModule).sort((a, b) => b[1] - a[1]).map(([module, count]) => ({ module, count })),
    meta: {
      scope: 'src/page/pt 下全部 .vue',
      docFiles: DOC_LIST.map(d => d.file),
      note: '后端菜单树由 menuTF.loadMenuTree 动态下发，代码内不可见；本清单为「代码内可发现」页面全集，后端菜单页(含菜单层级/可达性)需人工补录。status 含义: todo=待精修, draft=有自动描述待复核, done=人工精修完成, fileMissing=对应文件已删除。',
      unresolvedRows: unresolvedRows.slice(0, 200),
    },
    pages,
  };

  const json = JSON.stringify(out, null, 2) + '\n';
  fs.writeFileSync(OUT, json, 'utf8');
  console.log(`[4/5] 生成 ${path.basename(OUT)}：${pages.length} 个页面记录`);
  console.log(`      stat: ${JSON.stringify(stat)}`);
  console.log(`      模块分布 Top10: `);
  out.perModule.slice(0, 10).forEach(m => console.log(`        ${m.module}: ${m.count}`));
  console.log(`[5/5] 完成。未落盘文档行 ${unresolvedRows.length} 条已写入 meta.unresolvedRows（前 200 条）。`);
}

main();
