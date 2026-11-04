/*
 * Expiring Blocks 1.1.0 - by paipa, MIT License
 * https://github.com/Paipa03/obsidian-expiring-blocks
 *
 * Maintainer notes:
 * - Editor Enhancer and Expiring Blocks share one toggle / layout engine
 *   (toggle markers and expiry metadata, title caret guards, folding and scroll
 *   pinning, hierarchy layout CSS, block boundaries / drag / menus, toggleApi and
 *   the engine hand-over). Editor Enhancer's main.js is the source of that
 *   engine; Expiring Blocks ships a copy so it also works on its own.
 * - Any change to the shared engine goes into both plugins in the same release,
 *   tested with both installed and with each one installed alone.
 */

// ---- i18n ----
// UI text. English is the base language; PAIPA_I18N_ZH maps each English
// string to Simplified Chinese. paipaLang mirrors Expiring Blocks' settings.language
// ("auto" | "en" | "zh"); "auto" follows Obsidian's own language.
let paipaLang = "auto";
function paipaSetLang(value) {
  paipaLang = value === "en" || value === "zh" ? value : "auto";
}
function paipaObsidianLang() {
  try {
    const o = require("obsidian");
    const l = (typeof o.getLanguage === "function" && o.getLanguage()) || window.localStorage.getItem("language") || "en";
    return /^zh/i.test(String(l)) ? "zh" : "en";
  } catch (e) { return "en"; }
}
function paipaEffectiveLang() {
  return paipaLang === "en" || paipaLang === "zh" ? paipaLang : paipaObsidianLang();
}
function paipaT(en, vars) {
  let s = en;
  if (paipaEffectiveLang() === "zh" && Object.prototype.hasOwnProperty.call(PAIPA_I18N_ZH, en)) s = PAIPA_I18N_ZH[en];
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m);
  return s;
}
const PAIPA_I18N_ZH = {
  "Web bookmark": "网页书签",
  "Scratch": "临时记录",
  "Editor Enhancer": "Editor Enhancer（优化编辑器）",
  "Language": "语言",
  "Follow Obsidian's language, or choose one for this plugin.": "跟随 Obsidian 的语言，或为本插件单独选择。",
  "Follow Obsidian": "跟随 Obsidian",
  "Feature modules (all on by default, each can be turned off separately)": "功能模块（全部默认开启，可独立开关）",
  "Notion blocks": "Notion 块功能",
  "Six-dot drag handles, block menu, plus button to insert lines, multi-select drag and block spacing. When off, native block interaction returns; other modules are unaffected.": "六点拖拽手柄、块菜单、加号插行、多选整体拖拽与块间距排版。关闭后恢复原生块交互，其他模块不受影响。",
  "Toggle lists": "Toggle List 功能",
  "Notion-style collapsible lists and related changes to native behavior (heading folds taken over, protected lines, etc.). When off, toggle markers show as plain text; turning it back on restores them.": "Notion 式可折叠列表及相关原生行为修改（heading 折叠接管、保护行等）。关闭后 TL 标记显示为原始文本，重新开启即恢复。",
  "List markers as a unit": "列表标记整体化",
  "In Live Preview, the bullet / number / checkbox in front of a list line acts as one unit: the cursor never stops inside it, one Backspace removes the whole marker (a nested item first moves up one level), Delete at the end of a line joins the next item, and ← from the start of the text goes straight to the end of the previous line. When off, Obsidian's native character-by-character deletion returns.": "实时预览里，列表行前的圆点 / 数字 / 复选框是一个整体：光标不会停在标记里，Backspace 一次删掉整个标记（嵌套项先退一级），行尾 Delete 一次并入下一项，← 从文字开头直接到上一行末尾。关闭后恢复 Obsidian 原生的逐字符删除。",
  "Context menu enhancements": "右键菜单增强",
  "Tidies the right-click menu (this plugin's items are grouped in their own section and replace the native delete item) and enables \"Don't select line on right-click\". When off, the right-click menu fully returns to Obsidian's native behavior.": "整理右键菜单（本插件的菜单项集中为独立分组、替换原生删除项）以及「右键不选中整行」。关闭后右键菜单完全恢复 Obsidian 原生行为。",
  "Table link navigation (mobile)": "表格链接跳转（手机端）",
  "On mobile, tapping an internal link in a table opens it directly (as on desktop); tapping anywhere else still starts editing, and links that can't be resolved fall back to editing.": "手机上点按表格中的内部链接直接跳转（与电脑端一致）；点按链接以外的位置仍进入编辑，无法解析的链接回落为编辑。",
  "Restore scroll position when returning to a page": "返回页面时恢复滚动位置",
  "When you reopen a page viewed earlier in this session (for example, going back after following a link), the scroll position you left it at is restored; long pages no longer land at the bottom.": "重新打开本次会话看过的页面（如点击链接后返回）时，恢复离开时的滚动位置；长页面不再落到底端。",
  "Details": "细项",
  "Don't select line on right-click": "右键不选中整行",
  "Right-click only opens the menu without selecting the whole line first; an existing selection is kept. Requires \"Context menu enhancements\".": "右键只打开菜单，不先选中整行；已有选区会被保留。需开启「右键菜单增强」。",
  "Enable block spacing": "启用段落间距",
  "Add Notion-style extra spacing between content blocks. Requires \"Notion blocks\".": "在内容块之间添加 Notion 风格的额外间距。需开启「Notion 块功能」。",
  "Drag handle": "拖拽图标",
  "Handle opacity": "图标透明度",
  "Opacity before hover (0.1 – 1.0).": "悬停前的透明度（0.1 – 1.0）。",
  "Handle distance from content": "图标距内容距离",
  "Gap between the handle and the left edge of the content (0 – 40 px).": "图标与内容左缘的间距（0 – 40 px）。",
  "Handle padding": "图标内边距",
  "Distance from the dot grid to the handle's border (1 – 16 px).": "圆点阵列到图标边框的距离（1 – 16 px）。",
  "Dot diameter": "圆点直径",
  "1.5 – 8 px.": "1.5 – 8 px。",
  "Dot spacing": "圆点间距",
  "1 – 6 px.": "1 – 6 px。",
  "Dot gray level": "圆点灰度",
  "0 = white, 100 = black.": "0 = 白，100 = 黑。",
  "Toggle triangle size": "Toggle 三角图标大小",
  "10 – 28 px.": "10 – 28 px。",
  "Drop indicator line": "拖拽插入位置横线",
  "Line thickness": "横线粗细",
  "1 – 8 px.": "1 – 8 px。",
  "Line opacity": "横线不透明度",
  "0.1 – 1.0.": "0.1 – 1.0。",
  "Notion-style spacing": "Notion 风格行间距",
  "Block spacing": "Block 间距",
  "Spacing between adjacent content blocks (2 – 32 px).": "相邻内容块之间的间距（2 – 32 px）。",
  "Line spacing within a block": "Block 内行间距",
  "Extra spacing between lines of text within one block (0 = theme default, up to 20 px).": "同一 block 内多行文字的额外行距（0 = 主题默认，最大 20 px）。",
  "Insert blank line below": "在下方插入空行",
  "Toggle list": "折叠列表",
  "(empty)": "（空）",
  "Collapse toggle list": "收起折叠列表",
  "Expand toggle list": "展开折叠列表",
  "Toggle List is disabled in settings": "Toggle List 功能已在设置中关闭",
  "Delete": "删除",
  "This row is already a toggle list": "该行已经是折叠列表",
  "Duplicate": "创建副本",
  "Paste": "粘贴",
  "Cut": "剪切",
  "Insert line above": "在上方插入行",
  "Insert line below": "在下方插入行",
  "Duplicated below": "已在下方创建副本",
  "Expiring block": "时效块",
  "Create expiring block": "创建时效块",
  "{n} day": "{n} 天",
  "{n} days": "{n} 天",
  "Expires on {date}; contents have expired": "到期日期：{date}；正文已到期",
  "Expires on {date}; contents are cleared when it expires": "到期日期：{date}；到期自动清空正文",
  "{badge}, {title}": "{badge}，{title}",
  "Restart the timer from today": "从今天重新计时",
  "Reset timer": "重置时效",
  "Clear contents": "清空内容",
  "Toggle engine failed to load": "折叠引擎未能载入",
  "Cannot clear an incomplete block.": "无法清空不完整的时效块。",
  "Write down what you need to keep for now…": "写下暂时需要保留的内容…",
  "Expiring block update failed: {error}": "时效块未能完成更新：{error}",
  "Expiring Blocks": "Expiring Blocks（时效块）",
  "Lifetime (days)": "有效期（天）",
  "1–3650 days. Applied when editing content or resetting.": "1–3650 天。编辑内容或重置时生效。",
  "Enter a whole number from 1 to 3650.": "请输入 1 到 3650 之间的整数。",
  "Right-click a blank line to create a block. Reset restarts the timer; Clear removes its contents.": "在空行上右键即可创建时效块。重置会重新计时，清空会删除其中的内容。",
  "2 days: yellow. 1 day: red. Expired contents are cleared; titles remain. Checked on opening, focus, midnight and every 2 hours.": "剩 2 天显示黄色，剩 1 天显示红色。到期后正文被清空，标题保留。在打开笔记、窗口获得焦点、午夜以及每 2 小时时检查。"
};
// ---- end i18n ----

var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// core.js
var require_core = __commonJS({
  "core.js"(exports2, module2) {
    "use strict";
    var OPEN = /%%\s*nsb-toggle\s+({.*})\s*%%\s*$/;
    var CLOSE = /^\s*%%\s*\/nsb-toggle\s*%%\s*$/;
    var DAY = 864e5;
    function deadline(expiry) {
      if (!expiry || expiry.v !== 1 || !Number.isSafeInteger(expiry.updatedAt) || expiry.updatedAt < 0 || !Number.isInteger(expiry.days) || expiry.days < 1 || expiry.days > 3650) return null;
      const date = new Date(expiry.updatedAt);
      date.setDate(date.getDate() + expiry.days);
      return Number.isFinite(date.getTime()) && date.getFullYear() >= 0 && date.getFullYear() <= 9999 ? date : null;
    }
    function validExpiry(expiry) {
      return deadline(expiry) !== null;
    }
    function ordinal(date) {
      const utc = /* @__PURE__ */ new Date(0);
      utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return utc.getTime() / DAY;
    }
    function remainingDays(expiry, now = Date.now()) {
      const end = deadline(expiry);
      const today = new Date(now);
      return end && Number.isFinite(today.getTime()) ? Math.max(0, ordinal(end) - ordinal(today)) : null;
    }
    function expiryDate(expiry) {
      const end = deadline(expiry);
      return end ? [
        String(end.getFullYear()).padStart(4, "0"),
        String(end.getMonth() + 1).padStart(2, "0"),
        String(end.getDate()).padStart(2, "0")
      ].join("-") : null;
    }
    function renew(meta, days, now = Date.now()) {
      const expiry = { v: 1, updatedAt: now, days };
      if (!validExpiry(expiry)) throw new RangeError("Invalid expiry date or lifetime");
      return { ...meta, open: meta.open === true, v: 2, expiry };
    }
    function marker(meta) {
      if (!meta || typeof meta.id !== "string" || !meta.id.trim() || meta.expiry !== void 0 && !validExpiry(meta.expiry)) throw new TypeError("Invalid toggle metadata");
      return "%% nsb-toggle " + JSON.stringify({ ...meta, open: meta.open === true, v: 2 }) + " %%";
    }
    function parseDocument(text, editing = false) {
      if (typeof text !== "string") throw new TypeError("Expected document text");
      let offset = 0;
      const lines = text.split("\n").map((raw, number) => {
        const value = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
        const line = {
          text: value,
          number,
          from: offset,
          to: offset + value.length,
          next: Math.min(text.length, offset + raw.length + 1)
        };
        offset += raw.length + 1;
        return line;
      });
      const stack = [], blocks = [], blankLines = /* @__PURE__ */ new Set(), openerLines = /* @__PURE__ */ new Set();
      let fence = null, fenceIndent = 0, fenceQuote = false, comment = false, yaml = false, indentedCode = false;
      for (const line of lines) {
        const value = line.text;
        if (line.number === 0 && /^\uFEFF?---\s*$/.test(value)) {
          yaml = true;
          continue;
        }
        if (yaml) {
          if (/^(---|\.\.\.)\s*$/.test(value)) yaml = false;
          continue;
        }
        if (fence) {
          const quoted = /^ {0,3}(?:>[ \t]*)+/.exec(value);
          const end = (!fenceQuote || quoted) && /^([ \t]*)(`+|~+)\s*$/.exec(fenceQuote ? value.slice(quoted[0].length) : value);
          const indent = end && end[1].replace(/\t/g, "    ").length;
          if (end && indent >= fenceIndent && indent <= fenceIndent + 3 && end[2][0] === fence[0] && end[2].length >= fence.length) fence = null;
          continue;
        }
        if (!comment) {
          if (/^(?: {4}| {0,3}\t)/.test(value)) {
            indentedCode = true;
            continue;
          }
          if (indentedCode && !value.trim()) continue;
          indentedCode = false;
          const quotedFence = /^ {0,3}(?:>[ \t]*)+(`{3,}|~{3,})(.*)$/.exec(value);
          if (quotedFence && (quotedFence[1][0] !== "`" || !quotedFence[2].includes("`"))) {
            fence = quotedFence[1];
            fenceIndent = 0;
            fenceQuote = true;
            continue;
          }
          const listFence = /^( {0,3}(?:[-+*]|\d{1,9}[.)])[ \t]+)(`{3,}|~{3,})(.*)$/.exec(value);
          if (listFence && (listFence[2][0] !== "`" || !listFence[3].includes("`"))) {
            fence = listFence[2];
            fenceIndent = listFence[1].replace(/\t/g, "    ").length;
            fenceQuote = false;
            continue;
          }
        }
        const begin = !comment && /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(value);
        if (begin && (begin[1][0] !== "`" || !begin[2].includes("`"))) {
          fence = begin[1];
          fenceIndent = 0;
          fenceQuote = false;
          continue;
        }
        if (!comment && /^\s*$/.test(value)) blankLines.add(line.number);
        for (let at = 0; at < value.length; ) {
          if (comment) {
            const end = value.indexOf("%%", at);
            if (end < 0) break;
            comment = false;
            at = end + 2;
            continue;
          }
          if (value[at] === "`") {
            const ticks = /^`+/.exec(value.slice(at))[0];
            let end = at + ticks.length;
            for (; ; ) {
              end = value.indexOf(ticks, end);
              if (end < 0 || value[end - 1] !== "`" && value[end + ticks.length] !== "`") break;
              end += ticks.length;
            }
            at = end < 0 ? at + ticks.length : end + ticks.length;
            continue;
          }
          if (!value.startsWith("%%", at)) {
            at++;
            continue;
          }
          let slashes = 0;
          for (let n = at - 1; n >= 0 && value[n] === "\\"; n--) slashes++;
          if (slashes % 2) {
            at += 2;
            continue;
          }
          if (!/^%%\s*\/?nsb-toggle\b/.test(value.slice(at))) {
            comment = true;
            at += 2;
            continue;
          }
          if (CLOSE.test(value)) {
            if (editing) break;
            if (!stack.length) return null;
            const block = stack.pop();
            if (block.titleLine >= line.number) return null;
            block.endLine = line.number;
            block.bodyEndLine = line.number - 1;
            block.bodyTo = line.from;
            block.to = line.to;
            block.body = text.slice(block.bodyFrom, block.bodyTo);
            if (block.meta.v === 2 && validExpiry(block.meta.expiry)) blocks.push(block);
          } else {
            const match = OPEN.exec(value);
            let meta;
            try {
              if (match && match.index === at) meta = JSON.parse(match[1]);
            } catch (_) {
            }
            if (!meta || typeof meta !== "object" || Array.isArray(meta) || typeof meta.id !== "string" || !meta.id.trim()) {
              if (!editing) return null;
              comment = true;
              at += 2;
              continue;
            }
            if (editing) {
              openerLines.add(line.number);
              break;
            }
            const before = value.slice(0, at);
            const legacy = before.trim() === "" && meta.v !== 2;
            const titleLine = line.number + (legacy ? 1 : 0);
            const title = lines[titleLine];
            if (!title) return null;
            stack.push({
              id: meta.id,
              meta,
              startLine: line.number,
              titleLine,
              bodyStartLine: titleLine + 1,
              from: line.from,
              titleTo: title.to,
              markerFrom: line.from + at,
              bodyFrom: title.next,
              title: legacy ? title.text : before.replace(/[ \t]$/, "")
            });
          }
          break;
        }
      }
      if (editing) return openerLines;
      if (stack.length || comment || fence || yaml) return null;
      return { blocks: blocks.sort((a, b) => a.from - b.from), blankLines };
    }
    function scan(text) {
      return parseDocument(text)?.blocks || [];
    }
    function editingOpenerLines(text) {
      return parseDocument(text, true);
    }
    function canCreateAt(text, line0) {
      return Number.isInteger(line0) && line0 >= 0 && !!parseDocument(text)?.blankLines.has(line0);
    }
    function expireChanges(text, now = Date.now()) {
      const changes = [];
      for (const block of scan(text)) {
        if (remainingDays(block.meta.expiry, now) !== 0) continue;
        const newline = text.slice(block.titleTo, block.bodyFrom) || "\n";
        if (block.body === newline) continue;
        const previous = changes[changes.length - 1];
        if (previous && block.bodyFrom >= previous.from && block.bodyTo <= previous.to) continue;
        changes.push({ from: block.bodyFrom, to: block.bodyTo, insert: newline });
      }
      return changes;
    }
    function applyChanges(text, changes) {
      if (typeof text !== "string" || !Array.isArray(changes)) throw new TypeError("Invalid document changes");
      const sorted = [...changes].sort((a, b) => a.from - b.from || a.to - b.to);
      for (let i = 0; i < sorted.length; i++) {
        const change = sorted[i], previous = sorted[i - 1];
        if (!change || !Number.isInteger(change.from) || !Number.isInteger(change.to) || change.from < 0 || change.to < change.from || change.to > text.length || typeof change.insert !== "string" || previous && (change.from < previous.to || change.from === previous.from)) {
          throw new RangeError("Invalid or overlapping document changes");
        }
      }
      for (const change of sorted.reverse()) text = text.slice(0, change.from) + change.insert + text.slice(change.to);
      return text;
    }
    module2.exports = { scan, editingOpenerLines, canCreateAt, validExpiry, remainingDays, expiryDate, renew, marker, expireChanges, applyChanges };
  }
});

// vendor/toggle-engine.js
var require_toggle_engine = __commonJS({
  "vendor/toggle-engine.js"(exports2, module2) {
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var main_exports = {};
    __export(main_exports, { default: () => NotionStyleBlocksPlugin });
    module2.exports = __toCommonJS(main_exports);
    var import_obsidian = require("obsidian");
    var import_state = require("@codemirror/state");
    var import_view = require("@codemirror/view");
    var import_language = null;
    try {
      import_language = require("@codemirror/language");
    } catch (_) {
      import_language = null;
    }
    function isMobileDevice() {
      if (typeof import_obsidian.Platform !== "undefined" && import_obsidian.Platform.isMobile) return true;
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches) return true;
      return false;
    }
    function isLivePreviewEditorView(editorView) {
      if (!editorView || !editorView.dom) return false;
      let el = editorView.dom;
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains("is-source-mode")) return false;
        if (el.classList && el.classList.contains("is-live-preview")) return true;
        el = el.parentElement;
      }
      return false;
    }
    var DEFAULT_SETTINGS = {
      handleOpacity: 0.5,
      handleSize: 20,
      handleOffset: 4,
      dotSize: 3.5,
      dotGap: 2.5,
      dotGray: 55,
      toggleIconSize: 16,
      suppressRightClickLineSelection: true,
      lineHeight: 3,
      lineOpacity: 0.65,
      blockSpacingEnabled: true,
      blockSpacingPx: 8,
      lineSpacingPx: 0,
      developerMode: false,
      tlFeaturesEnabled: true,
      blockFeaturesEnabled: true,
      contextMenuFeaturesEnabled: true,
      restoreScrollOnReopen: true,
      mobileTableLinkNav: true,
      listMarkerFeaturesEnabled: true,
      language: "auto"
    };
    var HANDLE_W = 28;
    var NSB_TL_FEATURES_ENABLED = true;
    var NSB_NORMAL_TL_FEATURES_ENABLED = true;
    var NSB_EXPIRING_ADAPTER_ACTIVE = false;
    var NSB_EXPIRING_FALLBACK_ONLY = false;
    function setNsbTlFeaturesEnabled(value) {
      NSB_NORMAL_TL_FEATURES_ENABLED = value !== false;
      NSB_TL_FEATURES_ENABLED = NSB_NORMAL_TL_FEATURES_ENABLED || NSB_EXPIRING_ADAPTER_ACTIVE;
    }
    function isNsbExpiringOnlyMode() {
      return NSB_EXPIRING_FALLBACK_ONLY || !NSB_NORMAL_TL_FEATURES_ENABLED;
    }
    var NSB_BLOCK_FEATURES_ENABLED = true;
    function setNsbBlockFeaturesEnabled(value) {
      NSB_BLOCK_FEATURES_ENABLED = value !== false;
    }
    var NSB_CTXMENU_FEATURES_ENABLED = true;
    function setNsbCtxMenuFeaturesEnabled(value) {
      NSB_CTXMENU_FEATURES_ENABLED = value !== false;
    }
    var NSB_LIST_MARKER_FEATURES_ENABLED = true;
    function setNsbListMarkerFeaturesEnabled(value) {
      NSB_LIST_MARKER_FEATURES_ENABLED = value !== false;
    }
    var NSB_LIST_MARKER_RE = /^((?:[ \t]*>)*[ \t]*)((?:[-*+]|\d+[.)])[ \t]+)(\[[ xX]\](?:[ \t]+|$))?/;
    var NSB_RULE_LINE_RE = /^[ \t]*([-*_])([ \t]*\1){2,}[ \t]*$/;
    function listMarkerOf(lineText) {
      const m = NSB_LIST_MARKER_RE.exec(lineText);
      if (!m || NSB_RULE_LINE_RE.test(lineText)) return null;
      const indent = m[1].replace(/^(?:[ \t]*>[ \t]?)*/, "");
      return { quoteEnd: m[1].length - indent.length, indentEnd: m[1].length, markerEnd: m[0].length };
    }
    function listIndentColumns(state) {
      try {
        if (import_language && typeof import_language.getIndentUnit === "function") return import_language.getIndentUnit(state) || 4;
      } catch (_) {
      }
      return 4;
    }
    function listMarkerBackspaceSpec(state, pos) {
      const line = state.doc.lineAt(pos);
      const mk = listMarkerOf(line.text);
      if (!mk || pos !== line.from + mk.markerEnd) return null;
      if (mk.indentEnd > mk.quoteEnd) {
        const indent = line.text.slice(mk.quoteEnd, mk.indentEnd);
        let n = 1;
        if (!/\t$/.test(indent)) {
          const spaces = /( +)$/.exec(indent);
          n = Math.min(listIndentColumns(state), spaces ? spaces[1].length : 1);
        }
        const to = line.from + mk.indentEnd;
        return { changes: { from: to - n, to }, selection: { anchor: pos - n }, userEvent: "delete.nsb.list-outdent" };
      }
      const from = line.from + mk.quoteEnd;
      return { changes: { from, to: pos }, selection: { anchor: from }, userEvent: "delete.nsb.list-marker" };
    }
    function listMarkerDeleteSpec(state, pos) {
      const line = state.doc.lineAt(pos);
      if (pos !== line.to || line.number >= state.doc.lines) return null;
      const next = state.doc.line(line.number + 1);
      const mk = listMarkerOf(next.text);
      if (!mk) return null;
      return { changes: { from: line.to, to: next.from + mk.markerEnd }, selection: { anchor: line.to }, userEvent: "delete.nsb.list-join" };
    }
    function listMarkerLeftSpec(state, pos) {
      const line = state.doc.lineAt(pos);
      const mk = listMarkerOf(line.text);
      if (!mk || pos !== line.from + mk.markerEnd) return null;
      const anchor = line.number > 1 ? state.doc.line(line.number - 1).to : pos;
      return { selection: { anchor }, scrollIntoView: true, userEvent: "select.nsb.list-marker" };
    }
    var listMarkerAtomValue = null;
    var NSB_TOGGLE_CLOSE_LINE = "%% /nsb-toggle %%";
    var NSB_TOGGLE_OPEN_RE = /^\s*%%\s*nsb-toggle\s+({.*})\s*%%\s*$/;
    var NSB_TOGGLE_INLINE_OPEN_RE = /%%\s*nsb-toggle\s+({.*})\s*%%\s*$/;
    var NSB_TOGGLE_CLOSE_RE = /^\s*%%\s*\/nsb-toggle\s*%%\s*$/;
    function makeToggleId() {
      return "tgl-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }
    function toggleExpiryMeta(meta) {
      return meta && Object.prototype.hasOwnProperty.call(meta, "expiry") ? { expiry: meta.expiry } : {};
    }
    function parseToggleOpenLine(text) {
      const m = NSB_TOGGLE_OPEN_RE.exec(text || "");
      if (!m) return null;
      try {
        const meta = JSON.parse(m[1]);
        return {
          id: typeof meta.id === "string" && meta.id ? meta.id : makeToggleId(),
          open: meta.open === true,
          v: meta.v,
          ...toggleExpiryMeta(meta)
        };
      } catch (_) {
        return null;
      }
    }
    function parseToggleAnyOpenLine(text) {
      const m = NSB_TOGGLE_INLINE_OPEN_RE.exec(text || "");
      if (!m) return null;
      let meta = null;
      try {
        meta = JSON.parse(m[1]);
      } catch (_) {
        return null;
      }
      const before = (text || "").slice(0, m.index);
      const legacy = before.trim() === "" && meta.v !== 2;
      const visible = before.replace(/[ \t]$/, "");
      return {
        meta: {
          id: typeof meta.id === "string" && meta.id ? meta.id : makeToggleId(),
          open: meta.open === true,
          v: meta.v,
          ...toggleExpiryMeta(meta)
        },
        legacy,
        titleMarkerFrom: legacy ? 0 : visible.length
      };
    }
    function serializeToggleOpenLine(meta) {
      return "%% nsb-toggle " + JSON.stringify({
        id: meta && meta.id ? meta.id : makeToggleId(),
        open: !!(meta && meta.open),
        v: 2,
        ...toggleExpiryMeta(meta)
      }) + " %%";
    }
    function isToggleOpenLineText(text) {
      return !!parseToggleOpenLine(text);
    }
    function isToggleCloseLineText(text) {
      return NSB_TOGGLE_CLOSE_RE.test(text || "");
    }
    function isToggleMarkerLineText(text) {
      return isToggleOpenLineText(text) || isToggleCloseLineText(text);
    }
    function scanToggleBlocks(doc) {
      if (!NSB_TL_FEATURES_ENABLED) return [];
      const total = doc.lines;
      const get = (n) => n >= 0 && n < total ? doc.line(n + 1).text : "";
      const stack = [];
      const blocks = [];
      for (let i = 0; i < total; i++) {
        const text = get(i);
        const open = parseToggleAnyOpenLine(text);
        if (open) {
          stack.push({
            id: open.meta.id,
            open: open.meta.open,
            meta: open.meta,
            startLine: i,
            depth: stack.length,
            inline: !open.legacy,
            titleMarkerFrom: open.titleMarkerFrom
          });
          continue;
        }
        if (!isToggleCloseLineText(text) || !stack.length) continue;
        const block = stack.pop();
        block.endLine = i;
        block.titleLine = block.inline ? block.startLine : block.startLine + 1 <= block.endLine ? block.startLine + 1 : block.startLine;
        block.bodyStartLine = block.titleLine + 1;
        block.bodyEndLine = block.endLine - 1;
        blocks.push(block);
      }
      blocks.sort((a, b) => a.startLine - b.startLine);
      if (isNsbExpiringOnlyMode()) {
        const retained = [], ancestors = [];
        let timedEnd = -1;
        for (const block of blocks) {
          if (block.startLine > timedEnd) {
            if (!block.meta.expiry || block.meta.expiry.v !== 1) continue;
            timedEnd = block.endLine;
            ancestors.length = 0;
          }
          while (ancestors.length && ancestors[ancestors.length - 1] < block.startLine) ancestors.pop();
          block.depth = ancestors.length;
          ancestors.push(block.endLine);
          retained.push(block);
        }
        return retained;
      }
      return blocks;
    }
    function toggleTitleVisibleEndPos(doc, toggle) {
      const title = doc.line(toggle.titleLine + 1);
      if (!toggle.inline) return title.to;
      return title.from + Math.min(toggle.titleMarkerFrom, title.length);
    }
    function toggleVisibleTitleText(doc, toggle) {
      const title = doc.line(toggle.titleLine + 1);
      if (!toggle.inline) return title.text || "";
      return (title.text || "").slice(0, toggle.titleMarkerFrom);
    }
    function toggleTitleClearEndPos(doc, toggle) {
      const title = doc.line(toggle.titleLine + 1);
      if (!toggle.inline) return title.to;
      const hidden = (title.text || "").slice(toggle.titleMarkerFrom);
      const ws = hidden.length - hidden.replace(/^\s+/, "").length;
      return title.from + toggle.titleMarkerFrom + ws;
    }
    var NsbTitleCaretAnchorWidget = class extends import_view.WidgetType {
      toDOM() {
        const span = document.createElement("span");
        span.className = "nsb-caret-anchor";
        return span;
      }
      eq() {
        return true;
      }
      ignoreEvent() {
        return false;
      }
    };
    function toggleHiddenMarkerLines(toggles) {
      const lines = /* @__PURE__ */ new Set();
      for (const t of toggles) {
        lines.add(t.endLine);
        if (!t.inline) lines.add(t.startLine);
      }
      return lines;
    }
    function visibleLineEndPos(doc, toggles, lineNum0) {
      const t = toggles.find((x) => x.titleLine === lineNum0 && x.inline);
      return t ? toggleTitleVisibleEndPos(doc, t) : doc.line(lineNum0 + 1).to;
    }
    function getToggleHeaderForLine(doc, lineNum0) {
      const toggles = scanToggleBlocks(doc);
      return toggles.find((t) => t.startLine === lineNum0 || t.titleLine === lineNum0) || null;
    }
    function getToggleByStartLine(doc, startLine) {
      return scanToggleBlocks(doc).find((t) => t.startLine === startLine) || null;
    }
    function isLineHiddenByCollapsedToggle(toggles, lineNum0) {
      return toggles.some((t) => !t.open && lineNum0 >= t.bodyStartLine && lineNum0 <= t.endLine);
    }
    function isRangeHiddenByCollapsedToggle(toggles, startLine, endLine) {
      return toggles.some((t) => !t.open && startLine <= t.endLine && endLine >= t.bodyStartLine);
    }
    function getToggleBodyDepth(toggles, lineNum0) {
      let depth = 0;
      for (const t of toggles) {
        if (lineNum0 > t.titleLine && lineNum0 < t.endLine) depth = Math.max(depth, t.depth + 1);
      }
      return depth;
    }
    function getToggleInsertDepth(toggles, insertLine) {
      let depth = 0;
      for (const t of toggles) {
        if (insertLine > t.titleLine && insertLine <= t.endLine) depth = Math.max(depth, t.depth + 1);
      }
      return depth;
    }
    function toggleHasBodyContent(doc, toggle) {
      for (let i = toggle.bodyStartLine; i <= toggle.bodyEndLine; i++) {
        const text = doc.line(i + 1).text;
        if (!isToggleMarkerLineText(text) && text.trim() !== "") return true;
      }
      return false;
    }
    function toggleHasTitleContent(doc, toggle) {
      if (!toggle || toggle.titleLine < 0 || toggle.titleLine >= doc.lines) return false;
      return toggleVisibleTitleText(doc, toggle).trim() !== "";
    }
    function toggleIsEmpty(doc, toggle) {
      return !toggleHasTitleContent(doc, toggle) && !toggleHasBodyContent(doc, toggle);
    }
    function addReplaceLineDecoration(decos, doc, lineNum0) {
      if (lineNum0 < 0 || lineNum0 >= doc.lines) return;
      const line = doc.line(lineNum0 + 1);
      const to = lineNum0 + 1 < doc.lines ? doc.line(lineNum0 + 2).from : line.to;
      decos.push(import_view.Decoration.replace({ block: true }).range(line.from, to));
    }
    function addToggleMarkerLineDecoration(decos, doc, lineNum0) {
      if (lineNum0 < 0 || lineNum0 >= doc.lines) return;
      const line = doc.line(lineNum0 + 1);
      decos.push(import_view.Decoration.line({
        attributes: {
          class: "nsb-toggle-marker-line",
          "aria-hidden": "true"
        }
      }).range(line.from));
      if (line.from < line.to) {
        decos.push(import_view.Decoration.replace({}).range(line.from, line.to));
      }
    }
    function addToggleCloseLineDecoration(decos, doc, lineNum0) {
      if (lineNum0 < 0 || lineNum0 >= doc.lines) return;
      const nextIsBlank = lineNum0 + 1 < doc.lines && isBlankLineText(doc.line(lineNum0 + 2).text);
      if (nextIsBlank) addToggleMarkerLineDecoration(decos, doc, lineNum0);
      else addReplaceLineDecoration(decos, doc, lineNum0);
    }
    function addReplaceLineRangeDecoration(decos, doc, fromLine0, toLine0) {
      if (fromLine0 < 0 || fromLine0 >= doc.lines || toLine0 < fromLine0) return;
      const last = Math.min(toLine0, doc.lines - 1);
      const from = doc.line(fromLine0 + 1).from;
      const to = last + 1 < doc.lines ? doc.line(last + 2).from : doc.line(last + 1).to;
      decos.push(import_view.Decoration.replace({ block: true }).range(from, to));
    }
    function expandToggleRangeForLines(doc, startLine, endLine) {
      const header = getToggleHeaderForLine(doc, startLine);
      if (header) return { startLine: header.startLine, endLine: header.endLine };
      const byStart = getToggleByStartLine(doc, startLine);
      if (byStart) return { startLine: byStart.startLine, endLine: byStart.endLine };
      return { startLine, endLine };
    }
    function isOutlinerManaged(el) {
      return el.classList.contains("outliner-plugin-list-item") || !!el.closest(".outliner-plugin-list-item") || !!el.closest("[data-outliner]");
    }
    function isTableElement(el) {
      if (!el) return false;
      if (el.closest(".cm-table-widget") || el.closest(".HyperMD-table-row")) return true;
      if (["TD", "TH", "TR", "TABLE"].includes(el.tagName) || el.closest("table")) return true;
      return (el.textContent || "").trimStart().startsWith("|");
    }
    function isWbManaged(el) {
      if (!el) return false;
      if (el.querySelector && el.querySelector("[data-wb-drag-managed]")) return true;
      if (el.closest && el.closest("[data-wb-drag-managed]")) return true;
      return false;
    }
    function isWbBookmarkEmbed(el) {
      if (!el) return false;
      if (el.querySelector && el.querySelector(".wb-container")) return true;
      if (el.closest && el.closest(".wb-container")) return true;
      return false;
    }
    function isWbDragFeatureEnabled(app) {
      try {
        const wb = app && app.plugins && app.plugins.plugins && app.plugins.plugins["web-bookmark"];
        if (wb && wb.settings && Object.prototype.hasOwnProperty.call(wb.settings, "dragEnabled")) {
          return !!wb.settings.dragEnabled;
        }
      } catch (_) {
      }
      return true;
    }
    function isWbManagedByActivePlugin(el, app) {
      if (!isWbManaged(el)) return false;
      return isWbDragFeatureEnabled(app);
    }
    function getWbVisualElement(el) {
      if (!el) return null;
      if (el.matches && el.matches(".wb-container")) return el;
      if (el.querySelector) {
        const found = el.querySelector(".wb-container");
        if (found) return found;
      }
      return el.closest ? el.closest(".wb-container") : null;
    }
    function getWbBlockRoot(el) {
      if (!el) return null;
      if (el.closest) {
        const embed = el.closest(".cm-embed-block");
        if (embed) return embed;
        const preview = el.closest(".cm-preview-code-block");
        if (preview) return preview;
      }
      return el;
    }
    var BUILTIN_EMBED_SELECTOR = ".internal-embed,.file-embed,.markdown-embed,.media-embed,.image-embed,.audio-embed,.video-embed,.canvas-embed,.pdf-embed";
    var NSB_EMBED_MUTATION_SELECTOR = BUILTIN_EMBED_SELECTOR + ",.cm-embed-block,.cm-preview-code-block,.wb-container,.gv-block,.callout,.canvas-wrapper,.canvas-node-container";
    function getBuiltinEmbedVisualElement(el) {
      if (!el) return null;
      if (isWbBookmarkEmbed(el)) return null;
      if (el.matches && el.matches(BUILTIN_EMBED_SELECTOR)) return el;
      if (el.closest) {
        const closest = el.closest(BUILTIN_EMBED_SELECTOR);
        if (closest && !isWbBookmarkEmbed(closest)) return closest;
      }
      if (el.querySelector) {
        const found = el.querySelector(BUILTIN_EMBED_SELECTOR);
        if (found && !isWbBookmarkEmbed(found)) return found;
      }
      return null;
    }
    function getEmbedBlockRoot(el) {
      if (!el) return null;
      if (el.closest) {
        const embed = el.closest(".cm-embed-block");
        if (embed) return embed;
        const preview = el.closest(".cm-preview-code-block");
        if (preview) return preview;
      }
      return el;
    }
    function nodeHasNsbEmbedLikeContent(node) {
      if (!node || node.nodeType !== 1) return false;
      const el = node;
      try {
        return el.matches && el.matches(NSB_EMBED_MUTATION_SELECTOR) || el.querySelector && !!el.querySelector(NSB_EMBED_MUTATION_SELECTOR);
      } catch (_) {
        return false;
      }
    }
    function scanQuoteBlocks(doc) {
      const total = doc.lines;
      const ranges = [];
      let startLine = -1;
      for (let i = 0; i < total; i++) {
        const isQuote = /^\s*>/.test(doc.line(i + 1).text);
        if (isQuote && startLine < 0) startLine = i;
        else if (!isQuote && startLine >= 0) {
          ranges.push({ startLine, endLine: i - 1 });
          startLine = -1;
        }
      }
      if (startLine >= 0) ranges.push({ startLine, endLine: total - 1 });
      return ranges;
    }
    function isBlankLineText(text) {
      return !text || text.trim() === "";
    }
    function isQuoteLineText(text) {
      return /^\s*>/.test(text || "");
    }
    function isHrLineText(text) {
      return /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(text || "");
    }
    function getOrderedListMatch(text) {
      return /^(\s*)(\d+)([.)])(\s+)/.exec(text || "");
    }
    function renumberOrderedListBlockText(doc, blockText, insertLine) {
      const lines = String(blockText || "").split("\n");
      const first = lines[0] || "";
      const m = getOrderedListMatch(first);
      if (!m) return blockText;
      let nextNum = 1;
      if (doc) {
        const targetLine = Math.max(0, Math.min(insertLine || 0, doc.lines));
        for (let i = targetLine - 1; i >= 0; i--) {
          const text = doc.line(i + 1).text;
          if (isToggleMarkerLineText(text) || isBlankLineText(text)) continue;
          const prev = getOrderedListMatch(text);
          if (prev && prev[1].length === m[1].length) nextNum = Number(prev[2]) + 1;
          break;
        }
      }
      lines[0] = m[1] + nextNum + m[3] + m[4] + first.slice(m[0].length);
      return lines.join("\n");
    }
    function getVacuumLineKind(doc, lineNum0) {
      if (!NSB_TL_FEATURES_ENABLED) return false;
      if (!doc || lineNum0 < 0 || lineNum0 >= doc.lines) return false;
      const text = doc.line(lineNum0 + 1).text;
      if (!isBlankLineText(text)) return false;
      if (isNsbExpiringOnlyMode() && !scanToggleBlocks(doc).some((t) => lineNum0 > t.titleLine && lineNum0 < t.endLine)) return false;
      const prev = lineNum0 > 0 ? doc.line(lineNum0).text : "";
      const next = lineNum0 + 1 < doc.lines ? doc.line(lineNum0 + 2).text : "";
      if (isHrLineText(prev)) return "hr-after";
      if (isHrLineText(next)) return "hr-before";
      if (isQuoteLineText(prev)) return "quote-after";
      return false;
    }
    function isVacuumLine(doc, lineNum0) {
      return !!getVacuumLineKind(doc, lineNum0);
    }
    function isHardVacuumLine(doc, lineNum0) {
      const kind = getVacuumLineKind(doc, lineNum0);
      return kind === "hr-before" || kind === "hr-after" || kind === "quote-after";
    }
    function normalizeInsertLineForVacuum(doc, insertLine) {
      if (!doc || insertLine <= 0 || insertLine >= doc.lines) return insertLine;
      const targetText = doc.line(insertLine + 1).text;
      if (isHrLineText(targetText) && isVacuumLine(doc, insertLine - 1)) return insertLine - 1;
      return insertLine;
    }
    function clampNumber(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }
    function scanInternalEmbedLines(doc) {
      const total = doc.lines;
      const ranges = [];
      for (let i = 0; i < total; i++) {
        const tr = doc.line(i + 1).text.trim();
        if (/^!\[\[[^\]]+\]\]\s*$/.test(tr)) ranges.push({ startLine: i, endLine: i });
      }
      return ranges;
    }
    function matchRangesToElement(ranges, el, editorView, slop) {
      if (!ranges.length || !el) return null;
      const er = el.getBoundingClientRect();
      const extra = slop == null ? 50 : slop;
      let best = null, bestDist = Infinity;
      for (const range of ranges) {
        try {
          const doc = editorView.state.doc;
          const from = doc.line(range.startLine + 1).from;
          const coords = editorView.coordsAtPos(from);
          if (!coords) continue;
          const midY = (coords.top + coords.bottom) / 2;
          if (coords.top >= er.top - extra && coords.top <= er.bottom + extra) {
            const dist = Math.abs(midY - (er.top + er.height / 2));
            if (dist < bestDist) {
              bestDist = dist;
              best = range;
            }
          }
        } catch (_) {
        }
      }
      if (!best) {
        for (const range of ranges) {
          try {
            const doc = editorView.state.doc;
            const from = doc.line(range.startLine + 1).from;
            const coords = editorView.coordsAtPos(from);
            if (!coords) continue;
            const dist = Math.abs(coords.top - er.top);
            if (dist < bestDist) {
              bestDist = dist;
              best = range;
            }
          } catch (_) {
          }
        }
      }
      return best;
    }
    function resolveBuiltinEmbedRange(el, editorView, ranges) {
      const visual = getBuiltinEmbedVisualElement(el);
      if (!visual) return null;
      const allRanges = ranges || scanInternalEmbedLines(editorView.state.doc);
      const root = getEmbedBlockRoot(visual);
      return matchRangesToElement(allRanges, root, editorView, 80) || matchRangesToElement(allRanges, visual, editorView, 80);
    }
    function domLineForNum(editorView, root, n0) {
      for (const cl of Array.from(root.querySelectorAll(".cm-line"))) {
        try {
          if (editorView.state.doc.lineAt(editorView.posAtDOM(cl, 0)).number - 1 === n0) return cl;
        } catch (_) {
        }
      }
      return null;
    }
    function resolveElementRangeFallback(el, editorView) {
      if (!el || !editorView) return null;
      const doc = editorView.state.doc;
      try {
        const pos = editorView.posAtDOM(el, 0);
        const lineNum = doc.lineAt(pos).number - 1;
        return resolveBlockBoundary(doc, lineNum);
      } catch (_) {
      }
      try {
        const r = el.getBoundingClientRect();
        const pos = editorView.posAtCoords({ x: r.left + Math.max(4, r.width * 0.2), y: r.top + Math.max(4, r.height * 0.5) }, false);
        if (pos == null) return null;
        const lineNum = doc.lineAt(pos).number - 1;
        return resolveBlockBoundary(doc, lineNum);
      } catch (_) {
      }
      return null;
    }
    function makeHandleEl(extraClass) {
      const h = document.createElement("div");
      h.className = "nsb-handle" + (extraClass ? " " + extraClass : "");
      const d = document.createElement("div");
      d.className = "nsb-dots";
      for (let i = 0; i < 6; i++) d.appendChild(document.createElement("span"));
      h.appendChild(d);
      return h;
    }
    function makeAddLineButtonEl() {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "clickable-icon nsb-add-line-button";
      b.setAttribute("aria-label", paipaT("Insert blank line below"));
      try {
        import_obsidian.setIcon(b, "plus");
      } catch (_) {
        b.textContent = "+";
      }
      return b;
    }
    function scanWbFences(doc) {
      const total = doc.lines;
      const getText = (n) => n >= 0 && n < total ? doc.line(n + 1).text : "";
      const fences = [];
      let openLine = -1;
      for (let i = 0; i < total; i++) {
        const tr = getText(i).trim();
        if (openLine < 0 && /^```web-bookmark/i.test(tr)) {
          openLine = i;
        } else if (openLine >= 0 && tr === "```") {
          fences.push({ startLine: openLine, endLine: i });
          openLine = -1;
        }
      }
      return fences;
    }
    function matchFenceToEmbed(fences, embedEl, editorView) {
      if (!fences.length) return null;
      const er = embedEl.getBoundingClientRect();
      let best = null, bestDist = Infinity;
      for (const fence of fences) {
        try {
          const doc = editorView.state.doc;
          const from = doc.line(fence.startLine + 1).from;
          const coords = editorView.coordsAtPos(from);
          if (!coords) continue;
          const midY = (coords.top + coords.bottom) / 2;
          if (coords.top >= er.top - 40 && coords.top <= er.bottom + 40) {
            const dist = Math.abs(midY - (er.top + er.height / 2));
            if (dist < bestDist) {
              bestDist = dist;
              best = fence;
            }
          }
        } catch (_) {
        }
      }
      if (!best) {
        for (const fence of fences) {
          try {
            const doc = editorView.state.doc;
            const from = doc.line(fence.startLine + 1).from;
            const coords = editorView.coordsAtPos(from);
            if (!coords) continue;
            const dist = Math.abs(coords.top - er.top);
            if (dist < bestDist) {
              bestDist = dist;
              best = fence;
            }
          } catch (_) {
          }
        }
      }
      return best;
    }
    function resolveWbEmbedRange(embed, editorView, fences) {
      if (!isWbBookmarkEmbed(embed)) return null;
      const allFences = fences || scanWbFences(editorView.state.doc);
      const visual = getWbVisualElement(embed);
      const root = getWbBlockRoot(visual || embed);
      return matchFenceToEmbed(allFences, root, editorView) || (visual ? matchFenceToEmbed(allFences, visual, editorView) : null);
    }
    function getBlockDragLabel(doc, startLine, fallbackEl) {
      let labelText = "";
      try {
        const opener = doc.line(startLine + 1).text.trim();
        const toggle = getToggleByStartLine(doc, startLine);
        if (toggle && toggle.titleLine < doc.lines) {
          labelText = toggleVisibleTitleText(doc, toggle).trim().substring(0, 60) || paipaT("Toggle list");
        } else if (/^```web-bookmark/i.test(opener) && startLine + 2 <= doc.lines) {
          const parsed = JSON.parse(doc.line(startLine + 2).text.trim());
          labelText = (parsed.title || parsed.url || "").substring(0, 60);
        } else {
          labelText = opener.substring(0, 60);
        }
      } catch (_) {
      }
      if (!labelText) labelText = (fallbackEl.textContent || "").trim().substring(0, 60) || paipaT("(empty)");
      return labelText;
    }
    function resolveBlockBoundary(doc, lineNum0) {
      const total = doc.lines;
      const get = (n) => n >= 0 && n < total ? doc.line(n + 1).text : "";
      const t = get(lineNum0), tr = t.trim();
      const toggleHeader = getToggleHeaderForLine(doc, lineNum0);
      if (toggleHeader) return { startLine: toggleHeader.startLine, endLine: toggleHeader.endLine };
      {
        let inFence = false, fs = -1;
        for (let i = 0; i <= lineNum0; i++) {
          const tt = get(i).trim();
          if (!inFence && /^```/.test(tt)) {
            inFence = true;
            fs = i;
          } else if (inFence && tt === "```") {
            inFence = false;
            fs = -1;
          }
        }
        if (inFence && fs >= 0) {
          for (let i = lineNum0 + 1; i < total; i++)
            if (get(i).trim() === "```") return { startLine: fs, endLine: i };
          return { startLine: fs, endLine: lineNum0 };
        }
        if (tr === "```") {
          for (let i = lineNum0 - 1; i >= 0; i--)
            if (/^```/.test(get(i).trim())) return { startLine: i, endLine: lineNum0 };
          return { startLine: lineNum0, endLine: lineNum0 };
        }
      }
      if (/^```/.test(tr)) {
        for (let i = lineNum0 + 1; i < total; i++)
          if (get(i).trim() === "```") return { startLine: lineNum0, endLine: i };
        return { startLine: lineNum0, endLine: lineNum0 };
      }
      if (/^\s*>/.test(t)) {
        let s = lineNum0, e = lineNum0;
        for (let i = lineNum0 - 1; i >= 0; i--) {
          if (/^\s*>/.test(get(i))) s = i;
          else break;
        }
        for (let i = lineNum0 + 1; i < total; i++) {
          if (/^\s*>/.test(get(i))) e = i;
          else break;
        }
        return { startLine: s, endLine: e };
      }
      const listRe = /^(\s*)([-*+]|\d+\.)\s/;
      const lm = listRe.exec(t);
      if (lm) {
        return { startLine: lineNum0, endLine: lineNum0 };
      }
      return { startLine: lineNum0, endLine: lineNum0 };
    }
    var EditOverlay = class {
      constructor(plugin, editorView, cmEditorEl) {
        this.currentTarget = null;
        this.pinnedTarget = null;
        this.selTarget = null;
        this.rafId = null;
        this.plugin = plugin;
        this.editorView = editorView;
        this.cmEditorEl = cmEditorEl;
        this.scroller = cmEditorEl.querySelector(".cm-scroller") || cmEditorEl;
        this.hoverHandle = makeHandleEl("nsb-hover-handle");
        this.pinnedHandle = makeHandleEl("nsb-pinned-handle");
        this.selHandle = makeHandleEl("nsb-sel-handle");
        this.hoverAddButton = makeAddLineButtonEl();
        for (const h of [this.hoverHandle, this.pinnedHandle, this.selHandle]) {
          h.style.display = "none";
          this.scroller.appendChild(h);
        }
        this.hoverAddButton.style.display = "none";
        this.scroller.appendChild(this.hoverAddButton);
        this.attachHandleEvents(this.hoverHandle, () => this.currentTarget);
        this.attachHandleEvents(this.pinnedHandle, () => this.pinnedTarget);
        this.attachHandleEvents(this.selHandle, () => this.selTarget);
        this.attachAddButtonEvents();
        this.onDocMove = this.handleDocMove.bind(this);
        this.onScrollerClick = this.handleScrollerClick.bind(this);
        this.onSelChange = () => {
        };
        this.onBlur = () => {
          this.pinnedTarget = null;
          this.pinnedHandle.style.display = "none";
          this.selTarget = null;
          this.selHandle.style.display = "none";
          this.currentTarget = null;
          this.hoverHandle.style.display = "none";
          this.hoverAddButton.style.display = "none";
        };
        document.addEventListener("mousemove", this.onDocMove);
        this.scroller.addEventListener("click", this.onScrollerClick);
        cmEditorEl.addEventListener("focusout", this.onBlur);
      }
      positionHandle(handle, el) {
        const scrollerRect = this.scroller.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const s = this.plugin.settings;
        const pad = s.handleSize;
        const handleW = 2 * s.dotSize + s.dotGap + 2 * pad;
        const handleH = 3 * s.dotSize + 2 * s.dotGap + 2 * pad;
        let firstLineCenterY;
        try {
          const cs = window.getComputedStyle(el);
          const paddingTop = parseFloat(cs.paddingTop) || 0;
          const lineHeightRaw = cs.lineHeight;
          const lineHeight = lineHeightRaw === "normal" ? parseFloat(cs.fontSize) * 1.2 : parseFloat(lineHeightRaw);
          firstLineCenterY = elRect.top + paddingTop + lineHeight / 2;
        } catch (_) {
          firstLineCenterY = elRect.top + elRect.height / 2;
        }
        let anchorLeft = elRect.left;
        try {
          const isNativeListLine = el.classList && el.classList.contains("cm-line") && /\bHyperMD-list-line\b/.test(el.className || "");
          if (isNativeListLine) {
            const marginLeft = parseFloat(window.getComputedStyle(el).marginLeft || "") || 0;
            anchorLeft -= marginLeft;
          }
        } catch (_) {
        }
        const top = firstLineCenterY - scrollerRect.top + this.scroller.scrollTop - handleH / 2;
        const left = anchorLeft - scrollerRect.left - handleW - 2 - (this.plugin.settings.handleOffset || 0);
        handle.style.top = top + "px";
        handle.style.left = Math.max(0, left) + "px";
        return { top, left: Math.max(0, left), width: handleW, height: handleH };
      }
      positionAddButton(metrics) {
        if (!metrics) return;
        const size = 22;
        const gap = 5;
        const left = Math.max(0, metrics.left - size - gap);
        const top = metrics.top + Math.max(0, (metrics.height - size) / 2);
        this.hoverAddButton.style.left = left + "px";
        this.hoverAddButton.style.top = top + "px";
      }
      // Full leftward reach of the hover cluster (drag handle + add/plus button),
      // measured from a block's left edge. The hover hit-region must cover the
      // outer edge of the plus button plus a small margin, otherwise the pointer
      // leaves the region (and the icons vanish) before it can reach the plus.
      // Mirrors the geometry in positionHandle()/positionAddButton() so it stays
      // correct when the handle/dot settings change.
      hoverClusterPad() {
        const s = this.plugin.settings;
        const handleW = 2 * s.dotSize + s.dotGap + 2 * s.handleSize;
        const addButtonW = 22;
        const addGap = 5;
        const margin = 12;
        return handleW + 2 + (s.handleOffset || 0) + addButtonW + addGap + margin;
      }
      _updateSelHandle() {
        this.selTarget = null;
        this.selHandle.style.display = "none";
        return;
        const state = this.editorView.state, sel = state.selection.main;
        if (sel.empty) {
          this.selTarget = null;
          this.selHandle.style.display = "none";
          return;
        }
        const doc = state.doc, fromL = doc.lineAt(sel.from), toL = doc.lineAt(sel.to);
        if (fromL.number === toL.number) {
          this.selTarget = null;
          this.selHandle.style.display = "none";
          return;
        }
        const s0 = fromL.number - 1, topEl = this._domLineForNum(s0);
        if (!topEl) {
          this.selTarget = null;
          this.selHandle.style.display = "none";
          return;
        }
        this.selTarget = { kind: "sel", el: topEl, startLine: s0, endLine: toL.number - 1 };
        this.positionHandle(this.selHandle, topEl);
        this.selHandle.style.display = "flex";
      }
      attachHandleEvents(handle, getTarget) {
        handle.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
          const t = getTarget();
          if (!t) return;
          const startX = e.clientX, startY = e.clientY;
          let dragging = false;
          const onMouseMove = (mv) => {
            if (dragging) return;
            const dx = mv.clientX - startX, dy = mv.clientY - startY;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
              dragging = true;
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
              this.plugin.beginEditDrag(e, t, this.editorView, this);
            }
          };
          const onMouseUp = (up) => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (!dragging) {
              const mv = this.plugin.getMdViewForEditor(this.editorView);
              if (mv) this.plugin.showBlockMenu(up, t.el, mv, "edit", t);
            }
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
        handle.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const t = getTarget();
          if (!t) return;
          const mv = this.plugin.getMdViewForEditor(this.editorView);
          if (mv) this.plugin.showBlockMenu(e, t.el, mv, "edit", t);
        });
      }
      attachAddButtonEvents() {
        this.hoverAddButton.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
        });
        this.hoverAddButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const target = this.currentTarget;
          if (!target) return;
          this.plugin.insertBlankLineAfterTargetCM(this.editorView, target);
          this.hoverAddButton.style.display = "none";
          this.hoverHandle.style.display = "none";
          this.currentTarget = null;
        });
        this.hoverAddButton.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
      findWbBlockAt(mx, my, wbFences) {
        const pad = this.hoverClusterPad();
        for (const visual of Array.from(this.scroller.querySelectorAll(".wb-container"))) {
          const root = getWbBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const r = visual.getBoundingClientRect();
          if (mx >= r.left - pad && mx <= r.right && my >= r.top && my <= r.bottom) {
            const lines = resolveWbEmbedRange(visual, this.editorView, wbFences);
            if (lines) return { kind: "embed", el: visual, root, ...lines };
          }
        }
        return null;
      }
      findCalloutBlockAt(mx, my, quoteRanges) {
        const pad = this.hoverClusterPad();
        for (const visual of Array.from(this.scroller.querySelectorAll(".callout"))) {
          const root = getEmbedBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const r = visual.getBoundingClientRect();
          if (mx >= r.left - pad && mx <= r.right && my >= r.top && my <= r.bottom) {
            const lines = matchRangesToElement(quoteRanges, root, this.editorView, 80) || matchRangesToElement(quoteRanges, visual, this.editorView, 80);
            if (lines) return { kind: "quote", el: visual, root, ...lines };
          }
        }
        return null;
      }
      findBuiltinEmbedAt(mx, my, embedRanges) {
        const pad = this.hoverClusterPad();
        for (const visual of Array.from(this.scroller.querySelectorAll(BUILTIN_EMBED_SELECTOR))) {
          if (isWbBookmarkEmbed(visual)) continue;
          const root = getEmbedBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const r = visual.getBoundingClientRect();
          if (mx >= r.left - pad && mx <= r.right && my >= r.top && my <= r.bottom) {
            const lines = resolveBuiltinEmbedRange(visual, this.editorView, embedRanges);
            if (lines) return { kind: "embed", el: visual, root, ...lines };
          }
        }
        return null;
      }
      findBlockAt(mx, my) {
        const pad = this.hoverClusterPad();
        const providerUnits = [];
        for (const provider of this.plugin.blockProviders()) {
          const providerTarget = provider.nsbTargetAt?.(this.editorView, mx, my, pad);
          if (providerTarget) return providerTarget;
          for (const unit of provider.nsbUnits(this.editorView) || []) providerUnits.push(unit);
        }
        const wbFences = scanWbFences(this.editorView.state.doc);
        const wbSkipRanges = wbFences.slice();
        const quoteSkipRanges = [];
        const quoteRanges = scanQuoteBlocks(this.editorView.state.doc);
        const embedSkipRanges = [];
        const embedRanges = scanInternalEmbedLines(this.editorView.state.doc);
        const toggles = scanToggleBlocks(this.editorView.state.doc);
        const toggleMarkerLines = toggleHiddenMarkerLines(toggles);
        const wbHover = this.findWbBlockAt(mx, my, wbFences);
        if (wbHover) {
          wbSkipRanges.push({ startLine: wbHover.startLine, endLine: wbHover.endLine });
          if (!isWbManagedByActivePlugin(wbHover.el, this.plugin.app)) return wbHover;
        }
        const quoteHover = this.findCalloutBlockAt(mx, my, quoteRanges);
        if (quoteHover) {
          quoteSkipRanges.push({ startLine: quoteHover.startLine, endLine: quoteHover.endLine });
          return quoteHover;
        }
        const embedHover = this.findBuiltinEmbedAt(mx, my, embedRanges);
        if (embedHover) {
          embedSkipRanges.push({ startLine: embedHover.startLine, endLine: embedHover.endLine });
          return embedHover;
        }
        for (const embed of Array.from(this.scroller.querySelectorAll(".cm-embed-block"))) {
          if (isTableElement(embed)) continue;
          const wbRange = resolveWbEmbedRange(embed, this.editorView, wbFences);
          if (wbRange) wbSkipRanges.push(wbRange);
          const builtinRange = resolveBuiltinEmbedRange(embed, this.editorView, embedRanges);
          if (builtinRange) embedSkipRanges.push(builtinRange);
          if (isWbManagedByActivePlugin(embed, this.plugin.app)) {
            continue;
          }
          const r = embed.getBoundingClientRect();
          if (mx >= r.left - pad && mx <= r.right && my >= r.top && my <= r.bottom) {
            const lines = wbRange || builtinRange || this._resolveEmbedRange(embed);
            if (lines) return { kind: "embed", el: embed, ...lines };
          }
        }
        for (const line of Array.from(this.scroller.querySelectorAll(".cm-line"))) {
          if (isOutlinerManaged(line) || isTableElement(line)) continue;
          const r = line.getBoundingClientRect();
          if (mx >= r.left - pad && mx <= r.right && my >= r.top && my <= r.bottom) {
            const ln = this.lineNumFromDom(line);
            if (ln < 0) continue;
            if (isVacuumLine(this.editorView.state.doc, ln)) continue;
            if (toggleMarkerLines.has(ln) || isLineHiddenByCollapsedToggle(toggles, ln)) continue;
            if (providerUnits.some((u) => ln >= u.startLine && ln <= u.endLine)) continue;
            if (wbSkipRanges.some((rng) => ln >= rng.startLine && ln <= rng.endLine)) continue;
            if (quoteSkipRanges.some((rng) => ln >= rng.startLine && ln <= rng.endLine)) continue;
            if (embedSkipRanges.some((rng) => ln >= rng.startLine && ln <= rng.endLine)) continue;
            return { kind: "line", el: line, startLine: ln, endLine: ln };
          }
        }
        return null;
      }
      // Probe multiple Y positions across the embed to find the fence-opening line.
      // Prefer any result where startLine < endLine (genuine multi-line block).
      _resolveEmbedRange(embed) {
        const wbRange = resolveWbEmbedRange(embed, this.editorView);
        if (wbRange) return wbRange;
        const builtinRange = resolveBuiltinEmbedRange(embed, this.editorView);
        if (builtinRange) return builtinRange;
        const r = embed.getBoundingClientRect();
        const doc = this.editorView.state.doc;
        const h = r.bottom - r.top;
        const probeYs = [
          r.top + 2,
          r.top + Math.max(4, h * 0.15),
          r.top + Math.max(8, h * 0.35),
          r.top + Math.max(12, h * 0.55),
          r.top + Math.max(16, h * 0.75)
        ];
        let fallback = null;
        for (const py of probeYs) {
          try {
            const pos = this.editorView.posAtCoords({ x: r.left + 4, y: py }, false);
            if (pos == null) continue;
            const lineNum = doc.lineAt(pos).number - 1;
            const bounds = resolveBlockBoundary(doc, lineNum);
            if (bounds.startLine < bounds.endLine) return bounds;
            if (!fallback) fallback = bounds;
          } catch (_) {
          }
        }
        return fallback;
      }
      lineNumFromDom(line) {
        try {
          return this.editorView.state.doc.lineAt(this.editorView.posAtDOM(line, 0)).number - 1;
        } catch (_) {
          return -1;
        }
      }
      _domLineForNum(n0) {
        for (const cl of Array.from(this.scroller.querySelectorAll(".cm-line"))) {
          try {
            if (this.editorView.state.doc.lineAt(this.editorView.posAtDOM(cl, 0)).number - 1 === n0) return cl;
          } catch (_) {
          }
        }
        return null;
      }
      handleDocMove(e) {
        if (this.plugin.isDragging) return;
        if (e.target && e.target.closest && e.target.closest(".nsb-handle,.nsb-add-line-button")) return;
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          if (this.plugin.isDragging) return;
          const mx = e.clientX, my = e.clientY, er = this.cmEditorEl.getBoundingClientRect();
          const pad = this.hoverClusterPad();
          if (mx < er.left - pad || mx > er.right || my < er.top || my > er.bottom) {
            this.hoverHandle.style.display = "none";
            this.hoverAddButton.style.display = "none";
            this.currentTarget = null;
            return;
          }
          const target = this.findBlockAt(mx, my);
          if (!target) {
            this.hoverHandle.style.display = "none";
            this.hoverAddButton.style.display = "none";
            this.currentTarget = null;
            return;
          }
          this.currentTarget = target;
          const metrics = this.positionHandle(this.hoverHandle, target.el);
          this.positionAddButton(metrics);
          this.hoverHandle.style.display = target.noHandle ? "none" : "flex";
          this.hoverAddButton.style.display = "flex";
        });
      }
      handleScrollerClick(e) {
        this.pinnedTarget = null;
        this.pinnedHandle.style.display = "none";
        return;
        const dt = e.target;
        if (dt.closest(".nsb-handle")) return;
        if (isTableElement(dt)) {
          this.pinnedTarget = null;
          this.pinnedHandle.style.display = "none";
          return;
        }
        const wbFences = scanWbFences(this.editorView.state.doc);
        const quoteRanges = scanQuoteBlocks(this.editorView.state.doc);
        const embedRanges = scanInternalEmbedLines(this.editorView.state.doc);
        const toggles = scanToggleBlocks(this.editorView.state.doc);
        const toggleMarkerLines = toggleHiddenMarkerLines(toggles);
        const callout = dt.closest(".callout");
        if (callout && !isTableElement(callout)) {
          const lines = matchRangesToElement(quoteRanges, getEmbedBlockRoot(callout), this.editorView, 80) || matchRangesToElement(quoteRanges, callout, this.editorView, 80);
          if (lines) {
            this.pinnedTarget = { kind: "quote", el: callout, ...lines };
            this.positionHandle(this.pinnedHandle, callout);
            this.pinnedHandle.style.display = "flex";
            return;
          }
        }
        const builtInVisual = getBuiltinEmbedVisualElement(dt);
        if (builtInVisual && !isTableElement(builtInVisual)) {
          const lines = resolveBuiltinEmbedRange(builtInVisual, this.editorView, embedRanges);
          if (lines) {
            this.pinnedTarget = { kind: "embed", el: builtInVisual, ...lines };
            this.positionHandle(this.pinnedHandle, builtInVisual);
            this.pinnedHandle.style.display = "flex";
            return;
          }
        }
        const wbContainer = dt.closest(".wb-container");
        const embed = dt.closest(".cm-embed-block") || (wbContainer ? getWbBlockRoot(wbContainer) : null);
        if (embed && !isTableElement(embed) && !isWbManagedByActivePlugin(embed, this.plugin.app)) {
          const lines = resolveWbEmbedRange(wbContainer || embed, this.editorView, wbFences) || this._resolveEmbedRange(embed);
          if (lines) {
            const targetEl = wbContainer || embed;
            this.pinnedTarget = { kind: "embed", el: targetEl, ...lines };
            this.positionHandle(this.pinnedHandle, targetEl);
            this.pinnedHandle.style.display = "flex";
            return;
          }
        }
        if (embed && isWbManagedByActivePlugin(embed, this.plugin.app)) {
          this.pinnedTarget = null;
          this.pinnedHandle.style.display = "none";
          return;
        }
        const line = dt.closest(".cm-line");
        if (line && !isOutlinerManaged(line) && !isTableElement(line)) {
          const ln = this.lineNumFromDom(line);
          if (ln >= 0) {
            if (isVacuumLine(this.editorView.state.doc, ln)) {
              this.pinnedTarget = null;
              this.pinnedHandle.style.display = "none";
              return;
            }
            if (toggleMarkerLines.has(ln) || isLineHiddenByCollapsedToggle(toggles, ln)) {
              this.pinnedTarget = null;
              this.pinnedHandle.style.display = "none";
              return;
            }
            const insideWb = Array.from(this.scroller.querySelectorAll(".cm-embed-block")).some((em) => {
              if (isTableElement(em)) return false;
              const rng = resolveWbEmbedRange(em, this.editorView, wbFences);
              return rng && ln >= rng.startLine && ln <= rng.endLine;
            });
            if (!insideWb) {
              this.pinnedTarget = { kind: "line", el: line, startLine: ln, endLine: ln };
              this.positionHandle(this.pinnedHandle, line);
              this.pinnedHandle.style.display = "flex";
              return;
            }
          }
        }
        this.pinnedTarget = null;
        this.pinnedHandle.style.display = "none";
      }
      hideAll() {
        this.hoverHandle.style.display = "none";
        this.hoverAddButton.style.display = "none";
        this.pinnedHandle.style.display = "none";
      }
      // After a drag completes, don't restore the old pinnedHandle — the block
      // has moved and the cursor is now elsewhere. Clear pinnedTarget instead.
      clearPinnedAfterDrag() {
        this.pinnedTarget = null;
        this.pinnedHandle.style.display = "none";
      }
      restorePinned() {
        if (this.pinnedTarget) {
          this.positionHandle(this.pinnedHandle, this.pinnedTarget.el);
          this.pinnedHandle.style.display = "flex";
        }
      }
      destroy() {
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        document.removeEventListener("mousemove", this.onDocMove);
        this.scroller.removeEventListener("click", this.onScrollerClick);
        this.cmEditorEl.removeEventListener("focusout", this.onBlur);
        this.hoverHandle.remove();
        this.hoverAddButton.remove();
        this.pinnedHandle.remove();
        this.selHandle.remove();
      }
    };
    var NsbEditorViewPlugin = class {
      constructor(plugin, view, cmEl) {
        this.plugin = plugin;
        this.view = view;
        this.mobileViewOnly = isMobileDevice();
        this.cmEl = cmEl;
        this.overlay = this.mobileViewOnly || !NSB_BLOCK_FEATURES_ENABLED ? null : new EditOverlay(plugin, view, cmEl);
        this.livePreviewMode = isLivePreviewEditorView(view);
        this.livePreviewSyncRaf = null;
        this.legacyMigrationRaf = null;
        this.nativeFoldGuardRaf = null;
        this.scroller = view.scrollDOM;
        this.toggleButtons = [];
        this.toggleButtonRaf = null;
        this.hierarchyMutationRaf = null;
        this.savedRightClickSelection = null;
        this.savedRightClickNativeRanges = null;
        this.onToggleRowMouseDown = this.handleToggleRowMouseDown.bind(this);
        this.onMouseDownCapture = this.handleMouseDownCapture.bind(this);
        this.onContextMenuCapture = this.handleContextMenuCapture.bind(this);
        this.onKeyDown = this.handleKeyDown.bind(this);
        this.onBeforeInputCapture = this.handleBeforeInputCapture.bind(this);
        this.onPasteCapture = this.handlePasteCapture.bind(this);
        this.onMobileBeforeInput = this.handleMobileBeforeInput.bind(this);
        this.scrollRecordReadyAt = Date.now() + 250;
        this.onScroll = () => {
          this.scheduleToggleButtons();
          if (Date.now() >= this.scrollRecordReadyAt) plugin.recordScrollPosition(view);
        };
        this.appliedGutterPad = 0;
        this.gutterRaf = null;
        view.scrollDOM.addEventListener("mousedown", this.onToggleRowMouseDown);
        view.scrollDOM.addEventListener("scroll", this.onScroll, { passive: true });
        if (!this.mobileViewOnly) {
          document.addEventListener("pointerdown", this.onMouseDownCapture, true);
          document.addEventListener("mousedown", this.onMouseDownCapture, true);
          document.addEventListener("mouseup", this.onMouseDownCapture, true);
          document.addEventListener("auxclick", this.onMouseDownCapture, true);
          document.addEventListener("contextmenu", this.onContextMenuCapture, true);
          view.dom.addEventListener("keydown", this.onKeyDown, true);
          view.dom.addEventListener("beforeinput", this.onBeforeInputCapture, true);
          view.dom.addEventListener("paste", this.onPasteCapture, true);
        } else {
          view.dom.addEventListener("keydown", this.onKeyDown, true);
          view.dom.addEventListener("beforeinput", this.onMobileBeforeInput, true);
          this.onMobileTableLinkTap = (e) => {
            this.plugin.handleMobileTableLinkTap(this.view, e);
          };
          view.dom.addEventListener("click", this.onMobileTableLinkTap, true);
        }
        this.hierarchyMutationObserver = new MutationObserver((mutations) => {
          if (this.hierarchyMutationRaf !== null) return;
          const relevant = mutations.some((m) => Array.from(m.addedNodes || []).some(nodeHasNsbEmbedLikeContent));
          if (!relevant) return;
          this.hierarchyMutationRaf = requestAnimationFrame(() => {
            this.hierarchyMutationRaf = null;
            this.applyHierarchyVisualLayout(scanToggleBlocks(this.view.state.doc));
          });
        });
        this.hierarchyMutationObserver.observe(this.scroller, { childList: true, subtree: true });
        this.onWindowResize = () => {
          this.scheduleGutterCheck();
          this.scheduleToggleButtons();
          if (this.resizeSettleTimer) clearTimeout(this.resizeSettleTimer);
          this.resizeSettleTimer = setTimeout(() => {
            this.resizeSettleTimer = null;
            this.scheduleGutterCheck();
            this.scheduleToggleButtons();
          }, 150);
        };
        this.resizeSettleTimer = null;
        window.addEventListener("resize", this.onWindowResize);
        this.scheduleLivePreviewStateSync();
        this.scheduleToggleButtons();
        this.scheduleGutterCheck();
      }
      update(update) {
        const livePreviewMode = isLivePreviewEditorView(this.view);
        if (livePreviewMode !== this.livePreviewMode) {
          this.livePreviewMode = livePreviewMode;
          this.scheduleLivePreviewStateSync();
          if (!livePreviewMode) {
            this.clearToggleButtons();
            this.clearHierarchyVisualLayout();
          }
        }
        if (update.docChanged || update.viewportChanged || update.geometryChanged) this.scheduleToggleButtons();
        if (update.docChanged) this.scheduleLegacyMigration();
        if (update.docChanged || update.transactions.some((tr) => tr.effects && tr.effects.length)) {
          this.scheduleNativeFoldGuard();
        }
        if (update.geometryChanged || update.viewportChanged) this.scheduleGutterCheck();
      }
      // Keeps enough left gutter inside the scroller for the drag handle + plus
      // button. When the window is narrow Obsidian protects the sidebar and the
      // note's own left margin can shrink below the icon cluster width, leaving
      // the icons squashed on top of each other at x=0. The note content area is
      // compressed instead, so both icons always render and stay clickable.
      scheduleGutterCheck() {
        if (this.mobileViewOnly || !this.overlay) return;
        if (this.gutterRaf != null) return;
        this.gutterRaf = requestAnimationFrame(() => {
          this.gutterRaf = null;
          this.ensureHandleGutter();
        });
      }
      ensureHandleGutter() {
        if (this.mobileViewOnly || !this.overlay) return;
        try {
          const scrollerRect = this.scroller.getBoundingClientRect();
          const contentRect = this.view.contentDOM.getBoundingClientRect();
          if (!scrollerRect.width || !contentRect.width) return;
          const applied = this.appliedGutterPad || 0;
          const baseGutter = contentRect.left - scrollerRect.left - applied;
          const needed = this.overlay.hoverClusterPad();
          const extra = Math.max(0, Math.ceil(needed - baseGutter));
          if (extra === applied) return;
          this.appliedGutterPad = extra;
          this.scroller.style.paddingLeft = extra > 0 ? extra + "px" : "";
          this.scheduleToggleButtons();
          this.scheduleGutterCheck();
        } catch (_) {
        }
      }
      // Mobile soft keyboards drive editing through beforeinput rather than real
      // key events. Map the relevant input types onto the same TL handlers that
      // desktop keydown uses, so Enter/Backspace behave identically on mobile.
      handleMobileBeforeInput(e) {
        if (e.defaultPrevented || e.isComposing) return;
        const inputType = e.inputType || "";
        let key = null;
        if (inputType === "insertParagraph" || inputType === "insertLineBreak") key = "Enter";
        else if (inputType === "deleteContentBackward" || inputType === "deleteContent") key = "Backspace";
        else if (inputType === "deleteContentForward") key = "Delete";
        if (!key) return;
        const synthetic = {
          key,
          isComposing: false,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          stopImmediatePropagation: () => {
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }
        };
        if (key === "Enter") {
          if (this.plugin.handleToggleEnter(this.view, synthetic)) this.scheduleToggleButtons();
          return;
        }
        if (this.plugin.handleToggleDelete(this.view, synthetic)) this.scheduleToggleButtons();
        else if (this.livePreviewMode) this.plugin.handleListMarkerKey(this.view, synthetic);
      }
      scheduleNativeFoldGuard() {
        if (!import_language || this.nativeFoldGuardRaf != null) return;
        this.nativeFoldGuardRaf = requestAnimationFrame(() => {
          this.nativeFoldGuardRaf = null;
          try {
            this.plugin.clearNativeFoldsOnToggleLines(this.view);
          } catch (_) {
          }
        });
      }
      scheduleLivePreviewStateSync() {
        if (this.livePreviewSyncRaf !== null) cancelAnimationFrame(this.livePreviewSyncRaf);
        this.livePreviewSyncRaf = requestAnimationFrame(() => {
          this.livePreviewSyncRaf = null;
          try {
            if (this.livePreviewMode) this.plugin.migrateLegacyTogglesCM(this.view);
          } catch (_) {
          }
          try {
            if (this.plugin.setLivePreviewModeEffect) {
              this.view.dispatch({ effects: this.plugin.setLivePreviewModeEffect.of(this.livePreviewMode) });
            }
          } catch (_) {
          }
        });
      }
      scheduleLegacyMigration() {
        if (this.legacyMigrationRaf != null) return;
        this.legacyMigrationRaf = requestAnimationFrame(() => {
          this.legacyMigrationRaf = null;
          if (!this.livePreviewMode) return;
          try {
            this.plugin.migrateLegacyTogglesCM(this.view);
          } catch (_) {
          }
        });
      }
      scheduleToggleButtons() {
        if (this.toggleButtonRaf !== null) cancelAnimationFrame(this.toggleButtonRaf);
        this.toggleButtonRaf = requestAnimationFrame(() => {
          this.toggleButtonRaf = null;
          this.renderToggleButtons();
        });
      }
      clearToggleButtons() {
        for (const btn of this.toggleButtons) btn.remove();
        this.toggleButtons = [];
      }
      renderToggleButtons() {
        this.clearToggleButtons();
        if (!this.livePreviewMode) {
          this.clearHierarchyVisualLayout();
          return;
        }
        const doc = this.view.state.doc;
        const toggles = scanToggleBlocks(doc);
        this.applyHierarchyVisualLayout(toggles);
        if (!toggles.length) return;
        const scrollerRect = this.scroller.getBoundingClientRect();
        const seenTitleLines = /* @__PURE__ */ new Set();
        for (const t of toggles) {
          if (isLineHiddenByCollapsedToggle(toggles, t.titleLine)) continue;
          if (seenTitleLines.has(t.titleLine)) continue;
          seenTitleLines.add(t.titleLine);
          const line = Array.from(this.scroller.querySelectorAll(".cm-line.nsb-toggle-title-line")).find((el) => el.getAttribute("data-nsb-toggle-id") === t.id) || domLineForNum(this.view, this.scroller, t.titleLine);
          if (!line) continue;
          const r = line.getBoundingClientRect();
          if (r.bottom < scrollerRect.top || r.top > scrollerRect.bottom) continue;
          const size = this.plugin.settings.toggleIconSize || 16;
          const empty = !toggleHasTitleContent(doc, t);
          let firstRowTop = r.top, firstRowBottom = r.bottom;
          try {
            const titleDocLine = doc.line(t.titleLine + 1);
            const coords = empty ? null : this.view.coordsAtPos(titleDocLine.from);
            if (coords && coords.bottom > coords.top) {
              firstRowTop = coords.top;
              firstRowBottom = coords.bottom;
            } else {
              const m = this._firstRowMetrics(line, r, size);
              firstRowTop = m.top;
              firstRowBottom = m.bottom;
            }
          } catch (_) {
            const m = this._firstRowMetrics(line, r, size);
            firstRowTop = m.top;
            firstRowBottom = m.bottom;
          }
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "nsb-toggle-triangle nsb-toggle-overlay-triangle" + (t.open ? " is-open" : " is-closed") + (empty ? " is-empty" : "") + (this.plugin.activeToggleId === t.id ? " is-active" : "");
          btn.setAttribute("aria-label", t.open ? paipaT("Collapse toggle list") : paipaT("Expand toggle list"));
          btn.style.top = firstRowTop - scrollerRect.top + this.scroller.scrollTop + Math.max(0, (firstRowBottom - firstRowTop - size) / 2) + "px";
          btn.style.left = r.left - scrollerRect.left + this.scroller.scrollLeft + 4 + t.depth * 22 + "px";
          btn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.plugin.activeToggleId = t.id;
            document.querySelectorAll(".nsb-toggle-triangle.is-active").forEach((el) => el.classList.remove("is-active"));
            btn.classList.add("is-active");
          });
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.plugin.setToggleOpen(this.view, t.startLine, !t.open);
            this.scheduleToggleButtons();
          });
          this.scroller.appendChild(btn);
          this.toggleButtons.push(btn);
        }
      }
      // Top/bottom (client coords) of the first visual text row of a title line,
      // for triangle centering. Accounts for the line's padding-top — important
      // with Notion block-spacing on, otherwise the triangle sits too high. The
      // height is clamped to one text row so wrapped/heading titles don't center
      // the triangle across the whole block.
      _firstRowMetrics(line, rect, iconSize) {
        let padTop = 0, rowH = 0;
        try {
          const cs = window.getComputedStyle(line);
          padTop = parseFloat(cs.paddingTop) || 0;
          const parsedLineHeight = parseFloat(cs.lineHeight || "");
          if (Number.isFinite(parsedLineHeight) && parsedLineHeight > 0) {
            rowH = parsedLineHeight;
          } else {
            const fontSize = parseFloat(cs.fontSize || "") || 16;
            rowH = fontSize * 1.5;
          }
        } catch (_) {
          rowH = 24;
        }
        const top = rect.top + padTop;
        const avail = Math.max(0, rect.height - padTop);
        const h = Math.max(iconSize, Math.min(avail > 0 ? avail : rowH, rowH));
        return { top, bottom: top + h };
      }
      clearHierarchyVisualLayout() {
        if (this.plugin.expiringBlocks && this.plugin.expiringBlocks.clearVisual) {
          this.plugin.expiringBlocks.clearVisual(this.scroller);
        }
        this.scroller.querySelectorAll(".nsb-hierarchy-visual,.nsb-hierarchy-frame-clean").forEach((el) => {
          el.classList.remove("nsb-hierarchy-visual");
          el.classList.remove("nsb-hierarchy-hidden");
          el.classList.remove("nsb-hierarchy-frame-clean");
          el.style.removeProperty("--nsb-hierarchy-offset");
          el.style.marginLeft = "";
          el.style.width = "";
          el.style.maxWidth = "";
          el.style.boxSizing = "";
          el.style.display = "";
        });
      }
      markHierarchyVisual(el, depth) {
        if (!el || depth <= 0) return;
        const offset = 18 + depth * 22;
        el.classList.add("nsb-hierarchy-visual");
        el.style.setProperty("--nsb-hierarchy-offset", offset + "px");
        el.style.marginLeft = offset + "px";
        el.style.width = "calc(100% - " + offset + "px)";
        el.style.maxWidth = "calc(100% - " + offset + "px)";
        el.style.boxSizing = "border-box";
      }
      markHierarchyFrameClean(el) {
        if (!el) return;
        el.classList.add("nsb-hierarchy-frame-clean");
      }
      applyHierarchyVisualLayout(toggles) {
        this.clearHierarchyVisualLayout();
        if (!toggles || !toggles.length) return;
        const doc = this.view.state.doc;
        const wbFences = scanWbFences(doc);
        const quoteRanges = scanQuoteBlocks(doc);
        const embedRanges = scanInternalEmbedLines(doc);
        const handled = /* @__PURE__ */ new Set();
        const markHidden = (el) => {
          if (!el || handled.has(el)) return;
          handled.add(el);
          el.classList.add("nsb-hierarchy-visual", "nsb-hierarchy-hidden");
          el.style.setProperty("display", "none", "important");
        };
        const mark = (el, range) => {
          if (!el || !range || handled.has(el)) return;
          if (isRangeHiddenByCollapsedToggle(toggles, range.startLine, range.endLine)) {
            markHidden(el);
            return;
          }
          handled.add(el);
          this.markHierarchyVisual(el, getToggleBodyDepth(toggles, range.startLine));
          if (this.plugin.expiringBlocks && this.plugin.expiringBlocks.decorateVisual) {
            this.plugin.expiringBlocks.decorateVisual(el, range.startLine, range.endLine, toggles);
          }
        };
        const markVisualWithRoot = (visual, root, range) => {
          if (!visual || !range || handled.has(visual)) return;
          if (isRangeHiddenByCollapsedToggle(toggles, range.startLine, range.endLine)) {
            markHidden(root || visual);
            return;
          }
          handled.add(visual);
          if (root && root !== visual) this.markHierarchyFrameClean(root);
          this.markHierarchyVisual(visual, getToggleBodyDepth(toggles, range.startLine));
          if (this.plugin.expiringBlocks && this.plugin.expiringBlocks.decorateVisual) {
            this.plugin.expiringBlocks.decorateVisual(visual, range.startLine, range.endLine, toggles);
          }
        };
        for (const provider of this.plugin.blockProviders()) {
          for (const unit of provider.nsbUnits(this.view) || []) {
            if (unit.el && unit.el.classList && unit.el.classList.contains("cm-line")) continue;
            mark(unit.el, unit);
          }
        }
        for (const visual of Array.from(this.scroller.querySelectorAll(".wb-container"))) {
          const root = getWbBlockRoot(visual) || visual;
          const range = resolveWbEmbedRange(visual, this.view, wbFences) || resolveElementRangeFallback(root, this.view);
          markVisualWithRoot(visual, root, range);
        }
        for (const visual of Array.from(this.scroller.querySelectorAll(".callout"))) {
          const root = getEmbedBlockRoot(visual);
          const range = matchRangesToElement(quoteRanges, root, this.view, 80) || matchRangesToElement(quoteRanges, visual, this.view, 80) || resolveElementRangeFallback(root || visual, this.view);
          markVisualWithRoot(visual, root || visual, range);
        }
        const genericEmbedRoots = Array.from(new Set(
          Array.from(this.scroller.querySelectorAll(".cm-embed-block,.cm-preview-code-block")).map((root) => getEmbedBlockRoot(root) || root)
        )).filter((root) => !isWbBookmarkEmbed(root) && !root.querySelector(".callout"));
        genericEmbedRoots.forEach((root, index) => {
          const range = matchRangesToElement(embedRanges, root, this.view, 140) || embedRanges[index] || resolveElementRangeFallback(root, this.view);
          mark(root, range);
        });
        for (const visual of Array.from(this.scroller.querySelectorAll(BUILTIN_EMBED_SELECTOR))) {
          if (isWbBookmarkEmbed(visual)) continue;
          const root = getEmbedBlockRoot(visual) || visual;
          const range = resolveBuiltinEmbedRange(visual, this.view, embedRanges) || resolveElementRangeFallback(root, this.view);
          if (root && root !== visual) this.markHierarchyFrameClean(root);
          mark(root, range);
        }
        for (const root of genericEmbedRoots) {
          const range = matchRangesToElement(embedRanges, root, this.view, 140) || resolveElementRangeFallback(root, this.view);
          mark(root, range);
        }
      }
      handleMouseDownCapture(e) {
        if (e.target?.closest?.(".gv")) return;
        if (!NSB_CTXMENU_FEATURES_ENABLED || !this.plugin.settings.suppressRightClickLineSelection) {
          this.savedRightClickSelection = null;
          return;
        }
        if (e.button !== 2) return;
        if (!this.view.dom.contains(e.target)) return;
        const line = e.target && e.target.closest ? e.target.closest(".cm-line") : null;
        const embed = e.target && e.target.closest ? e.target.closest(".cm-embed-block,.cm-preview-code-block") : null;
        if (!line && !embed || e.target.closest(".nsb-handle") || e.target.closest(".nsb-toggle-triangle")) return;
        if (line && isTableElement(line)) return;
        if (e.type !== "mouseup" && !this.savedRightClickSelection) {
          this.savedRightClickSelection = this.view.state.selection;
          this.savedRightClickNativeRanges = this.captureNativeSelectionRanges();
        }
        if (e.type !== "mouseup") e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        this.restoreRightClickSelection(this.savedRightClickSelection);
      }
      handleContextMenuCapture(e) {
        if (e.target?.closest?.(".gv")) return;
        if (!NSB_CTXMENU_FEATURES_ENABLED) return;
        if (!this.view.dom.contains(e.target)) return;
        this.plugin.closeOpenContextMenus();
        if (!this.plugin.settings.suppressRightClickLineSelection) {
          this.savedRightClickSelection = null;
          this.savedRightClickNativeRanges = null;
          return;
        }
        if (this.nativeSelectionLooksLikeWord()) {
          this.savedRightClickSelection = null;
          this.savedRightClickNativeRanges = null;
          this.syncEditorSelectionToNative();
          return;
        }
        if (!this.savedRightClickSelection) return;
        const selection = this.savedRightClickSelection;
        const nativeRanges = this.savedRightClickNativeRanges || [];
        this.savedRightClickSelection = null;
        this.savedRightClickNativeRanges = null;
        this.restoreRightClickSelection(selection, nativeRanges);
      }
      captureNativeSelectionRanges() {
        try {
          const sel = window.getSelection && window.getSelection();
          if (!sel || !sel.rangeCount) return [];
          const ranges = [];
          for (let i = 0; i < sel.rangeCount; i++) {
            const range = sel.getRangeAt(i);
            if (this.view.dom.contains(range.commonAncestorContainer)) ranges.push(range.cloneRange());
          }
          return ranges;
        } catch (_) {
          return [];
        }
      }
      closestLineFromNode(node) {
        if (!node) return null;
        const el = node.nodeType === 1 ? node : node.parentElement;
        return el && el.closest ? el.closest(".cm-line") : null;
      }
      // True when the current native selection is a single, whitespace-free token
      // confined to one editor line — the shape of a word the browser auto-selects
      // for its spell-check correction menu (or an equivalent single-word selection
      // the user already had). Used to make a narrow exception to right-click line-
      // selection suppression so spelling corrections can apply on right-click.
      nativeSelectionLooksLikeWord() {
        try {
          const sel = window.getSelection && window.getSelection();
          if (!sel || sel.isCollapsed || sel.rangeCount !== 1) return false;
          const range = sel.getRangeAt(0);
          if (!this.view.dom.contains(range.commonAncestorContainer)) return false;
          const startLine = this.closestLineFromNode(range.startContainer);
          const endLine = this.closestLineFromNode(range.endContainer);
          if (!startLine || startLine !== endLine) return false;
          const text = range.toString();
          if (!text || /\s/.test(text)) return false;
          return true;
        } catch (_) {
          return false;
        }
      }
      // Aligns the CodeMirror selection with the current native word selection so a
      // correction driven through the editor state (not just Electron's
      // replaceMisspelling) targets the right range.
      syncEditorSelectionToNative() {
        try {
          const sel = window.getSelection && window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          const a = this.view.posAtDOM(range.startContainer, range.startOffset);
          const b = this.view.posAtDOM(range.endContainer, range.endOffset);
          if (typeof a !== "number" || typeof b !== "number" || a === b) return;
          this.view.dispatch({ selection: { anchor: Math.min(a, b), head: Math.max(a, b) } });
        } catch (_) {
        }
      }
      restoreRightClickSelection(selection, nativeRanges) {
        if (!NSB_CTXMENU_FEATURES_ENABLED) return;
        if (!selection) return;
        const restore = () => {
          if (this.plugin.settings.suppressRightClickLineSelection && this.nativeSelectionLooksLikeWord()) return;
          try {
            this.view.dispatch({ selection });
          } catch (_) {
          }
          try {
            const nativeSel = window.getSelection && window.getSelection();
            if (!nativeSel) return;
            if (nativeRanges && nativeRanges.length) {
              nativeSel.removeAllRanges();
              nativeRanges.forEach((range) => nativeSel.addRange(range.cloneRange()));
              return;
            }
            const keepNative = selection && selection.main && !selection.main.empty;
            if (!keepNative && nativeSel.rangeCount) nativeSel.removeAllRanges();
          } catch (_) {
          }
        };
        setTimeout(restore, 0);
        requestAnimationFrame(restore);
        requestAnimationFrame(() => requestAnimationFrame(restore));
      }
      handleToggleRowMouseDown(e) {
        if (e.target && e.target.closest && e.target.closest(".nsb-toggle-triangle")) return;
        const line = e.target && e.target.closest ? e.target.closest(".cm-line.nsb-toggle-title-line") : null;
        if (!line) return;
        const id = line.getAttribute("data-nsb-toggle-id");
        if (!id) return;
        this.plugin.activeToggleId = id;
        document.querySelectorAll(".nsb-toggle-triangle.is-active").forEach((el) => el.classList.remove("is-active"));
        this.scheduleToggleButtons();
      }
      getBoundaryLineContext() {
        const state = this.view.state;
        const sel = state.selection.main;
        if (!sel.empty) return null;
        const doc = state.doc;
        const line = doc.lineAt(sel.from);
        const lineNum = line.number - 1;
        const kind = getVacuumLineKind(doc, lineNum);
        if (!kind) return null;
        return { doc, line, lineNum, kind };
      }
      preserveCalloutBoundaryInsert(ctx, text, userEvent) {
        const normalized = String(text || "").replace(/\r\n?/g, "\n");
        const insert = "\n" + normalized;
        this.view.dispatch({
          changes: { from: ctx.line.from, to: ctx.line.to, insert },
          selection: { anchor: ctx.line.from + insert.length },
          userEvent
        });
      }
      handleBeforeInputCapture(e) {
        if (e.defaultPrevented) return;
        const inputType = e.inputType || "";
        if (!/^insert/.test(inputType)) return;
        const ctx = this.getBoundaryLineContext();
        if (!ctx) return;
        if (ctx.kind === "hr-before" || ctx.kind === "hr-after") {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return;
        }
        if (ctx.kind !== "quote-after" || typeof e.data !== "string") return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        this.preserveCalloutBoundaryInsert(ctx, e.data, "input.nsb.callout-boundary");
      }
      handlePasteCapture(e) {
        const ctx = this.getBoundaryLineContext();
        if (!ctx) return;
        if (ctx.kind === "hr-before" || ctx.kind === "hr-after") {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return;
        }
        if (ctx.kind !== "quote-after") return;
        const text = e.clipboardData && e.clipboardData.getData ? e.clipboardData.getData("text/plain") : "";
        if (!text) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        this.preserveCalloutBoundaryInsert(ctx, text, "input.nsb.callout-boundary.paste");
      }
      isBoundaryEditKey(e) {
        return e.key.length === 1 || e.key === "Enter" || e.key === "Tab" || e.key === "Backspace" || e.key === "Delete";
      }
      selectionTouchesHardVacuum(doc, from, to) {
        const start = doc.lineAt(Math.min(from, to)).number - 1;
        const end = doc.lineAt(Math.max(from, to)).number - 1;
        for (let i = start; i <= end; i++) {
          if (isHardVacuumLine(doc, i)) return true;
        }
        return false;
      }
      handleBoundaryKeyDown(e) {
        if (e.isComposing) return false;
        const state = this.view.state;
        const sel = state.selection.main;
        const doc = state.doc;
        if (!this.isBoundaryEditKey(e)) return false;
        if (!sel.empty) {
          if ((e.key === "Backspace" || e.key === "Delete") && this.selectionTouchesHardVacuum(doc, sel.from, sel.to)) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            return true;
          }
          return false;
        }
        const line = doc.lineAt(sel.from);
        const lineNum = line.number - 1;
        if (isHardVacuumLine(doc, lineNum)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return true;
        }
        if (e.key === "Backspace" && sel.from === line.from && lineNum > 0 && isHardVacuumLine(doc, lineNum - 1)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return true;
        }
        if (e.key === "Delete" && sel.from === line.to && lineNum + 1 < doc.lines && isHardVacuumLine(doc, lineNum + 1)) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return true;
        }
        const ctx = this.getBoundaryLineContext();
        if (!ctx || !isHardVacuumLine(doc, ctx.lineNum)) return false;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return true;
      }
      handleKeyDown(e) {
        if (this.handleBoundaryKeyDown(e)) return;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
        if (e.key === "Enter" && this.plugin.handleToggleEnter(this.view, e)) {
          this.scheduleToggleButtons();
          return;
        }
        if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.livePreviewMode && this.plugin.handleToggleArrowNav(this.view, e)) {
          return;
        }
        if ((e.key === "Backspace" || e.key === "Delete") && this.plugin.handleToggleDelete(this.view, e)) {
          this.scheduleToggleButtons();
          return;
        }
        if (this.livePreviewMode) this.plugin.handleListMarkerKey(this.view, e);
      }
      destroy() {
        if (this.livePreviewSyncRaf !== null) cancelAnimationFrame(this.livePreviewSyncRaf);
        if (this.legacyMigrationRaf != null) cancelAnimationFrame(this.legacyMigrationRaf);
        if (this.nativeFoldGuardRaf != null) cancelAnimationFrame(this.nativeFoldGuardRaf);
        if (this.toggleButtonRaf !== null) cancelAnimationFrame(this.toggleButtonRaf);
        if (this.hierarchyMutationRaf !== null) cancelAnimationFrame(this.hierarchyMutationRaf);
        if (this.hierarchyMutationObserver) this.hierarchyMutationObserver.disconnect();
        if (this.gutterRaf != null) cancelAnimationFrame(this.gutterRaf);
        if (this.resizeSettleTimer) clearTimeout(this.resizeSettleTimer);
        if (this.onWindowResize) window.removeEventListener("resize", this.onWindowResize);
        if (this.appliedGutterPad) {
          try {
            this.scroller.style.paddingLeft = "";
          } catch (_) {
          }
        }
        this.view.scrollDOM.removeEventListener("mousedown", this.onToggleRowMouseDown);
        this.view.scrollDOM.removeEventListener("scroll", this.onScroll);
        if (!this.mobileViewOnly) {
          document.removeEventListener("pointerdown", this.onMouseDownCapture, true);
          document.removeEventListener("mousedown", this.onMouseDownCapture, true);
          document.removeEventListener("mouseup", this.onMouseDownCapture, true);
          document.removeEventListener("auxclick", this.onMouseDownCapture, true);
          document.removeEventListener("contextmenu", this.onContextMenuCapture, true);
          this.view.dom.removeEventListener("keydown", this.onKeyDown, true);
          this.view.dom.removeEventListener("beforeinput", this.onBeforeInputCapture, true);
          this.view.dom.removeEventListener("paste", this.onPasteCapture, true);
        } else {
          this.view.dom.removeEventListener("keydown", this.onKeyDown, true);
          this.view.dom.removeEventListener("beforeinput", this.onMobileBeforeInput, true);
          if (this.onMobileTableLinkTap) this.view.dom.removeEventListener("click", this.onMobileTableLinkTap, true);
        }
        this.clearHierarchyVisualLayout();
        this.clearToggleButtons();
        if (this.overlay) this.overlay.destroy();
      }
    };
    var NotionStyleBlocksPlugin = class extends import_obsidian.Plugin {
      constructor() {
        super(...arguments);
        this.isDragging = false;
        this.overlayMap = /* @__PURE__ */ new Map();
        this.activeToggleId = null;
        this.activeContextMenu = null;
      }
      closeOpenContextMenus() {
        try {
          if (this.activeContextMenu && typeof this.activeContextMenu.hide === "function") this.activeContextMenu.hide();
        } catch (_) {
        }
        this.activeContextMenu = null;
        try {
          document.querySelectorAll("body > .menu").forEach((el) => el.remove());
        } catch (_) {
        }
      }
      isNativeDeleteLineSelectionTitle(title) {
        const normalized = String(title || "").toLowerCase().replace(/\s+/g, " ").trim();
        const compact = normalized.replace(/\s+/g, "");
        if (!normalized) return false;
        if (compact.includes("deleteline/selection")) return true;
        if (normalized.includes("delete") && normalized.includes("line") && normalized.includes("selection")) return true;
        if (normalized.includes("\u5220\u9664") && (normalized.includes("\u884C") || normalized.includes("line")) && (normalized.includes("\u9009") || normalized.includes("selection"))) return true;
        return false;
      }
      removeEditorMenuDeleteItems(menu) {
        try {
          if (!menu || !Array.isArray(menu.items)) return;
          menu.items = menu.items.filter((item) => {
            const title = item && (item.title || item.text || item.itemEl && item.itemEl.textContent || item.dom && item.dom.textContent);
            return !this.isNativeDeleteLineSelectionTitle(title);
          });
        } catch (_) {
        }
      }
      removeEditorMenuDeleteDomItems() {
        try {
          document.querySelectorAll("body > .menu .menu-item").forEach((el) => {
            if (this.isNativeDeleteLineSelectionTitle(el.textContent || "")) el.remove();
          });
        } catch (_) {
        }
      }
      // Web Bookmark, Gallery View and Expiring Blocks add to the shared section
      // before this handler runs (plugin load order); settle the group's order
      // here. Items added afterwards (Section Blocks) simply follow at the end.
      orderEditorMenuSection(menu) {
        try {
          if (!menu || !Array.isArray(menu.items)) return;
          const order = ["Web bookmark", "Gallery", "Expiring block", "Delete", "Toggle list"];
          const titleOf = (item) => String(item && (item.titleEl ? item.titleEl.textContent : item.title) || "").trim();
          const orderIcons = ["link", "images", "hourglass", "trash", "list-plus"];
          const iconOf = (item) => {
            try {
              if (item && typeof item.icon === "string") return item.icon;
              const svg = item && item.iconEl && item.iconEl.querySelector && item.iconEl.querySelector("svg");
              const m = svg && /(?:^|\s)lucide-([\w-]+)/.exec(svg.getAttribute("class") || "");
              return m ? m[1] : "";
            } catch (_) {
              return "";
            }
          };
          // Titles may be translated: match the English title or its Chinese text, then the icon.
          const rank = (item) => {
            const title = titleOf(item);
            let k = order.findIndex((en) => en === title || PAIPA_I18N_ZH[en] === title);
            if (k < 0) {
              const icon = iconOf(item);
              k = icon ? orderIcons.indexOf(icon) : -1;
            }
            return k < 0 ? order.length : k;
          };
          const inSection = (item) => !!item && item.section === "editor-enhancer";
          const group = menu.items.filter(inSection).sort((a, b) => rank(a) - rank(b));
          menu.items = menu.items.filter((item) => !inSection(item)).concat(group);
        } catch (_) {
        }
      }
      scheduleEditorMenuCleanup() {
        const cleanup = () => this.removeEditorMenuDeleteDomItems();
        setTimeout(cleanup, 0);
        setTimeout(cleanup, 30);
        setTimeout(cleanup, 90);
        setTimeout(cleanup, 180);
        requestAnimationFrame(cleanup);
        requestAnimationFrame(() => requestAnimationFrame(cleanup));
      }
      async onload() {
        await this.loadSettings();
        if (this.isExpiringFallback && this.expiringEngineCancelled) return;
        NSB_EXPIRING_FALLBACK_ONLY = this.isExpiringFallback === true;
        setNsbTlFeaturesEnabled(this.settings.tlFeaturesEnabled);
        setNsbBlockFeaturesEnabled(this.settings.blockFeaturesEnabled);
        setNsbCtxMenuFeaturesEnabled(this.settings.contextMenuFeaturesEnabled);
        setNsbListMarkerFeaturesEnabled(this.settings.listMarkerFeaturesEnabled);
        this.addSettingTab(new SettingsTab(this.app, this));
        if (!this.isExpiringFallback) this.app.workspace.trigger("nsb:engine-loading", this);
        this.injectStyles();
        this.scrollMemory = /* @__PURE__ */ new Map();
        this._scrollRestoreSuppress = /* @__PURE__ */ new Set();
        this._viewLastFile = /* @__PURE__ */ new WeakMap();
        this.registerEvent(this.app.workspace.on("file-open", (file) => this.restoreScrollPositionOnOpen(file)));
        this.addCommand({
          id: "insert-toggle-list",
          name: paipaT("Toggle list"),
          editorCallback: (editor) => {
            if (this.settings.tlFeaturesEnabled === false) {
              new import_obsidian.Notice(paipaT("Toggle List is disabled in settings"));
              return;
            }
            this.makeToggleListFromEditorMenu(editor);
          }
        });
        this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
          if (!NSB_CTXMENU_FEATURES_ENABLED) return;
          this.removeEditorMenuDeleteItems(menu);
          const asOwnSection = (i) => {
            try {
              if (typeof i.setSection === "function") i.setSection("editor-enhancer");
            } catch (_) {
            }
            return i;
          };
          menu.addItem((i) => asOwnSection(i).setTitle(paipaT("Delete")).setIcon("trash").setDisabled(!this.canDeleteFromEditorMenu(editor)).onClick(() => this.deleteEditorSelectionFromMenu(editor)));
          if (this.settings.tlFeaturesEnabled !== false) {
            menu.addItem((i) => asOwnSection(i).setTitle(paipaT("Toggle list")).setIcon("list-plus").setDisabled(!this.canMakeToggleListFromEditor(editor)).onClick(() => this.makeToggleListFromEditorMenu(editor)));
          }
          this.orderEditorMenuSection(menu);
          this.scheduleEditorMenuCleanup();
        }));
        const self = this;
        this.setLivePreviewModeEffect = import_state.StateEffect.define();
        const toggleDecorationField = import_state.StateField.define({
          create() {
            return { live: false, decorations: import_view.Decoration.none, atomic: import_state.RangeSet.empty };
          },
          update(value, tr) {
            let live = value.live;
            let liveChanged = false;
            for (const effect of tr.effects) {
              if (effect.is(self.setLivePreviewModeEffect)) {
                live = effect.value === true;
                liveChanged = true;
              }
            }
            if (!live) {
              if (!value.live && !liveChanged && !tr.docChanged) return value;
              return { live, decorations: import_view.Decoration.none, atomic: import_state.RangeSet.empty };
            }
            if (liveChanged || tr.docChanged) {
              const built = self.buildToggleDecorationsFromDoc(tr.state.doc);
              return { live, decorations: built.decorations, atomic: built.atomic };
            }
            return value;
          },
          provide(field) {
            return [
              import_view.EditorView.decorations.from(field, (value) => value.decorations),
              import_view.EditorView.atomicRanges.of((view) => {
                const value = view.state.field(field, false);
                return value && value.atomic ? value.atomic : import_state.RangeSet.empty;
              })
            ];
          }
        });
        this.toggleDecorationField = toggleDecorationField;
        const toggleMarkerGuard = import_state.EditorState.transactionFilter.of((tr) => {
          const fieldValue = tr.startState.field(toggleDecorationField, false);
          if (!fieldValue || !fieldValue.live) return tr;
          const ue = tr.annotation(import_state.Transaction.userEvent) || "";
          if (ue.indexOf("nsb") >= 0 || ue === "undo" || ue === "redo" || /^undo|^redo/.test(ue)) return tr;
          if (!tr.docChanged) return self.guardToggleSelection(tr, fieldValue.atomic);
          return self.guardToggleMarkerChanges(tr, ue);
        });
        const ext = import_view.ViewPlugin.define((view) => {
          const cmEl = view.dom.closest(".cm-editor");
          if (!cmEl) return { update() {
          }, destroy() {
          } };
          const pluginView = new NsbEditorViewPlugin(self, view, cmEl);
          self.overlayMap.set(view, pluginView);
          return {
            update(update) {
              pluginView.update(update);
            },
            destroy() {
              pluginView.destroy();
              self.overlayMap.delete(view);
            }
          };
        });
        const listMarkerAtomic = import_view.EditorView.atomicRanges.of((view) => {
          if (!NSB_LIST_MARKER_FEATURES_ENABLED || !isLivePreviewEditorView(view)) return import_state.RangeSet.empty;
          if (!listMarkerAtomValue) listMarkerAtomValue = import_view.Decoration.mark({ class: "nsb-list-marker" });
          const builder = new import_state.RangeSetBuilder();
          const doc = view.state.doc;
          let last = -1;
          for (const range of view.visibleRanges) {
            for (let pos = range.from; pos <= range.to; ) {
              const line = doc.lineAt(pos);
              if (line.number > last) {
                last = line.number;
                const mk = listMarkerOf(line.text);
                if (mk) builder.add(line.from, line.from + mk.markerEnd, listMarkerAtomValue);
              }
              pos = line.to + 1;
            }
          }
          return builder.finish();
        });
        const listMarkerSelectionGuard = import_state.EditorState.transactionFilter.of((tr) => {
          if (!NSB_LIST_MARKER_FEATURES_ENABLED || tr.docChanged || !tr.selection) return tr;
          const fieldValue = tr.startState.field(toggleDecorationField, false);
          if (!fieldValue || !fieldValue.live) return tr;
          const ue = tr.annotation(import_state.Transaction.userEvent) || "";
          if (ue.indexOf("nsb") >= 0) return tr;
          const sel = tr.newSelection;
          let changed = false;
          const ranges = sel.ranges.map((r) => {
            if (!r.empty) return r;
            const line = tr.newDoc.lineAt(r.head);
            const mk = listMarkerOf(line.text);
            if (!mk || r.head >= line.from + mk.markerEnd) return r;
            changed = true;
            return import_state.EditorSelection.cursor(line.from + mk.markerEnd);
          });
          if (!changed) return tr;
          return [tr, { selection: import_state.EditorSelection.create(ranges, sel.mainIndex), userEvent: "select.nsb.list-marker" }];
        });
        this.registerEditorExtension([toggleDecorationField, toggleMarkerGuard, ext]);
        if (!this.isExpiringFallback) this.registerEditorExtension([listMarkerAtomic, listMarkerSelectionGuard]);
        this.toggleApi = {
          scan: scanToggleBlocks,
          parse: parseToggleAnyOpenLine,
          serialize: serializeToggleOpenLine,
          refresh: () => this.refreshToggleDecorations()
        };
        if (!this.isExpiringFallback) {
          this.app.__nsbToggleEngine = this;
          this.app.workspace.trigger("nsb:engine-ready", this);
        }
      }
      // Content-block plugins that expose nsbUnits() take part in hover targets,
      // move slots, hierarchy layout, drops and the handle menu (Gallery View,
      // Section Blocks, …). Duck-typed, so no plugin id list to maintain.
      blockProviders() {
        const plugins = this.app.plugins && this.app.plugins.plugins ? Object.values(this.app.plugins.plugins) : [];
        return plugins.filter((p) => p && typeof p.nsbUnits === "function");
      }
      setExpiringAdapter(adapter) {
        const previous = this.expiringBlocks;
        if (previous && previous !== adapter && previous.clearVisual) {
          for (const pv of this.overlayMap.values()) previous.clearVisual(pv.scroller);
        }
        this.expiringBlocks = adapter || null;
        NSB_EXPIRING_ADAPTER_ACTIVE = !!adapter;
        NSB_EXPIRING_FALLBACK_ONLY = this.isExpiringFallback === true;
        setNsbTlFeaturesEnabled(this.settings.tlFeaturesEnabled);
        this._applyFoldStyle();
        this.refreshToggleDecorations();
        for (const pv of this.overlayMap.values()) {
          pv.scheduleToggleButtons();
          pv.scheduleNativeFoldGuard();
        }
      }
      // Selection half of the toggle marker guard: an empty cursor placed
      // strictly inside any hidden fold range (mobile tap mapping past the
      // visible text, End key, DOM selection sync, ...) is normalized to the
      // fold start — i.e. the visible end of the row. Without this, Backspace
      // hits the protected marker and silently does nothing.
      //
      // NOTE: a CM6 Transaction exposes the resulting selection via newSelection,
      // not `.selection` (that earlier precondition made this guard a no-op in
      // production, which is why mobile taps still stranded the cursor). The
      // previous-head comparison both skips no-move transactions and lets a real
      // keyboard cross sit at the fold end without bouncing back.
      guardToggleSelection(tr, atomic) {
        if (!atomic) return tr;
        let sel = null, prev = null;
        try {
          sel = tr.newSelection && tr.newSelection.main;
          prev = tr.startState.selection.main;
        } catch (_) {
          return tr;
        }
        if (!sel || !prev) return tr;
        if (sel.empty && sel.head === prev.head) return tr;
        let docLength = null;
        try {
          docLength = tr.startState.doc.length;
        } catch (_) {
        }
        const pointer = tr.isUserEvent("select.pointer");
        const fix = (pos, prevPos) => {
          let target = null;
          atomic.between(Math.max(0, pos - 1), pos, (from, to) => {
            if (pos <= from || pos > to) return;
            if (pos < to) {
              target = from;
              return;
            }
            if (prevPos !== from || pointer) {
              target = from;
              return;
            }
            target = docLength != null && to < docLength ? to + 1 : from;
          });
          return target == null ? pos : target;
        };
        let head, anchor;
        try {
          head = fix(sel.head, prev.head);
          anchor = sel.empty ? head : fix(sel.anchor, prev.anchor);
        } catch (_) {
          return tr;
        }
        if (head === sel.head && anchor === sel.anchor) return tr;
        return [tr, { selection: { anchor, head } }];
      }
      // Core of the toggle marker guard (see toggleMarkerGuard in onload).
      // Returns the original transaction, a rebuilt spec with remapped changes,
      // or [] to cancel the transaction entirely.
      guardToggleMarkerChanges(tr, ue) {
        const doc = tr.startState.doc;
        const toggles = scanToggleBlocks(doc);
        if (!toggles.length) return tr;
        {
          const titleMarkers = [];
          const hardRegions = [];
          for (const t of toggles) {
            const close = doc.line(t.endLine + 1);
            let closeRemapTo = null;
            if (t.inline) {
              closeRemapTo = toggleTitleVisibleEndPos(doc, t);
              if (t.open && t.bodyStartLine <= t.bodyEndLine) {
                for (let ln = t.bodyEndLine; ln >= t.bodyStartLine; ln--) {
                  if (isToggleMarkerLineText(doc.line(ln + 1).text)) continue;
                  if (isLineHiddenByCollapsedToggle(toggles, ln)) continue;
                  closeRemapTo = visibleLineEndPos(doc, toggles, ln);
                  break;
                }
              }
            }
            hardRegions.push({
              from: Math.max(0, close.from - 1),
              to: close.to + 1,
              innerFrom: close.from,
              innerTo: close.to,
              remapTo: closeRemapTo
            });
            if (t.inline) {
              const title = doc.line(t.titleLine + 1);
              titleMarkers.push({
                from: toggleTitleVisibleEndPos(doc, t),
                to: title.to,
                lineFrom: title.from,
                clearTo: toggleTitleClearEndPos(doc, t),
                text: doc.sliceString(toggleTitleVisibleEndPos(doc, t), title.to).trim()
              });
            } else {
              const opener = doc.line(t.startLine + 1);
              hardRegions.push({
                from: Math.max(0, opener.from - 1),
                to: opener.to + 1,
                innerFrom: opener.from,
                innerTo: opener.to
              });
            }
          }
          let blocked = false;
          let modified = false;
          const out = [];
          tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
            if (blocked) return;
            const text = inserted.toString();
            const rewritten = titleMarkers.find((m2) => fromA < m2.to && toA > m2.from && m2.text && text.indexOf(m2.text) >= 0);
            if (rewritten) {
              out.push({ from: fromA, to: toA, insert: text });
              return;
            }
            const hard = hardRegions.find((r) => fromA < r.to && toA > r.from);
            if (hard) {
              const pureInsert = fromA === toA;
              const safe = pureInsert && text.length > 0 && (fromA === hard.innerTo && text.charAt(0) === "\n" || fromA === hard.innerFrom && text.charAt(text.length - 1) === "\n");
              if (safe) {
                out.push({ from: fromA, to: toA, insert: text });
                return;
              }
              if (pureInsert && text.length > 0 && text.indexOf("\n") < 0 && hard.remapTo != null) {
                out.push({ from: hard.remapTo, to: hard.remapTo, insert: text });
                modified = true;
                return;
              }
              blocked = true;
              return;
            }
            if (fromA === toA) {
              const m2 = titleMarkers.find((m3) => fromA > m3.from && fromA <= m3.to);
              if (m2) {
                out.push({ from: m2.from, to: m2.from, insert: text });
                modified = true;
                return;
              }
              out.push({ from: fromA, to: toA, insert: text });
              return;
            }
            const m = titleMarkers.find((m2) => fromA < m2.to && toA > m2.from);
            if (m) {
              if (toA > m.to) {
                blocked = true;
                return;
              }
              if (fromA >= m.from) {
                if (text) out.push({ from: m.from, to: m.from, insert: text });
                modified = true;
                return;
              }
              const clampTo = fromA === m.lineFrom ? m.clearTo : m.from;
              out.push({ from: fromA, to: clampTo, insert: text });
              modified = true;
              return;
            }
            out.push({ from: fromA, to: toA, insert: text });
          });
          if (blocked) return [];
          if (!modified) return tr;
          if (!out.length) return [];
          out.sort((a, b) => a.from - b.from || a.to - b.to);
          let delta = 0;
          let anchor = 0;
          for (const c of out) {
            anchor = c.from + delta + (c.insert ? c.insert.length : 0);
            delta += (c.insert ? c.insert.length : 0) - (c.to - c.from);
          }
          return {
            changes: out,
            selection: { anchor },
            scrollIntoView: true,
            userEvent: ue || void 0
          };
        }
      }
      onunload() {
        this.cancelEditDrag?.();
        var _a, _b, _c;
        document.querySelectorAll(".nsb-wrapper").forEach((w) => {
          const child = w.querySelector(":scope > :not(.nsb-handle)");
          if (child && w.parentElement) w.parentElement.insertBefore(child, w);
          w.remove();
        });
        (_a = document.getElementById("nsb-styles")) == null ? void 0 : _a.remove();
        (_b = document.getElementById("nsb-spacing-style")) == null ? void 0 : _b.remove();
        (_c = document.getElementById("nsb-fold-style")) == null ? void 0 : _c.remove();
        if (!this.isExpiringFallback) {
          if (this.app.__nsbToggleEngine === this) delete this.app.__nsbToggleEngine;
          this.app.workspace.trigger("nsb:engine-unloaded", this);
        }
      }
      injectStyles() {
        var _a;
        (_a = document.getElementById("nsb-styles")) == null ? void 0 : _a.remove();
        const style = document.createElement("style");
        style.id = "nsb-styles";
        style.textContent = `
      /* Editor Enhancer v1.2.0 */
      .cm-scroller{position:relative!important;}
      .cm-editor{overflow:visible!important;}
      .nsb-handle{
        position:absolute;
        width:var(--nsb-handle-w,20px);
        height:var(--nsb-handle-h,28px);
        display:flex;align-items:center;justify-content:center;
        cursor:grab;border-radius:4px;
        opacity:var(--nsb-opacity,.45);
        transition:opacity .1s ease,background-color .1s ease;
        z-index:100;user-select:none;pointer-events:auto;
        box-sizing:border-box;}
      .nsb-handle:hover{opacity:1!important;background-color:var(--background-modifier-hover);}
      .nsb-handle:active{cursor:grabbing;}
      .nsb-add-line-button{
        position:absolute;
        width:22px;height:22px;
        display:flex;align-items:center;justify-content:center;
        padding:0;border:0;border-radius:4px;
        background:transparent;color:var(--text-muted);
        opacity:var(--nsb-opacity,.45);
        cursor:pointer;z-index:101;pointer-events:auto;
        box-sizing:border-box;
      }
      .nsb-add-line-button:hover{
        opacity:1!important;
        background-color:var(--background-modifier-hover);
        color:var(--text-normal);
      }
      .nsb-add-line-button svg{width:16px;height:16px;}
      .nsb-pinned-handle{opacity:calc(var(--nsb-opacity,.45)*1.5);border:1px solid var(--background-modifier-border);}
      .nsb-pinned-handle:hover{opacity:1!important;}
      .nsb-sel-handle{opacity:calc(var(--nsb-opacity,.45)*1.4);border:1px dashed var(--interactive-accent);}
      .nsb-sel-handle:hover{opacity:1!important;}
      .nsb-dots{
        display:grid;
        grid-template-columns:var(--nsb-dot-size,3.5px) var(--nsb-dot-size,3.5px);
        grid-template-rows:var(--nsb-dot-size,3.5px) var(--nsb-dot-size,3.5px) var(--nsb-dot-size,3.5px);
        gap:var(--nsb-dot-gap,2.5px);
        pointer-events:none;
        line-height:0;font-size:0;}
      .nsb-dots span{
        display:block;
        width:var(--nsb-dot-size,3.5px);
        height:var(--nsb-dot-size,3.5px);
        border-radius:50%;
        background:var(--nsb-dot-color,#8c8c8c);
        margin:0;padding:0;flex-shrink:0;}
      .nsb-handle:hover .nsb-dots span{filter:brightness(0.6);}
      .markdown-reading-view .markdown-preview-section{padding-left:unset!important;}
      .nsb-reading-handle{display:none!important;}
      .nsb-ghost{position:fixed;pointer-events:none;z-index:9999;opacity:.72;
        background:var(--background-primary);border:1px solid var(--background-modifier-border);
        border-radius:4px;padding:2px 8px;box-shadow:0 2px 8px rgba(0,0,0,.10);
        transform:rotate(.5deg);max-width:480px;font-size:.91em;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-normal);}
      .nsb-drop-indicator{position:absolute;pointer-events:none;z-index:200;
        height:var(--nsb-line-height,3px);
        background:rgba(124,58,237,var(--nsb-line-opacity,.65));border-radius:2px;}
      .nsb-drop-indicator.is-segmented{background:transparent;}
      .nsb-drop-segment{position:absolute;top:0;height:100%;border-radius:2px;
        background:rgba(124,58,237,var(--nsb-line-opacity,.65));}
      .nsb-selected{background:rgba(124,58,237,.07)!important;border-radius:3px;}
      .cm-editor .cm-line.nsb-toggle-title-line{
        --nsb-toggle-title-offset:calc(var(--nsb-toggle-icon-size,16px) + 14px + (var(--nsb-toggle-depth,0) * 22px));
        padding-left:var(--nsb-toggle-title-offset)!important;
        padding-inline-start:var(--nsb-toggle-title-offset)!important;
        text-indent:0!important;
        min-height:1.4em;
        box-sizing:border-box;
        pointer-events:auto!important;
        user-select:text!important;
      }
      .cm-line.nsb-toggle-marker-line,
      .markdown-source-view.is-live-preview .cm-editor .cm-line.nsb-toggle-marker-line,
      .is-live-preview .cm-line.nsb-toggle-marker-line{
        display:none!important;
        height:0!important;
        min-height:0!important;
        padding-top:0!important;
        padding-bottom:0!important;
        margin-top:0!important;
        margin-bottom:0!important;
        line-height:0!important;
        font-size:0!important;
        overflow:hidden!important;
        opacity:0!important;
        color:transparent!important;
        pointer-events:none!important;
        user-select:none!important;
      }
      .cm-line.nsb-toggle-marker-line *,
      .markdown-source-view.is-live-preview .cm-editor .cm-line.nsb-toggle-marker-line *,
      .is-live-preview .cm-line.nsb-toggle-marker-line *{display:none!important;}
      .cm-editor .cm-line.nsb-toggle-body-line{
        pointer-events:auto!important;
        user-select:text!important;
      }
      /* Non-list rows keep the forced padding, so Obsidian's inline text-indent
         (it writes the same pair on "> quote" and space-indented rows) has to be
         neutralised as well, or the row's x follows the stale indent cache. */
      .cm-editor .cm-line.nsb-toggle-body-line:not([class*="HyperMD-list-line"]){
        padding-left:calc(18px + (var(--nsb-toggle-depth,0) * 22px))!important;
        text-indent:0!important;
      }
      /* List rows: offset by margin only. Obsidian writes an inline
         text-indent:-N / padding-inline-start:N pair; forcing padding here left
         text-indent unpaired, so the row's x followed Obsidian's per-line-number
         indent cache (stale after line shifts or a late body-line class). */
      .cm-editor .cm-line.nsb-toggle-body-line[class*="HyperMD-list-line"]{
        --nsb-native-list-offset:calc(18px - .44em + (var(--nsb-toggle-depth,0) * 22px));
        margin-left:var(--nsb-native-list-offset)!important;
        width:calc(100% - var(--nsb-native-list-offset))!important;
        max-width:calc(100% - var(--nsb-native-list-offset))!important;
        box-sizing:border-box;
      }
      .nsb-toggle-triangle{
        width:var(--nsb-toggle-icon-size,16px);height:var(--nsb-toggle-icon-size,16px);margin-left:calc(-1 * var(--nsb-toggle-icon-size,16px) - 4px);margin-right:4px;
        padding:0;border:0;background:transparent!important;box-shadow:none!important;
        appearance:none;-webkit-appearance:none;border-radius:0!important;
        display:inline-flex;align-items:center;justify-content:center;
        vertical-align:-3px;cursor:pointer;color:var(--text-muted);
      }
      .nsb-toggle-overlay-triangle{
        position:absolute;
        z-index:120;
        margin:0;
        pointer-events:auto;
      }
      .nsb-toggle-triangle::before{
        content:"";display:block;width:0;height:0;
        border-top:calc(var(--nsb-toggle-icon-size,16px) * .25) solid transparent;
        border-bottom:calc(var(--nsb-toggle-icon-size,16px) * .25) solid transparent;
        border-left:calc(var(--nsb-toggle-icon-size,16px) * .44) solid currentColor;opacity:.9;
        transform-origin:45% 50%;transition:transform .12s ease,opacity .12s ease;
      }
      .nsb-toggle-triangle.is-open::before{transform:rotate(90deg);}
      .nsb-toggle-triangle.is-empty::before{opacity:.24;}
      .nsb-toggle-triangle:not(.is-empty)::before{opacity:.95;}
      .nsb-toggle-triangle:not(.is-empty):hover::before{opacity:1;}
      .nsb-toggle-triangle.is-empty:hover::before,
      .nsb-toggle-triangle.is-empty.is-active::before{opacity:.24!important;}
      .cm-line.nsb-toggle-drop-target{background:rgba(124,58,237,.10)!important;border-radius:3px;}
      .nsb-caret-anchor{display:inline-block;width:0;padding:0;margin:0;}
      .nsb-hierarchy-visual{
        min-width:0!important;
        pointer-events:auto!important;
        user-select:auto!important;
      }
      .nsb-hierarchy-hidden{
        display:none!important;
        pointer-events:none!important;
        user-select:none!important;
      }
      .nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .nsb-hierarchy-frame-clean.nsb-hierarchy-hidden,
      .wb-container.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .internal-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .file-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .markdown-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .media-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .image-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .audio-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .video-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .canvas-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .pdf-embed.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .cm-embed-block.nsb-hierarchy-visual.nsb-hierarchy-hidden,
      .cm-preview-code-block.nsb-hierarchy-visual.nsb-hierarchy-hidden{
        display:none!important;
        pointer-events:none!important;
        user-select:none!important;
      }
      .nsb-hierarchy-visual.cm-embed-block,
      .nsb-hierarchy-visual.cm-preview-code-block,
      .nsb-hierarchy-frame-clean,
      .nsb-hierarchy-frame-clean.cm-embed-block,
      .nsb-hierarchy-frame-clean.cm-preview-code-block{
        background:transparent!important;
        border-color:transparent!important;
        border-style:none!important;
        box-shadow:none!important;
        outline:none!important;
      }
      .nsb-hierarchy-frame-clean::before,
      .nsb-hierarchy-frame-clean::after{
        background:transparent!important;
        border-color:transparent!important;
        box-shadow:none!important;
        outline:none!important;
        pointer-events:none!important;
      }
      .callout.nsb-hierarchy-visual{
        outline:none!important;
        box-shadow:none!important;
      }
      .nsb-hierarchy-visual .wb-container{
        width:100%!important;
        max-width:100%!important;
        margin-left:0!important;
        margin-right:0!important;
      }
      .wb-container.nsb-hierarchy-visual,
      .internal-embed.nsb-hierarchy-visual,
      .file-embed.nsb-hierarchy-visual,
      .markdown-embed.nsb-hierarchy-visual,
      .media-embed.nsb-hierarchy-visual,
      .image-embed.nsb-hierarchy-visual,
      .audio-embed.nsb-hierarchy-visual,
      .video-embed.nsb-hierarchy-visual,
      .canvas-embed.nsb-hierarchy-visual,
      .pdf-embed.nsb-hierarchy-visual{
        display:block!important;
      }
      .nsb-hierarchy-visual .wb-card{width:100%;box-sizing:border-box;}
      .nsb-hierarchy-visual .internal-embed,
      .nsb-hierarchy-visual .file-embed,
      .nsb-hierarchy-visual .markdown-embed,
      .nsb-hierarchy-visual .media-embed,
      .nsb-hierarchy-visual .image-embed,
      .nsb-hierarchy-visual .audio-embed,
      .nsb-hierarchy-visual .video-embed,
      .nsb-hierarchy-visual .canvas-embed,
      .nsb-hierarchy-visual .pdf-embed{
        width:100%!important;
        max-width:100%!important;
        margin-left:0!important;
        margin-right:0!important;
        box-sizing:border-box!important;
      }
      .cm-line.nsb-vacuum-line{
        pointer-events:none!important;
        user-select:none!important;
      }
      .cm-line.nsb-callout-boundary-line{
        pointer-events:auto!important;
        user-select:auto!important;
      }
      .cm-editor .cm-content > .cm-line.HyperMD-quote + .cm-line:empty::before,
      .cm-editor .cm-content > .cm-line.HyperMD-quote + .cm-line:has(> br:only-child)::before{
        content:"";
        display:block;
        width:28px;
        height:0;
        margin-left:6px;
        margin-top:calc(var(--line-height-normal, 1.5em) * .5);
        border-top:1px dotted rgba(124,58,237,.35);
        pointer-events:none;
      }
    `;
        document.head.appendChild(style);
        this._applyBlockSpacingStyle();
        this._applyFoldStyle();
        this._applyCSSVars();
      }
      // NSB owns expand/collapse: hide Obsidian's native fold arrow on ALL
      // heading rows (and TL title rows). Removed entirely when the TL feature
      // switch is off, restoring native heading folding untouched.
      _applyFoldStyle() {
        var _a;
        (_a = document.getElementById("nsb-fold-style")) == null ? void 0 : _a.remove();
        if (!NSB_TL_FEATURES_ENABLED) return;
        const style = document.createElement("style");
        style.id = "nsb-fold-style";
        style.textContent = `
      ${isNsbExpiringOnlyMode() ? "" : `.markdown-source-view .cm-line[class*="HyperMD-header"] .cm-fold-indicator,
      .markdown-source-view .cm-line[class*="HyperMD-header"] .collapse-indicator,`}
      .cm-editor .cm-line.nsb-toggle-title-line .cm-fold-indicator,
      .cm-editor .cm-line.nsb-toggle-title-line .collapse-indicator,
      .cm-editor .cm-line.nsb-toggle-title-line .cm-foldPlaceholder{
        display:none!important;
        pointer-events:none!important;
      }
    `;
        document.head.appendChild(style);
      }
      _applyBlockSpacingStyle() {
        var _a;
        (_a = document.getElementById("nsb-spacing-style")) == null ? void 0 : _a.remove();
        if (!NSB_BLOCK_FEATURES_ENABLED) return;
        if (!this.settings.blockSpacingEnabled) return;
        const half = Math.round(this.settings.blockSpacingPx / 2);
        const lineExtra = this.settings.lineSpacingPx || 0;
        const style = document.createElement("style");
        style.id = "nsb-spacing-style";
        const lineHeightRule = lineExtra > 0 ? `line-height: calc(var(--line-height-normal, 1.5) * 1em + ${lineExtra}px) !important;` : "";
        style.textContent = `
      .cm-editor .cm-content > .cm-line {
        padding-top: ${half}px !important;
        padding-bottom: ${half}px !important;
        ${lineHeightRule}
      }
      .cm-editor .cm-content > .cm-embed-block,
      .cm-editor .cm-content > .cm-preview-code-block {
        padding-top: ${half}px !important;
        padding-bottom: ${half}px !important;
        box-sizing: border-box !important;
      }
      .cm-editor .cm-content > .cm-embed-block > .cm-line,
      .cm-editor .cm-content > .cm-embed-block .cm-line {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        line-height: inherit !important;
      }
      .cm-editor .cm-content > .cm-line.nsb-toggle-marker-line {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        line-height: 0 !important;
        font-size: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        user-select: none !important;
      }
    `;
        document.head.appendChild(style);
      }
      _applyCSSVars() {
        const r = document.documentElement;
        const s = this.settings;
        const pad = s.handleSize;
        const w = 2 * s.dotSize + s.dotGap + 2 * pad;
        const h = 3 * s.dotSize + 2 * s.dotGap + 2 * pad;
        const gray = Math.round(255 * (1 - s.dotGray / 100));
        const grayHex = gray.toString(16).padStart(2, "0");
        const dotColor = `#${grayHex}${grayHex}${grayHex}`;
        r.style.setProperty("--nsb-opacity", String(s.handleOpacity));
        r.style.setProperty("--nsb-handle-w", w + "px");
        r.style.setProperty("--nsb-handle-h", h + "px");
        r.style.setProperty("--nsb-dot-size", s.dotSize + "px");
        r.style.setProperty("--nsb-dot-gap", s.dotGap + "px");
        r.style.setProperty("--nsb-dot-color", dotColor);
        r.style.setProperty("--nsb-line-height", s.lineHeight + "px");
        r.style.setProperty("--nsb-line-opacity", String(s.lineOpacity));
        r.style.setProperty("--nsb-toggle-icon-size", (s.toggleIconSize || 16) + "px");
      }
      getMdViewForEditor(editorView) {
        let found = null;
        this.app.workspace.iterateAllLeaves((leaf) => {
          if (found) return;
          if (!(leaf.view instanceof import_obsidian.MarkdownView)) return;
          if (leaf.view.editor && leaf.view.editor.cm === editorView) found = leaf.view;
        });
        return found;
      }
      buildToggleDecorationsFromDoc(doc) {
        const toggles = scanToggleBlocks(doc);
        const decos = [];
        const hiddenRanges = [];
        const titleLines = /* @__PURE__ */ new Map();
        const markerLines = toggleHiddenMarkerLines(toggles);
        for (const t of toggles) {
          titleLines.set(t.titleLine, t);
        }
        const hideRange = (from, to, withAnchor) => {
          if (to <= from) return;
          const deco = import_view.Decoration.replace(
            withAnchor ? { widget: new NsbTitleCaretAnchorWidget() } : {}
          );
          decos.push(deco.range(from, to));
          hiddenRanges.push(deco.range(from, to));
        };
        for (const t of toggles) {
          if (isLineHiddenByCollapsedToggle(toggles, t.titleLine)) continue;
          const title = doc.line(t.titleLine + 1);
          decos.push(import_view.Decoration.line({
            attributes: {
              class: "nsb-toggle-title-line",
              "data-nsb-toggle-id": t.id,
              style: "--nsb-toggle-depth:" + t.depth
            }
          }).range(title.from));
          if (t.inline) {
            const markerFrom = toggleTitleVisibleEndPos(doc, t);
            const close = doc.line(t.endLine + 1);
            const emptyTitle = t.titleMarkerFrom === 0;
            if (!t.open || t.bodyStartLine > t.bodyEndLine) {
              hideRange(markerFrom, close.to, emptyTitle);
            } else {
              hideRange(markerFrom, title.to, emptyTitle);
              hideRange(doc.line(t.endLine).to, close.to);
            }
          } else {
            addToggleMarkerLineDecoration(decos, doc, t.startLine);
            if (!t.open) {
              if (t.bodyStartLine <= t.bodyEndLine) {
                if (t.endLine + 1 < doc.lines && isBlankLineText(doc.line(t.endLine + 2).text)) {
                  addReplaceLineRangeDecoration(decos, doc, t.bodyStartLine, t.bodyEndLine);
                  addToggleMarkerLineDecoration(decos, doc, t.endLine);
                } else {
                  addReplaceLineRangeDecoration(decos, doc, t.bodyStartLine, t.endLine);
                }
              } else {
                addToggleCloseLineDecoration(decos, doc, t.endLine);
              }
            } else {
              addToggleCloseLineDecoration(decos, doc, t.endLine);
            }
          }
        }
        for (let i = 0; i < doc.lines; i++) {
          if (markerLines.has(i) || titleLines.has(i) || isLineHiddenByCollapsedToggle(toggles, i)) continue;
          if (isVacuumLine(doc, i)) {
            if (isHardVacuumLine(doc, i)) {
              addReplaceLineDecoration(decos, doc, i);
              continue;
            }
            const line2 = doc.line(i + 1);
            decos.push(import_view.Decoration.line({
              attributes: { class: "nsb-callout-boundary-line" }
            }).range(line2.from));
            continue;
          }
          const depth = getToggleBodyDepth(toggles, i);
          if (depth <= 0) continue;
          const line = doc.line(i + 1);
          decos.push(import_view.Decoration.line({
            attributes: {
              class: "nsb-toggle-body-line",
              style: "--nsb-toggle-depth:" + depth
            }
          }).range(line.from));
        }
        if (this.expiringBlocks && this.expiringBlocks.decorate) this.expiringBlocks.decorate(doc, toggles, decos);
        return {
          decorations: decos.length ? import_view.Decoration.set(decos, true) : import_view.Decoration.none,
          atomic: hiddenRanges.length ? import_state.RangeSet.of(hiddenRanges, true) : import_state.RangeSet.empty
        };
      }
      buildToggleDecorations(editorView) {
        return this.buildToggleDecorationsFromDoc(editorView.state.doc);
      }
      setToggleOpen(editorView, startLine, open) {
        const doc = editorView.state.doc;
        if (startLine < 0 || startLine >= doc.lines) return;
        const line = doc.line(startLine + 1);
        const parsed = parseToggleAnyOpenLine(line.text);
        if (!parsed) return;
        const meta = parsed.meta;
        meta.open = !!open;
        this.activeToggleId = meta.id;
        const pin = this.captureToggleScrollPin(editorView, line.from);
        const pinEffect = pin ? import_view.EditorView.scrollIntoView(line.from, { y: "start", yMargin: Math.max(0, pin.viewportY) }) : null;
        if (parsed.legacy) {
          editorView.dispatch({
            changes: { from: line.from, to: line.to, insert: serializeToggleOpenLine(meta) },
            effects: pinEffect ? [pinEffect] : [],
            userEvent: "input.nsb.toggle"
          });
          this.restoreToggleScrollPin(editorView, pin);
          return;
        }
        const markerFrom = line.from + Math.min(parsed.titleMarkerFrom, line.length);
        const sep = parsed.titleMarkerFrom > 0 ? " " : "";
        const changes = [{ from: markerFrom, to: line.to, insert: sep + serializeToggleOpenLine(meta) }];
        if (open) {
          const block = getToggleByStartLine(doc, startLine);
          if (block && block.inline && block.bodyStartLine > block.bodyEndLine && block.endLine >= 0 && block.endLine < doc.lines) {
            const close = doc.line(block.endLine + 1);
            changes.push({ from: close.from, to: close.from, insert: "\n" });
          }
        }
        editorView.dispatch({
          changes,
          effects: pinEffect ? [pinEffect] : [],
          userEvent: "input.nsb.toggle"
        });
        this.restoreToggleScrollPin(editorView, pin);
      }
      // VISUAL offset (px) of a document position's line top from the scroller's
      // top edge. documentTop converts CM's document-space heights to screen
      // coordinates, so content-top chrome (inline title, properties, padding)
      // cancels out — this is the number the eye sees, and the same geometry
      // scrollIntoView's yMargin aligns against. The previous doc-space capture
      // (blockTop - scrollTop) differed from this by that chrome height, so the
      // in-dispatch scroll effect first painted the title shifted UP by exactly
      // that constant and the after-measure fix snapped it back: a guaranteed
      // one-frame flash + jitter on every toggle. One coordinate convention,
      // everywhere, kills it.
      captureToggleScrollPin(editorView, pos) {
        try {
          const scroller = editorView.scrollDOM;
          const topEdge = scroller.getBoundingClientRect().top - editorView.documentTop;
          return { pos, viewportY: editorView.lineBlockAt(pos).top - topEdge };
        } catch (_) {
          return null;
        }
      }
      restoreToggleScrollPin(editorView, pin) {
        if (!pin) return;
        const scroller = editorView.scrollDOM;
        let cancelled = false;
        let settled = 0;
        const cancel = () => {
          cancelled = true;
        };
        const fix = () => {
          if (cancelled) return;
          try {
            const pos = Math.min(pin.pos, editorView.state.doc.length);
            const topEdge = scroller.getBoundingClientRect().top - editorView.documentTop;
            const delta = editorView.lineBlockAt(pos).top - topEdge - pin.viewportY;
            if (Math.abs(delta) > 1) {
              scroller.scrollTop += delta;
              settled = 0;
            } else settled++;
          } catch (_) {
          }
        };
        const win = scroller.ownerDocument && scroller.ownerDocument.defaultView || window;
        const opts = { passive: true, once: true };
        scroller.addEventListener("wheel", cancel, opts);
        scroller.addEventListener("touchmove", cancel, opts);
        let frames = 0;
        const stop = () => {
          scroller.removeEventListener("wheel", cancel);
          scroller.removeEventListener("touchmove", cancel);
        };
        const tick = () => {
          if (cancelled || settled >= 3 || ++frames > 20) {
            stop();
            return;
          }
          try {
            editorView.requestMeasure({ read: () => null, write: fix });
          } catch (_) {
            fix();
          }
          win.requestAnimationFrame(tick);
        };
        try {
          editorView.requestMeasure({ read: () => null, write: fix });
        } catch (_) {
          fix();
        }
        win.requestAnimationFrame(tick);
      }
      // NSB owns expand/collapse: native folds anchored on ANY heading row (or a
      // TL title row) are dissolved immediately, so only NSB toggles fold
      // content. Folds on other foldable rows (list items etc.) are left alone.
      // Fully inactive when the TL feature switch is off.
      clearNativeFoldsOnToggleLines(editorView) {
        if (!NSB_TL_FEATURES_ENABLED) return false;
        if (!import_language || typeof import_language.foldedRanges !== "function" || !import_language.unfoldEffect) return false;
        const state = editorView.state;
        const doc = state.doc;
        const toggles = scanToggleBlocks(doc);
        const titleLines = new Set(toggles.map((t) => t.titleLine));
        const effects = [];
        try {
          const folded = import_language.foldedRanges(state);
          folded.between(0, doc.length, (from, to) => {
            const fromLine = doc.lineAt(from);
            if (titleLines.has(fromLine.number - 1) || !isNsbExpiringOnlyMode() && /^#{1,6}\s/.test(fromLine.text || "")) {
              effects.push(import_language.unfoldEffect.of({ from, to }));
            }
          });
        } catch (_) {
          return false;
        }
        if (!effects.length) return false;
        editorView.dispatch({ effects, userEvent: "select.nsb.toggle.unfold-native" });
        return true;
      }
      // Upgrades legacy 4-line toggle blocks (own-line opener above the title) to
      // the inline v2 format (opener marker at the end of the title line). Runs
      // once per editor when a note with legacy markers is opened in Live Preview.
      migrateLegacyTogglesCM(editorView) {
        try {
          const doc = editorView.state.doc;
          const legacy = scanToggleBlocks(doc).filter((t) => !t.inline);
          if (!legacy.length) return false;
          const changes = [];
          for (const t of legacy) {
            const opener = doc.line(t.startLine + 1);
            const parsed = parseToggleAnyOpenLine(opener.text);
            if (!parsed) continue;
            if (t.titleLine > t.startLine && t.titleLine < t.endLine) {
              const title = doc.line(t.titleLine + 1);
              changes.push({ from: opener.from, to: title.from, insert: "" });
              const sep = (title.text || "").trim() === "" ? "" : " ";
              changes.push({ from: title.to, to: title.to, insert: sep + serializeToggleOpenLine(parsed.meta) });
            } else {
              changes.push({ from: opener.from, to: opener.to, insert: serializeToggleOpenLine(parsed.meta) });
            }
          }
          if (!changes.length) return false;
          editorView.dispatch({ changes, userEvent: "input.nsb.toggle.migrate" });
          return true;
        } catch (_) {
          return false;
        }
      }
      deleteToggleBlockCM(editorView, toggle, leaveBlank) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.startLine < 0 || toggle.endLine >= doc.lines) return false;
        let from = doc.line(toggle.startLine + 1).from;
        let to = doc.line(toggle.endLine + 1).to;
        let insert = leaveBlank ? "\n" : "";
        if (toggle.endLine + 1 < doc.lines) {
          to = doc.line(toggle.endLine + 2).from;
        } else if (toggle.startLine > 0) {
          from = doc.line(toggle.startLine).to;
          insert = leaveBlank ? "\n" : "";
        } else {
          insert = "";
        }
        editorView.dispatch({
          changes: { from, to, insert },
          selection: { anchor: Math.min(from + insert.length, from) },
          userEvent: "input.nsb.toggle.delete"
        });
        return true;
      }
      deleteLineRangeLeavingBlankCM(editorView, startLine, endLine) {
        const doc = editorView.state.doc;
        if (doc.lines <= 0) return false;
        const first = Math.max(0, Math.min(startLine, doc.lines - 1));
        const last = Math.max(first, Math.min(endLine, doc.lines - 1));
        let from = doc.line(first + 1).from;
        let to = doc.line(last + 1).to;
        let insert = "\n";
        if (last + 1 < doc.lines) {
          to = doc.line(last + 2).from;
        } else if (first > 0) {
          from = doc.line(first).to;
        } else {
          insert = "";
        }
        editorView.dispatch({
          changes: { from, to, insert },
          selection: { anchor: from, head: from },
          userEvent: "input.nsb.block.delete"
        });
        editorView.focus();
        return true;
      }
      getMenuDeleteRange(doc, target) {
        if (!doc || !target || typeof target.startLine !== "number") return null;
        let startLine = target.startLine;
        let endLine = typeof target.endLine === "number" ? target.endLine : startLine;
        if (startLine < 0 || startLine >= doc.lines || endLine < startLine) return null;
        endLine = Math.min(endLine, doc.lines - 1);
        const toggleRange = expandToggleRangeForLines(doc, startLine, endLine);
        if (toggleRange.startLine !== startLine || toggleRange.endLine !== endLine) return toggleRange;
        if (target.kind === "line") {
          const block = resolveBlockBoundary(doc, startLine);
          return expandToggleRangeForLines(doc, block.startLine, block.endLine);
        }
        return { startLine, endLine };
      }
      deleteTargetBlockFromMenu(editor, target) {
        const editorView = editor && editor.cm;
        if (!editorView || !editorView.state || !editorView.state.doc) return false;
        for (const provider of this.blockProviders()) if (provider.releaseTarget?.(editorView, target)) return true;
        const doc = editorView.state.doc;
        const range = this.getMenuDeleteRange(doc, target);
        if (!range) return false;
        const toggle = scanToggleBlocks(doc).find((t) => t.startLine === range.startLine && t.endLine === range.endLine);
        if (toggle) return this.unwrapToggleDeletingTitleLineCM(editorView, toggle);
        let allBlank = true;
        for (let i = range.startLine; i <= Math.min(range.endLine, doc.lines - 1); i++) {
          if (!isBlankLineText(doc.line(i + 1).text)) {
            allBlank = false;
            break;
          }
        }
        if (allBlank) return this.deleteLineRangeCompletelyCM(editorView, range.startLine, range.endLine);
        return this.deleteLineRangeLeavingBlankCM(editorView, range.startLine, range.endLine);
      }
      // Removes the given rows entirely (no blank row left behind).
      deleteLineRangeCompletelyCM(editorView, startLine, endLine) {
        const doc = editorView.state.doc;
        if (doc.lines <= 0) return false;
        const first = Math.max(0, Math.min(startLine, doc.lines - 1));
        const last = Math.max(first, Math.min(endLine, doc.lines - 1));
        let from = doc.line(first + 1).from;
        let to = doc.line(last + 1).to;
        if (last + 1 < doc.lines) {
          to = doc.line(last + 2).from;
        } else if (first > 0) {
          from = doc.line(first).to;
        }
        editorView.dispatch({
          changes: { from, to, insert: "" },
          selection: { anchor: from, head: from },
          userEvent: "input.nsb.block.delete-line"
        });
        editorView.focus();
        return true;
      }
      editorHasTextSelection(editor) {
        try {
          if (!editor || !(editor.somethingSelected && editor.somethingSelected())) return false;
          const from = editor.getCursor("from");
          const to = editor.getCursor("to");
          if (!from || !to) return false;
          return from.line !== to.line || from.ch !== to.ch;
        } catch (_) {
          return false;
        }
      }
      // Right-click menu Delete is available with a text selection OR with the
      // cursor parked on an ordinary blank row.
      canDeleteFromEditorMenu(editor) {
        if (this.editorHasTextSelection(editor)) return true;
        return this.isCursorOnDeletableBlankLine(editor);
      }
      isCursorOnDeletableBlankLine(editor) {
        try {
          const editorView = editor && editor.cm;
          if (!editorView || !editorView.state || !editorView.state.doc) return false;
          const cursor = editor.getCursor();
          if (!cursor) return false;
          const doc = editorView.state.doc;
          if (cursor.line < 0 || cursor.line >= doc.lines) return false;
          if (!isBlankLineText(doc.line(cursor.line + 1).text)) return false;
          if (isHardVacuumLine(doc, cursor.line)) return false;
          const toggles = scanToggleBlocks(doc);
          if (toggleHiddenMarkerLines(toggles).has(cursor.line)) return false;
          if (isLineHiddenByCollapsedToggle(toggles, cursor.line)) return false;
          return true;
        } catch (_) {
          return false;
        }
      }
      deleteEditorSelectionFromMenu(editor) {
        const editorView = editor && editor.cm;
        if (!this.editorHasTextSelection(editor)) {
          if (!editorView || !this.isCursorOnDeletableBlankLine(editor)) return false;
          const cursor = editor.getCursor();
          return this.deleteLineRangeCompletelyCM(editorView, cursor.line, cursor.line);
        }
        const from = editor.getCursor("from");
        const to = editor.getCursor("to");
        if (editorView && editorView.state && editorView.state.doc) {
          const doc = editorView.state.doc;
          const toggle = scanToggleBlocks(doc).find((t) => t.inline && t.titleLine === from.line && t.titleLine === to.line);
          if (toggle) {
            const titleLine = doc.line(toggle.titleLine + 1);
            const visEnd = toggleTitleVisibleEndPos(doc, toggle);
            const a = Math.min(titleLine.from + from.ch, visEnd);
            const b = a === titleLine.from && titleLine.from + to.ch >= visEnd ? toggleTitleClearEndPos(doc, toggle) : Math.min(titleLine.from + to.ch, visEnd);
            if (b > a) {
              editorView.dispatch({
                changes: { from: a, to: b, insert: "" },
                selection: { anchor: a, head: a },
                userEvent: "input.nsb.delete-selection"
              });
            }
            editorView.focus();
            return true;
          }
        }
        editor.replaceRange("", from, to);
        editor.focus();
        return true;
      }
      isPlainTextOrInternalLinkLine(text) {
        const s = (text || "").trim();
        if (s === "") return true;
        if (isToggleMarkerLineText(s)) return false;
        if (NSB_TOGGLE_INLINE_OPEN_RE.test(s)) return false;
        if (/^(```|~~~)/.test(s)) return false;
        if (/^>\s?/.test(s)) return false;
        if (/^[-*+]\s+/.test(s)) return false;
        if (/^\d+[.)]\s+/.test(s)) return false;
        if (/^\|.*\|$/.test(s)) return false;
        if (/^[-*_]{3,}\s*$/.test(s)) return false;
        if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(s)) return false;
        if (/^!?\[\[[^\]]+\]\]\s*$/.test(s)) return true;
        return true;
      }
      isPlainTextLineForTitleJoin(text) {
        const s = (text || "").trim();
        if (s === "") return false;
        if (isToggleMarkerLineText(s)) return false;
        if (NSB_TOGGLE_INLINE_OPEN_RE.test(s)) return false;
        if (/^(```|~~~)/.test(s)) return false;
        if (/^#{1,6}\s+/.test(s)) return false;
        if (/^>\s?/.test(s)) return false;
        if (/^[-*+]\s+/.test(s)) return false;
        if (/^\d+[.)]\s+/.test(s)) return false;
        if (/^\|.*\|$/.test(s)) return false;
        if (/^[-*_]{3,}\s*$/.test(s)) return false;
        if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(s)) return false;
        if (/\[\[|\]\]/.test(s)) return false;
        if (/\[[^\]]+\]\([^)]+\)/.test(s)) return false;
        return true;
      }
      isMakeToggleListAllowedForRange(doc, startLine, endLine) {
        if (!doc || startLine == null || endLine == null) return false;
        const first = Math.max(0, Math.min(startLine, doc.lines - 1));
        const last = Math.max(first, Math.min(endLine, doc.lines - 1));
        const toggles = scanToggleBlocks(doc);
        if (toggles.some(
          (t) => first <= t.startLine && last >= t.startLine || first <= t.titleLine && last >= t.titleLine || first <= t.endLine && last >= t.endLine
        )) return false;
        for (let i = first; i <= last; i++) {
          if (isVacuumLine(doc, i)) return false;
          if (!this.isPlainTextOrInternalLinkLine(doc.line(i + 1).text)) return false;
        }
        return true;
      }
      getEditorMakeToggleRange(editor) {
        const editorView = editor && editor.cm;
        if (!editorView || !editorView.state || !editorView.state.doc) return null;
        if (this.editorHasTextSelection(editor)) {
          const from = editor.getCursor("from");
          const to = editor.getCursor("to");
          let endLine = to.line;
          if (to.ch === 0 && endLine > from.line) endLine -= 1;
          return { startLine: from.line, endLine };
        }
        const cursor = editor.getCursor();
        return cursor ? { startLine: cursor.line, endLine: cursor.line } : null;
      }
      canMakeToggleListFromEditor(editor) {
        const editorView = editor && editor.cm;
        const range = this.getEditorMakeToggleRange(editor);
        return !!(editorView && range && this.isMakeToggleListAllowedForRange(editorView.state.doc, range.startLine, range.endLine));
      }
      canMakeToggleListFromTarget(editor, target) {
        const editorView = editor && editor.cm;
        if (!editorView || !target || typeof target.startLine !== "number") return false;
        const endLine = typeof target.endLine === "number" ? target.endLine : target.startLine;
        return this.isMakeToggleListAllowedForRange(editorView.state.doc, target.startLine, endLine);
      }
      makeToggleListFromEditorMenu(editor) {
        if (!this.canMakeToggleListFromEditor(editor)) return false;
        const range = this.getEditorMakeToggleRange(editor);
        const current = editor.getLine(range.startLine) || "";
        if (this.editorHasTextSelection(editor)) return this.wrapLinesInToggle(editor, range.startLine, range.endLine);
        if (current.trim() === "") return this.insertToggleList(editor);
        return this.wrapLinesInToggle(editor, range.startLine, range.endLine);
      }
      unwrapToggleBlockCM(editorView, toggle) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.startLine < 0 || toggle.endLine >= doc.lines) return false;
        const titleLine = doc.line(toggle.titleLine + 1);
        const closeLine = doc.line(toggle.endLine + 1);
        const openFrom = toggle.inline ? toggleTitleVisibleEndPos(doc, toggle) : doc.line(toggle.startLine + 1).from;
        const openTo = toggle.inline ? titleLine.to : toggle.titleLine > toggle.startLine ? titleLine.from : doc.line(toggle.startLine + 1).to;
        let closeFrom = closeLine.from;
        let closeTo = closeLine.to;
        if (toggle.endLine + 1 < doc.lines) {
          closeTo = doc.line(toggle.endLine + 2).from;
        } else if (toggle.endLine > toggle.startLine) {
          closeFrom = doc.line(toggle.endLine).to;
        }
        const changes = openTo <= closeFrom ? [
          { from: openFrom, to: openTo, insert: "" },
          { from: closeFrom, to: closeTo, insert: "" }
        ] : [
          { from: closeFrom, to: closeTo, insert: "" },
          { from: openFrom, to: openTo, insert: "" }
        ];
        editorView.dispatch({
          changes,
          selection: { anchor: toggle.inline ? titleLine.from : openFrom },
          userEvent: "input.nsb.toggle.unwrap"
        });
        return true;
      }
      unwrapToggleDeletingTitleLineCM(editorView, toggle) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.startLine < 0 || toggle.endLine >= doc.lines) return false;
        const hasBody = toggle.bodyStartLine <= toggle.bodyEndLine;
        if (!hasBody) return this.deleteToggleBlockCM(editorView, toggle, true);
        const openLine = doc.line(toggle.startLine + 1);
        const firstBody = doc.line(toggle.bodyStartLine + 1);
        const closeLine = doc.line(toggle.endLine + 1);
        const removeHead = { from: openLine.from, to: firstBody.from, insert: "" };
        let closeFrom = closeLine.from;
        let closeTo = closeLine.to;
        if (toggle.endLine + 1 < doc.lines) {
          closeTo = doc.line(toggle.endLine + 2).from;
        } else {
          closeFrom = doc.line(toggle.endLine).to;
        }
        const changes = [
          removeHead,
          { from: closeFrom, to: closeTo, insert: "" }
        ];
        editorView.dispatch({
          changes,
          selection: { anchor: openLine.from, head: openLine.from },
          userEvent: "input.nsb.toggle.unwrap-delete-title"
        });
        editorView.focus();
        return true;
      }
      clearToggleTitleCM(editorView, toggle) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.titleLine < 0 || toggle.titleLine >= doc.lines) return false;
        const title = doc.line(toggle.titleLine + 1);
        const clearEnd = toggleTitleClearEndPos(doc, toggle);
        editorView.dispatch({
          changes: { from: title.from, to: clearEnd, insert: "" },
          selection: { anchor: title.from },
          userEvent: "input.nsb.toggle.clear-title"
        });
        return true;
      }
      deleteFollowingBlankAfterToggleCM(editorView, toggle, line) {
        const doc = editorView.state.doc;
        if (!toggle || !line || line.number - 1 !== toggle.endLine + 1) return false;
        if (!isBlankLineText(line.text)) return false;
        const close = doc.line(toggle.endLine + 1);
        editorView.dispatch({
          changes: { from: close.to, to: line.to, insert: "" },
          selection: { anchor: toggleTitleVisibleEndPos(doc, toggle) },
          userEvent: "input.nsb.toggle.after-blank"
        });
        return true;
      }
      deleteBlankBeforeToggleMarkerCM(editorView, markerLineNum, line) {
        const doc = editorView.state.doc;
        if (!line || !isBlankLineText(line.text)) return false;
        if (markerLineNum < 0 || markerLineNum >= doc.lines || line.number - 1 + 1 !== markerLineNum) return false;
        const marker = doc.line(markerLineNum + 1);
        editorView.dispatch({
          changes: { from: line.from, to: marker.from, insert: "" },
          selection: { anchor: line.from },
          userEvent: "input.nsb.toggle.before-marker-blank"
        });
        return true;
      }
      lastVisibleLineInsideOpenToggle(doc, toggle) {
        if (!toggle) return null;
        for (let i = toggle.bodyEndLine; i >= toggle.bodyStartLine; i--) {
          const text = doc.line(i + 1).text;
          if (!isToggleMarkerLineText(text) && !isBlankLineText(text)) return doc.line(i + 1);
        }
        return toggle.titleLine >= 0 && toggle.titleLine < doc.lines ? doc.line(toggle.titleLine + 1) : null;
      }
      firstEditableLineInsideOpenToggle(doc, toggle) {
        if (!toggle) return null;
        const toggles = scanToggleBlocks(doc);
        for (let i = toggle.bodyStartLine; i <= toggle.bodyEndLine; i++) {
          const text = doc.line(i + 1).text;
          if (isToggleMarkerLineText(text)) continue;
          if (isLineHiddenByCollapsedToggle(toggles, i)) continue;
          return doc.line(i + 1);
        }
        return null;
      }
      deleteLineAfterToggleRange(doc, toggle, line) {
        const lineNum = line.number - 1;
        if (lineNum + 1 < doc.lines) {
          return { from: line.from, to: doc.line(lineNum + 2).from };
        }
        const close = doc.line(toggle.endLine + 1);
        return { from: close.to, to: line.to };
      }
      backspaceLineAfterToggleCM(editorView, toggle, line) {
        const doc = editorView.state.doc;
        if (!toggle || !line || line.number - 1 !== toggle.endLine + 1) return false;
        const toggles = scanToggleBlocks(doc);
        const text = line.text || "";
        const isBlank = isBlankLineText(text);
        const deleteRange = this.deleteLineAfterToggleRange(doc, toggle, line);
        if (!toggle.open) {
          const titleEnd = toggleTitleVisibleEndPos(doc, toggle);
          if (!isBlank && !this.isPlainTextLineForTitleJoin(text)) {
            editorView.dispatch({
              changes: { from: deleteRange.from, to: deleteRange.to, insert: "" },
              selection: { anchor: titleEnd, head: titleEnd },
              userEvent: "input.nsb.toggle.delete-below-title"
            });
            return true;
          }
          const changes = isBlank ? [{ from: deleteRange.from, to: deleteRange.to, insert: "" }] : [
            { from: titleEnd, to: titleEnd, insert: text },
            { from: deleteRange.from, to: deleteRange.to, insert: "" }
          ];
          const anchor = titleEnd + (isBlank ? 0 : text.length);
          editorView.dispatch({
            changes,
            selection: { anchor, head: anchor },
            userEvent: "input.nsb.toggle.join-below-title"
          });
          return true;
        }
        const targetLine = this.lastVisibleLineInsideOpenToggle(doc, toggle);
        const fallbackAnchor = targetLine ? visibleLineEndPos(doc, toggles, targetLine.number - 1) : toggleTitleVisibleEndPos(doc, toggle);
        if (isBlank) {
          editorView.dispatch({
            changes: { from: deleteRange.from, to: deleteRange.to, insert: "" },
            selection: { anchor: fallbackAnchor, head: fallbackAnchor },
            userEvent: "input.nsb.toggle.join-below-body"
          });
          return true;
        }
        const insertPos = fallbackAnchor;
        editorView.dispatch({
          changes: [
            { from: insertPos, to: insertPos, insert: text },
            { from: deleteRange.from, to: deleteRange.to, insert: "" }
          ],
          selection: { anchor: insertPos + text.length, head: insertPos + text.length },
          userEvent: "input.nsb.toggle.join-below-body"
        });
        return true;
      }
      insertSiblingToggleAfterCM(editorView, toggle, userEvent, newTitleText, deleteTitleFrom) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.endLine < 0 || toggle.endLine >= doc.lines) return false;
        if (toggle.meta?.expiry?.v === 1 && !newTitleText && deleteTitleFrom == null) {
          const close2 = doc.line(toggle.endLine + 1);
          const hasNext = toggle.endLine + 1 < doc.lines;
          const from = hasNext ? doc.line(toggle.endLine + 2).from : close2.to;
          editorView.dispatch({
            changes: { from, insert: "\n" },
            selection: { anchor: hasNext ? from : from + 1 },
            userEvent: "input.nsb.expiring.exit"
          });
          editorView.focus();
          return true;
        }
        const id = makeToggleId();
        const opener = serializeToggleOpenLine({ id, open: false });
        const titleText = String(newTitleText || "");
        const titleLineText = titleText ? titleText + " " + opener : opener;
        const close = doc.line(toggle.endLine + 1);
        const hasLineAfterClose = toggle.endLine + 1 < doc.lines;
        const insertPos = hasLineAfterClose ? doc.line(toggle.endLine + 2).from : close.to;
        const insertText = hasLineAfterClose ? titleLineText + "\n" + NSB_TOGGLE_CLOSE_LINE + "\n" : "\n" + titleLineText + "\n" + NSB_TOGGLE_CLOSE_LINE;
        const changes = [];
        if (typeof deleteTitleFrom === "number") {
          const titleEnd = toggleTitleVisibleEndPos(doc, toggle);
          if (deleteTitleFrom < titleEnd) changes.push({ from: deleteTitleFrom, to: titleEnd, insert: "" });
        }
        changes.push({ from: insertPos, to: insertPos, insert: insertText });
        editorView.dispatch({
          changes,
          userEvent: userEvent || "input.nsb.toggle.new"
        });
        editorView.focus();
        requestAnimationFrame(() => {
          try {
            const created = scanToggleBlocks(editorView.state.doc).find((t) => t.id === id);
            if (!created || created.titleLine < 0 || created.titleLine >= editorView.state.doc.lines) return;
            const title = editorView.state.doc.line(created.titleLine + 1);
            editorView.dispatch({
              selection: { anchor: title.from, head: title.from },
              userEvent: "select.nsb.toggle.new-title"
            });
          } catch (_) {
          }
        });
        return true;
      }
      enterOpenToggleBodyCM(editorView, toggle) {
        const doc = editorView.state.doc;
        if (!toggle || !toggle.open || toggle.endLine < 0 || toggle.endLine >= doc.lines) return false;
        const firstBody = this.firstEditableLineInsideOpenToggle(doc, toggle);
        if (firstBody && isBlankLineText(firstBody.text)) {
          editorView.dispatch({
            selection: { anchor: firstBody.from, head: firstBody.from },
            userEvent: "select.nsb.toggle.body"
          });
          editorView.focus();
          return true;
        }
        if (firstBody) {
          editorView.dispatch({
            changes: { from: firstBody.from, to: firstBody.from, insert: "\n" },
            selection: { anchor: firstBody.from, head: firstBody.from },
            userEvent: "input.nsb.toggle.body-line"
          });
          editorView.focus();
          return true;
        }
        const close = doc.line(toggle.endLine + 1);
        editorView.dispatch({
          changes: { from: close.from, to: close.from, insert: "\n" },
          selection: { anchor: close.from, head: close.from },
          userEvent: "input.nsb.toggle.body-line"
        });
        editorView.focus();
        return true;
      }
      // Replaces an empty TL block with a single plain blank row and parks the
      // cursor on it (Enter-cancel of a never-filled toggle).
      cancelEmptyToggleToBlankLineCM(editorView, toggle) {
        const doc = editorView.state.doc;
        if (!toggle || toggle.startLine < 0 || toggle.endLine >= doc.lines) return false;
        let from = doc.line(toggle.startLine + 1).from;
        let to = doc.line(toggle.endLine + 1).to;
        let insert = "\n";
        let anchor = from;
        if (toggle.endLine + 1 < doc.lines) {
          to = doc.line(toggle.endLine + 2).from;
        } else if (toggle.startLine > 0) {
          from = doc.line(toggle.startLine).to;
          anchor = from + 1;
        } else {
          insert = "";
          anchor = 0;
        }
        editorView.dispatch({
          changes: { from, to, insert },
          selection: { anchor, head: anchor },
          userEvent: "input.nsb.toggle.cancel-empty"
        });
        editorView.focus();
        return true;
      }
      // Joins a line's text into the visible title of an open inline toggle,
      // keeping the end-of-line marker intact (used by Backspace at the start of
      // the first body line, where a native join would land after the marker).
      joinLineIntoTitleCM(editorView, toggle, line) {
        const doc = editorView.state.doc;
        const titleLine = doc.line(toggle.titleLine + 1);
        const markerFrom = toggleTitleVisibleEndPos(doc, toggle);
        const markerText = doc.sliceString(markerFrom, titleLine.to);
        const text = line.text || "";
        editorView.dispatch({
          changes: { from: markerFrom, to: line.to, insert: text + markerText },
          selection: { anchor: markerFrom, head: markerFrom },
          userEvent: "input.nsb.toggle.join-into-title"
        });
        editorView.focus();
        return true;
      }
      preventToggleBoundaryDelete(editorView, event, toggles, line, sel) {
        const doc = editorView.state.doc;
        const lineNum = line.number - 1;
        if (event.key === "Backspace" && sel.from === line.from && lineNum > 0) {
          const prevClose = toggles.find((t) => t.endLine === lineNum - 1) || null;
          if (prevClose) {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            return this.backspaceLineAfterToggleCM(editorView, prevClose, line);
          }
          const prevTitle = toggles.find((t) => t.inline && t.titleLine === lineNum - 1) || null;
          if (prevTitle) {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            const lineIsToggleLine = toggles.some((t) => t.titleLine === lineNum || t.startLine === lineNum || t.endLine === lineNum);
            if (lineIsToggleLine || !prevTitle.open) {
              const anchor = toggleTitleVisibleEndPos(doc, prevTitle);
              editorView.dispatch({ selection: { anchor }, userEvent: "select.nsb.toggle.boundary" });
              return true;
            }
            return this.joinLineIntoTitleCM(editorView, prevTitle, line);
          }
          const prevLegacyOpener = toggles.find((t) => !t.inline && t.startLine === lineNum - 1) || null;
          if (prevLegacyOpener) {
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            const anchor = toggleTitleVisibleEndPos(doc, prevLegacyOpener);
            editorView.dispatch({ selection: { anchor }, userEvent: "select.nsb.toggle.boundary" });
            return true;
          }
          return false;
        }
        if (event.key === "Delete" && sel.from === line.to && lineNum + 1 < doc.lines) {
          const nextToggle = toggles.find((t) => t.endLine === lineNum + 1 || !t.inline && t.startLine === lineNum + 1) || null;
          if (!nextToggle) return false;
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          if (isBlankLineText(line.text) && nextToggle.endLine === lineNum + 1) {
            return this.deleteBlankBeforeToggleMarkerCM(editorView, lineNum + 1, line);
          }
          return true;
        }
        return false;
      }
      handleToggleEnter(editorView, event) {
        const state = editorView.state;
        const sel = state.selection.main;
        if (!sel.empty) return false;
        const doc = state.doc;
        const line = doc.lineAt(sel.from);
        const lineNum = line.number - 1;
        const toggles = scanToggleBlocks(doc);
        const titleToggle = toggles.find((t) => t.titleLine === lineNum);
        if (titleToggle && !titleToggle.open && titleToggle.meta?.expiry?.v === 1 && sel.from >= toggleTitleVisibleEndPos(doc, titleToggle)) {
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return this.insertSiblingToggleAfterCM(editorView, titleToggle);
        }
        if (titleToggle && !titleToggle.open && titleToggle.inline && toggleIsEmpty(doc, titleToggle)) {
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return this.cancelEmptyToggleToBlankLineCM(editorView, titleToggle);
        }
        const adjacentPreviousCollapsed = titleToggle && sel.from === line.from ? toggles.find((t) => !t.open && t.endLine + 1 === titleToggle.startLine) : null;
        const collapsedMappedToggle = toggles.find((t) => !t.open && lineNum > t.titleLine && lineNum <= t.endLine);
        if (adjacentPreviousCollapsed) {
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return this.insertSiblingToggleAfterCM(editorView, adjacentPreviousCollapsed, "input.nsb.toggle.new-between-adjacent");
        }
        if (!titleToggle) {
          if (!collapsedMappedToggle) return false;
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return this.insertSiblingToggleAfterCM(editorView, collapsedMappedToggle, "input.nsb.toggle.new-after-hidden");
        }
        const toggle = titleToggle;
        const visibleTitle = toggleVisibleTitleText(doc, toggle);
        const visLen = visibleTitle.length;
        const cursorCh = Math.max(0, Math.min(visLen, sel.from - line.from));
        const restText = visibleTitle.slice(cursorCh);
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        if (toggle.open) {
          if (restText.trim() === "") return this.enterOpenToggleBodyCM(editorView, toggle);
          if (!toggle.inline) return this.enterOpenToggleBodyCM(editorView, toggle);
          const markerFrom = toggleTitleVisibleEndPos(doc, toggle);
          const cursorAbs = line.from + cursorCh;
          editorView.dispatch({
            changes: [
              { from: cursorAbs, to: markerFrom, insert: "" },
              { from: line.to, to: line.to, insert: "\n" + restText }
            ],
            selection: { anchor: cursorAbs + (line.to - markerFrom) + 1 },
            userEvent: "input.nsb.toggle.split-title-to-body"
          });
          editorView.focus();
          return true;
        }
        const deleteFrom = cursorCh < visLen ? line.from + cursorCh : null;
        return this.insertSiblingToggleAfterCM(editorView, toggle, "input.nsb.toggle.new", restText, deleteFrom);
      }
      // Vertical cursor motion around collapsed TLs. CodeMirror's default
      // moveVertically can stall on rows that end in a folded marker region:
      // the cursor first detours to the visible title end (or does not move at
      // all) and only the second keypress reaches the neighbouring row. When the
      // default motion produces no visual row change, jump straight to the next
      // (previous) visible document line at the same visible column.
      handleToggleArrowNav(editorView, event) {
        const state = editorView.state;
        const sel = state.selection.main;
        if (!sel.empty) return false;
        const doc = state.doc;
        const toggles = scanToggleBlocks(doc);
        if (!toggles.length) return false;
        const forward = event.key === "ArrowDown";
        const line = doc.lineAt(sel.head);
        const lineNum = line.number - 1;
        let moved = false;
        try {
          const def = editorView.moveVertically(sel, forward);
          const curC = editorView.coordsAtPos(sel.head);
          const newC = editorView.coordsAtPos(def.head);
          if (curC && newC && Math.abs(newC.top - curC.top) > 2) moved = true;
        } catch (_) {
          moved = false;
        }
        if (moved) return false;
        const hiddenMarkers = toggleHiddenMarkerLines(toggles);
        const isHiddenLine = (n) => hiddenMarkers.has(n) || isLineHiddenByCollapsedToggle(toggles, n);
        let target;
        if (forward) {
          const curCollapsed = toggles.find((t) => t.titleLine === lineNum && !t.open);
          target = curCollapsed ? curCollapsed.endLine + 1 : lineNum + 1;
          while (target < doc.lines && isHiddenLine(target)) target++;
          if (target >= doc.lines) return false;
        } else {
          target = lineNum - 1;
          while (target >= 0 && isHiddenLine(target)) target--;
          if (target < 0) return false;
        }
        const targetLine = doc.line(target + 1);
        const curVisEnd = visibleLineEndPos(doc, toggles, lineNum);
        const col = Math.max(0, Math.min(sel.head, curVisEnd) - line.from);
        const anchor = Math.min(targetLine.from + col, visibleLineEndPos(doc, toggles, target));
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        editorView.dispatch({
          selection: { anchor, head: anchor },
          scrollIntoView: true,
          userEvent: "select.nsb.toggle.vertical"
        });
        return true;
      }
      // Backspace / Delete / ArrowLeft at a list marker edge (Live Preview). Runs
      // after the TL handlers; true when the key was consumed.
      handleListMarkerKey(editorView, event) {
        if (!NSB_LIST_MARKER_FEATURES_ENABLED || event.defaultPrevented) return false;
        const state = editorView.state;
        const sel = state.selection.main;
        if (!sel.empty || state.selection.ranges.length > 1) return false;
        let spec = null;
        if (event.key === "Backspace") spec = listMarkerBackspaceSpec(state, sel.head);
        else if (event.key === "Delete") spec = listMarkerDeleteSpec(state, sel.head);
        else if (event.key === "ArrowLeft") spec = listMarkerLeftSpec(state, sel.head);
        if (!spec) return false;
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        editorView.dispatch(spec);
        return true;
      }
      handleToggleDelete(editorView, event) {
        const state = editorView.state;
        const sel = state.selection.main;
        const doc = state.doc;
        const toggles = scanToggleBlocks(doc);
        if (!sel.empty) {
          const fromLine = doc.lineAt(sel.from);
          const toLine = doc.lineAt(sel.to);
          const selectedToggle = toggles.find((t) => {
            const title = doc.line(t.titleLine + 1);
            const visEnd2 = toggleTitleVisibleEndPos(doc, t);
            return sel.from <= title.from && sel.to >= visEnd2 && fromLine.number - 1 <= t.titleLine && toLine.number - 1 >= t.titleLine;
          });
          const touchesMarker = toggles.some((t) => {
            const title = doc.line(t.titleLine + 1);
            const close = doc.line(t.endLine + 1);
            const markerFrom = t.inline ? toggleTitleVisibleEndPos(doc, t) : doc.line(t.startLine + 1).from;
            const markerTo = t.inline ? title.to : doc.line(t.startLine + 1).to;
            return sel.from < markerTo && sel.to > markerFrom || sel.from < close.to && sel.to > close.from;
          });
          if (!selectedToggle) {
            if (!touchesMarker) return false;
            event.preventDefault();
            event.stopPropagation();
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
            return true;
          }
          const titleText2 = toggleVisibleTitleText(doc, selectedToggle);
          const hasBody2 = toggleHasBodyContent(doc, selectedToggle);
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          if (titleText2.trim() === "") {
            if (hasBody2) return this.unwrapToggleDeletingTitleLineCM(editorView, selectedToggle);
            return this.deleteToggleBlockCM(editorView, selectedToggle, true);
          }
          return this.clearToggleTitleCM(editorView, selectedToggle);
        }
        const line = doc.lineAt(sel.from);
        const lineNum = line.number - 1;
        const toggle = toggles.find((t) => t.titleLine === lineNum);
        if (!toggle) return this.preventToggleBoundaryDelete(editorView, event, toggles, line, sel);
        const visEnd = toggleTitleVisibleEndPos(doc, toggle);
        const selPos = sel.from > visEnd ? visEnd : sel.from;
        const titleText = toggleVisibleTitleText(doc, toggle);
        const titleEmpty = titleText.trim() === "";
        const hasBody = toggleHasBodyContent(doc, toggle);
        if (!titleEmpty) {
          if (!(event.key === "Backspace" && selPos === line.from || event.key === "Delete" && selPos === visEnd)) return false;
          event.preventDefault();
          event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return this.unwrapToggleBlockCM(editorView, toggle);
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        if (hasBody) return this.unwrapToggleDeletingTitleLineCM(editorView, toggle);
        return this.cancelEmptyToggleToBlankLineCM(editorView, toggle);
      }
      insertToggleList(editor, options) {
        const opts = options || {};
        const id = makeToggleId();
        const closeLine = NSB_TOGGLE_CLOSE_LINE;
        const hasSelection = editor.somethingSelected && editor.somethingSelected();
        if (hasSelection) {
          const from = editor.getCursor("from");
          const to = editor.getCursor("to");
          let endLine = to.line;
          if (to.ch === 0 && endLine > from.line) endLine -= 1;
          return this.wrapLinesInToggle(editor, from.line, endLine);
        }
        const cursor = editor.getCursor();
        const current = editor.getLine(cursor.line) || "";
        let insertLine = typeof opts.insertLine === "number" ? opts.insertLine : current.trim() === "" ? cursor.line : cursor.line + 1;
        const snippet = serializeToggleOpenLine({ id, open: false }) + "\n" + closeLine;
        if (current.trim() === "" && insertLine === cursor.line && typeof opts.insertLine !== "number") {
          editor.replaceRange(snippet, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: current.length });
          editor.setCursor({ line: cursor.line, ch: 0 });
          editor.focus();
          return;
        }
        if (insertLine >= editor.lineCount()) {
          const last = Math.max(0, editor.lineCount() - 1);
          const ch = (editor.getLine(last) || "").length;
          const prefix = last === 0 && ch === 0 ? "" : "\n";
          editor.replaceRange(prefix + snippet, { line: last, ch });
          editor.setCursor({ line: last + (prefix ? 1 : 0), ch: 0 });
        } else {
          editor.replaceRange(snippet + "\n", { line: insertLine, ch: 0 });
          editor.setCursor({ line: insertLine, ch: 0 });
        }
        editor.focus();
      }
      wrapLinesInToggle(editor, startLine, endLine) {
        if (startLine == null || endLine == null) return false;
        if (editor.cm && editor.cm.state && editor.cm.state.doc) {
          const doc = editor.cm.state.doc;
          const toggles = scanToggleBlocks(doc);
          if (toggles.some((t) => startLine === t.startLine || startLine === t.titleLine || startLine === t.endLine)) {
            new import_obsidian.Notice(paipaT("This row is already a toggle list"));
            editor.focus();
            return true;
          }
        }
        const first = Math.max(0, Math.min(startLine, editor.lineCount() - 1));
        const last = Math.max(first, Math.min(endLine, editor.lineCount() - 1));
        const id = makeToggleId();
        const title = editor.getLine(first) || "";
        let hasBody = false;
        for (let i = first + 1; i <= last; i++) {
          if ((editor.getLine(i) || "").trim() !== "") {
            hasBody = true;
            break;
          }
        }
        const sep = title.trim() === "" ? "" : " ";
        const openerText = sep + serializeToggleOpenLine({ id, open: hasBody });
        const closeText = "\n" + NSB_TOGGLE_CLOSE_LINE;
        if (editor.cm && editor.cm.state && editor.cm.state.doc) {
          const doc = editor.cm.state.doc;
          const titleTo = doc.line(first + 1).to;
          const changes = first === last ? [{ from: titleTo, to: titleTo, insert: openerText + closeText }] : [
            { from: titleTo, to: titleTo, insert: openerText },
            { from: doc.line(last + 1).to, to: doc.line(last + 1).to, insert: closeText }
          ];
          editor.cm.dispatch({
            changes,
            selection: { anchor: titleTo, head: titleTo },
            userEvent: "input.nsb.toggle.wrap"
          });
        } else {
          editor.replaceRange(openerText, { line: first, ch: title.length });
          editor.replaceRange(closeText, { line: last, ch: (editor.getLine(last) || "").length });
          editor.setCursor({ line: first, ch: title.length });
        }
        editor.focus();
        return true;
      }
      insertToggleListAfterTarget(editor, target) {
        if (target && editor.cm && editor.cm.state && editor.cm.state.doc) {
          if (!this.canMakeToggleListFromTarget(editor, target)) return false;
          const range = expandToggleRangeForLines(editor.cm.state.doc, target.startLine, target.endLine);
          if (this.wrapLinesInToggle(editor, range.startLine, range.endLine)) return;
        }
        return this.insertToggleList(editor);
      }
      // Line span a handle-drag should carry when the grabbed block belongs to
      // the current multi-line editor selection. Returns null when the drag is a
      // plain single-block drag: no selection, a single-line selection, a grab
      // outside the selection, or a selection that equals the grabbed block.
      // The raw selection span is widened to whole logical blocks (fences,
      // callouts) and any partially-covered TL pulls in its complete block so
      // hidden markers can never be split by a move.
      getSelectionDragSpan(state, grabStart, grabEnd) {
        if (!state || !state.selection || !state.doc) return null;
        const doc = state.doc;
        let lo = Infinity, hi = -1;
        for (const r of state.selection.ranges || []) {
          if (!r || r.empty) continue;
          const fromLine = doc.lineAt(r.from);
          const toLine = doc.lineAt(r.to);
          let s = fromLine.number - 1;
          let e = toLine.number - 1;
          if (e > s && r.to === toLine.from) e--;
          lo = Math.min(lo, s);
          hi = Math.max(hi, e);
        }
        if (hi < 0 || lo >= hi) return null;
        if (grabEnd < lo || grabStart > hi) return null;
        lo = Math.min(lo, resolveBlockBoundary(doc, lo).startLine);
        hi = Math.max(hi, resolveBlockBoundary(doc, hi).endLine);
        const toggles = scanToggleBlocks(doc);
        let changed = true;
        while (changed) {
          changed = false;
          for (const t of toggles) {
            const touchesMarker = t.startLine >= lo && t.startLine <= hi || t.titleLine >= lo && t.titleLine <= hi || t.endLine >= lo && t.endLine <= hi;
            if (!touchesMarker) continue;
            if (t.startLine < lo || t.endLine > hi) {
              lo = Math.min(lo, t.startLine);
              hi = Math.max(hi, t.endLine);
              changed = true;
            }
          }
        }
        return { startLine: lo, endLine: hi };
      }
      // How a drag gesture ends. A move is delete+insert, so CM's own mapping
      // always loses the dragged rows: the deletion collapses the selection into
      // the gap it leaves and the freshly inserted text belongs to no selection.
      //   • drag that began from a selection → re-select the block where it
      //     landed, so the same rows stay highlighted and can be dragged again;
      //   • plain single-block drag → bare cursor on the block's first line.
      restoreSelectionAfterDrag(editorView, startLine, endLine, keepSelection) {
        if (!keepSelection) {
          this.collapseSelectionAfterDrag(editorView, startLine);
          return;
        }
        try {
          const doc = editorView.state.doc;
          const first = doc.line(clampNumber(startLine + 1, 1, doc.lines));
          const lastNum0 = clampNumber(endLine, startLine, doc.lines - 1);
          const head = visibleLineEndPos(doc, scanToggleBlocks(doc), lastNum0);
          editorView.dispatch({
            selection: { anchor: first.from, head: Math.max(first.from, head) },
            userEvent: "select.nsb.drag-end"
          });
          editorView.focus();
        } catch (_) {
          this.collapseSelectionAfterDrag(editorView, startLine);
        }
      }
      // Ends a plain (non-selection) drag with a bare cursor on the dropped
      // block's first line. The native DOM selection is cleared too: its
      // highlight can outlive the CM selection while the view is unfocused.
      collapseSelectionAfterDrag(editorView, lineNum0) {
        try {
          const doc = editorView.state.doc;
          const line = doc.line(clampNumber(lineNum0 + 1, 1, doc.lines));
          editorView.dispatch({
            selection: { anchor: line.from, head: line.from },
            userEvent: "select.nsb.drag-end"
          });
        } catch (_) {
        }
        try {
          if (!editorView.hasFocus) {
            const sel = window.getSelection && window.getSelection();
            if (sel && sel.rangeCount && !sel.isCollapsed && editorView.dom.contains(sel.anchorNode)) sel.removeAllRanges();
          }
        } catch (_) {
        }
      }
      beginEditDrag(e, target, editorView, overlay) {
        if (!NSB_BLOCK_FEATURES_ENABLED) return;
        if (target && target.noHandle) return;
        this.cancelEditDrag?.();
        this.isDragging = true;
        overlay.hideAll();
        const doc = editorView.state.doc;
        let { startLine, endLine } = target;
        if (target.kind === "line") {
          const exp = resolveBlockBoundary(doc, startLine);
          startLine = exp.startLine;
          endLine = exp.endLine;
        }
        const selSpan = this.getSelectionDragSpan(editorView.state, startLine, endLine);
        if (selSpan) {
          startLine = selSpan.startLine;
          endLine = selSpan.endLine;
        }
        const keepSelection = !!selSpan;
        const allUnits = this.collectDraggableUnits(editorView);
        let labelText = getBlockDragLabel(doc, startLine, target.el);
        if (selSpan) {
          const unitCount = allUnits.filter((u) => u.startLine >= startLine && u.endLine <= endLine).length;
          if (unitCount > 1) labelText += " \xD7" + unitCount;
        }
        const ghost = document.createElement("div");
        ghost.className = "nsb-ghost";
        ghost.textContent = labelText;
        document.body.appendChild(ghost);
        const indicator = document.createElement("div");
        indicator.className = "nsb-drop-indicator";
        indicator.style.display = "none";
        const scroller = editorView.scrollDOM;
        scroller.appendChild(indicator);
        let lastMoveEvent = e;
        const dragRect = target.el.getBoundingClientRect();
        const ox = clampNumber(e.clientX - dragRect.left, 0, Math.max(0, dragRect.width));
        const oy = clampNumber(e.clientY - dragRect.top, 0, Math.max(0, dragRect.height));
        let targetInsertLine = -1;
        const dragToggles = scanToggleBlocks(doc);
        const draggedIsSingleBlankLine = startLine === endLine && isBlankLineText(doc.line(startLine + 1).text);
        let toggleDropEl = null;
        let toggleDropTarget = null;
        const clearToggleDropTarget = () => {
          if (toggleDropEl) toggleDropEl.classList.remove("nsb-toggle-drop-target");
          toggleDropEl = null;
          toggleDropTarget = null;
        };
        const setDropIndicator = (refEl, indicatorClientY, insertLine) => {
          const scrollerRect = scroller.getBoundingClientRect();
          const refR = refEl.getBoundingClientRect();
          const depth = getToggleInsertDepth(dragToggles, insertLine);
          const iTop = indicatorClientY - scrollerRect.top + scroller.scrollTop;
          indicator.style.display = "block";
          indicator.style.top = iTop - 1 + "px";
          indicator.style.left = refR.left - scrollerRect.left + "px";
          indicator.style.width = refR.width + "px";
          indicator.textContent = "";
          if (depth <= 0) {
            indicator.classList.remove("is-segmented");
            return;
          }
          indicator.classList.add("is-segmented");
          const shortLen = Math.max(10, (this.settings.toggleIconSize || 16) + 2);
          const gap = 6;
          let left = 0;
          for (let i = 0; i < depth; i++) {
            const s = document.createElement("span");
            s.className = "nsb-drop-segment";
            s.style.left = left + "px";
            s.style.width = shortLen + "px";
            indicator.appendChild(s);
            left += shortLen + gap;
          }
          const long = document.createElement("span");
          long.className = "nsb-drop-segment";
          long.style.left = left + "px";
          long.style.width = "max(0px, calc(100% - " + left + "px))";
          indicator.appendChild(long);
        };
        const dropAllowed = (line) => this.blockProviders().every((provider) => typeof provider.nsbAllowDrop !== "function" || provider.nsbAllowDrop(editorView, startLine, endLine, line, target) !== false);
        const findToggleTitleDrop = (me) => {
          for (const t of dragToggles) {
            if (!(t.endLine < startLine || t.startLine > endLine)) continue;
            if (draggedIsSingleBlankLine) continue;
            if (t.open && toggleHasBodyContent(doc, t)) continue;
            if (!dropAllowed(t.endLine)) continue;
            const line = domLineForNum(editorView, scroller, t.titleLine);
            if (!line) continue;
            const r = line.getBoundingClientRect();
            const edge = Math.max(4, (r.bottom - r.top) * 0.28);
            if (me.clientX >= r.left - HANDLE_W && me.clientX <= r.right && me.clientY >= r.top + edge && me.clientY <= r.bottom - edge) {
              return { toggle: t, el: line };
            }
          }
          return null;
        };
        const move = (me) => {
          if (me.isTrusted && me.buttons === 0) {
            this.cancelEditDrag?.();
            return;
          }
          lastMoveEvent = me;
          ghost.style.left = me.clientX - ox + "px";
          ghost.style.top = me.clientY - oy + "px";
          clearToggleDropTarget();
          if (this.blockProviders().some((provider) => provider.nsbDragHover?.(editorView, startLine, endLine, me, target))) {
            indicator.style.display = "none";
            targetInsertLine = -1;
            return;
          }
          indicator.classList.remove("is-segmented");
          indicator.textContent = "";
          const titleDropTarget = findToggleTitleDrop(me);
          if (titleDropTarget) {
            targetInsertLine = titleDropTarget.toggle.endLine;
            toggleDropTarget = titleDropTarget.toggle;
            toggleDropEl = titleDropTarget.el;
            toggleDropEl.classList.add("nsb-toggle-drop-target");
            indicator.style.display = "none";
            return;
          }
          const others = allUnits.filter((u) => u.endLine < startLine || u.startLine > endLine);
          if (!others.length) {
            indicator.style.display = "none";
            return;
          }
          const scrollerRect = scroller.getBoundingClientRect();
          {
            const slots = [];
            for (let i = 0; i <= others.length; i++) {
              if (i === 0) {
                const r0 = others[0].el.getBoundingClientRect();
                slots.push({ triggerY: r0.top, indicatorY: r0.top, insertLine: others[0].startLine, refEl: others[0].el, noOp: false });
              } else if (i === others.length) {
                const rL = others[others.length - 1].el.getBoundingClientRect();
                slots.push({ triggerY: rL.bottom, indicatorY: rL.bottom, insertLine: others[others.length - 1].endLine + 1, refEl: others[others.length - 1].el, noOp: false });
              } else {
                const rA = others[i - 1].el.getBoundingClientRect();
                const rB = others[i].el.getBoundingClientRect();
                const isOriginalGap = others[i - 1].endLine < startLine && others[i].startLine > endLine;
                if (isOriginalGap) {
                  slots.push({
                    triggerY: rA.bottom,
                    indicatorY: rA.top,
                    insertLine: others[i - 1].startLine,
                    refEl: others[i - 1].el,
                    noOp: false
                  });
                  slots.push({
                    triggerY: (rA.bottom + rB.top) / 2,
                    indicatorY: rB.top,
                    insertLine: startLine,
                    refEl: others[i].el,
                    noOp: true
                  });
                } else {
                  slots.push({
                    triggerY: (rA.bottom + rB.top) / 2,
                    indicatorY: rB.top,
                    insertLine: others[i].startLine,
                    refEl: others[i].el,
                    noOp: false
                  });
                }
              }
            }
            const legal = slots.filter((s) => s.noOp || dropAllowed(s.insertLine));
            if (!legal.length) {
              indicator.style.display = "none";
              targetInsertLine = -1;
              return;
            }
            let best2 = legal[0], bestDist2 = Math.abs(legal[0].triggerY - me.clientY);
            for (let i = 1; i < legal.length; i++) {
              const d = Math.abs(legal[i].triggerY - me.clientY);
              if (d < bestDist2) {
                bestDist2 = d;
                best2 = legal[i];
              }
            }
            if (best2.noOp) {
              indicator.style.display = "none";
              targetInsertLine = startLine;
              return;
            }
            const refEl = best2.refEl || others[0].el;
            targetInsertLine = normalizeInsertLineForVacuum(doc, best2.insertLine);
            setDropIndicator(refEl, best2.indicatorY, targetInsertLine);
            return;
          }
          const nBefore = others.filter((u) => u.endLine < startLine).length;
          const origTop = dragRect.top;
          const origBottom = dragRect.bottom;
          const origMid = (origTop + origBottom) / 2;
          const gaps = [];
          for (let i = 0; i <= others.length; i++) {
            if (i === nBefore) {
              const slotTop = nBefore > 0 ? others[nBefore - 1].el.getBoundingClientRect().bottom : -Infinity;
              const upperY = nBefore > 0 ? (slotTop + origTop) / 2 : origTop - 1;
              gaps.push({ clientY: upperY, insertIdx: i, noOp: false });
              gaps.push({ clientY: origMid, insertIdx: i, noOp: true });
            } else if (i < others.length) {
              if (i === 0) {
                gaps.push({ clientY: others[0].el.getBoundingClientRect().top, insertIdx: 0, noOp: false });
              } else {
                const rA = others[i - 1].el.getBoundingClientRect();
                const rB = others[i].el.getBoundingClientRect();
                gaps.push({ clientY: (rA.bottom + rB.top) / 2, insertIdx: i, noOp: false });
              }
            } else {
              gaps.push({ clientY: others[others.length - 1].el.getBoundingClientRect().bottom, insertIdx: others.length, noOp: false });
            }
          }
          let best = gaps[0], bestDist = Math.abs(gaps[0].clientY - me.clientY);
          for (let i = 1; i < gaps.length; i++) {
            const d = Math.abs(gaps[i].clientY - me.clientY);
            if (d < bestDist) {
              bestDist = d;
              best = gaps[i];
            }
          }
          if (best.noOp) {
            indicator.style.display = "none";
            targetInsertLine = startLine;
            return;
          }
          let iClientY, iLeft, iWidth, candidateLine;
          if (best.insertIdx === nBefore && nBefore > 0) {
            const uAbove = others[nBefore - 1], urAbove = uAbove.el.getBoundingClientRect();
            candidateLine = startLine;
            iClientY = origTop;
            iLeft = urAbove.left - scrollerRect.left;
            iWidth = urAbove.width;
          } else if (best.insertIdx < others.length) {
            const u = others[best.insertIdx], ur = u.el.getBoundingClientRect();
            candidateLine = u.startLine;
            iClientY = ur.top;
            iLeft = ur.left - scrollerRect.left;
            iWidth = ur.width;
          } else {
            const u = others[others.length - 1], ur = u.el.getBoundingClientRect();
            candidateLine = u.endLine + 1;
            iClientY = ur.bottom;
            iLeft = ur.left - scrollerRect.left;
            iWidth = ur.width;
          }
          targetInsertLine = candidateLine;
          const iTop = iClientY - scrollerRect.top + scroller.scrollTop;
          indicator.style.display = "block";
          indicator.style.top = iTop - 1 + "px";
          indicator.style.left = iLeft + "px";
          indicator.style.width = iWidth + "px";
        };
        move(e);
        const onDragScroll = () => {
          if (lastMoveEvent) move(lastMoveEvent);
        };
        scroller.addEventListener("scroll", onDragScroll, { passive: true });
        let finished = false;
        const cleanup = () => {
          if (finished) return;
          finished = true;
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up, true);
          document.removeEventListener("keydown", cancelKey, true);
          document.removeEventListener("dragstart", preventNative, true);
          document.removeEventListener("pointercancel", cancel, true);
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("blur", cancel);
          ghost.remove();
          indicator.remove();
          scroller.removeEventListener("scroll", onDragScroll);
          this.isDragging = false;
          overlay.clearPinnedAfterDrag();
          if (this.cancelEditDrag === cancel) this.cancelEditDrag = null;
        };
        const cancel = () => {
          cleanup();
          clearToggleDropTarget();
          for (const provider of this.blockProviders()) provider.clearDrop?.();
        };
        const cancelKey = (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
        };
        const preventNative = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        const onVisibility = () => {
          if (document.visibilityState === "hidden") cancel();
        };
        const up = () => {
          if (finished) return;
          const dropToggle = toggleDropTarget;
          cleanup();
          clearToggleDropTarget();
          if (editorView.state.doc !== doc) {
            for (const provider of this.blockProviders()) provider.clearDrop?.();
            return;
          }
          if (this.blockProviders().some((provider) => provider.finishNsbDrop?.(editorView, startLine, endLine, doc))) return;
          const blockSize = endLine - startLine + 1;
          if (targetInsertLine >= 0 && !(targetInsertLine >= startLine && targetInsertLine <= endLine + 1)) {
            const saved = scroller.scrollTop;
            const intoToggleStart = dropToggle ? this.moveBlockIntoToggleCM(editorView, startLine, endLine, dropToggle) : null;
            const newStart = intoToggleStart !== null ? intoToggleStart : this.moveBlockCM(editorView, startLine, endLine, targetInsertLine);
            requestAnimationFrame(() => {
              scroller.scrollTop = saved;
              const landed = newStart === null ? startLine : newStart;
              this.restoreSelectionAfterDrag(editorView, landed, landed + blockSize - 1, keepSelection);
            });
          } else {
            this.restoreSelectionAfterDrag(editorView, startLine, endLine, keepSelection);
          }
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up, true);
        document.addEventListener("keydown", cancelKey, true);
        document.addEventListener("dragstart", preventNative, true);
        document.addEventListener("pointercancel", cancel, true);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("blur", cancel);
        this.cancelEditDrag = cancel;
      }
      // collectDraggableUnits: uses the same proportional-Y probe as _resolveEmbedRange
      // so that embed startLine/endLine values are guaranteed consistent between the
      // two call sites (avoids off-by-one that caused bookmark moves to go wrong).
      // Web Bookmark embeds are handled first with scanWbFences/matchFenceToEmbed
      // because posAtCoords inside those widgets is not reliable.
      //
      // v2.9.4: wb-managed embeds are no longer skipped here. They are INCLUDED as
      // units so that when the user drags another block past a bookmark, the
      // bookmark serves as a valid slot target (correct indicator position above
      // and below it). Hover/click is still blocked for wb-managed embeds elsewhere,
      // so they remain non-draggable from NSB's side as long as wb plugin manages
      // them. When wb plugin's drag is OFF (no data-wb-drag-managed attribute),
      // isWbManaged returns false and the embed is fully draggable by NSB.
      collectDraggableUnits(editorView) {
        const units = [], doc = editorView.state.doc, seen = /* @__PURE__ */ new Set();
        for (const provider of this.blockProviders()) for (const unit of provider.nsbUnits(editorView) || []) {
          units.push(unit);
          for (let i = unit.startLine; i <= unit.endLine; i++) seen.add(i);
        }
        const wbFences = scanWbFences(doc);
        const quoteRanges = scanQuoteBlocks(doc);
        const embedRanges = scanInternalEmbedLines(doc);
        const toggles = scanToggleBlocks(doc);
        const toggleTitleByLine = /* @__PURE__ */ new Map();
        const toggleMarkerLines = toggleHiddenMarkerLines(toggles);
        for (const t of toggles) {
          toggleTitleByLine.set(t.titleLine, t);
        }
        for (const visual of Array.from(editorView.scrollDOM.querySelectorAll(".wb-container"))) {
          const root = getWbBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const wbRange = resolveWbEmbedRange(visual, editorView, wbFences);
          if (!wbRange) continue;
          if (isRangeHiddenByCollapsedToggle(toggles, wbRange.startLine, wbRange.endLine)) continue;
          if (seen.has(wbRange.startLine)) continue;
          for (let i = wbRange.startLine; i <= wbRange.endLine; i++) seen.add(i);
          units.push({ el: visual, startLine: wbRange.startLine, endLine: wbRange.endLine });
        }
        for (const visual of Array.from(editorView.scrollDOM.querySelectorAll(".callout"))) {
          const root = getEmbedBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const quoteRange = matchRangesToElement(quoteRanges, root, editorView, 80) || matchRangesToElement(quoteRanges, visual, editorView, 80);
          if (!quoteRange) continue;
          if (isRangeHiddenByCollapsedToggle(toggles, quoteRange.startLine, quoteRange.endLine)) continue;
          if (seen.has(quoteRange.startLine)) continue;
          for (let i = quoteRange.startLine; i <= quoteRange.endLine; i++) seen.add(i);
          units.push({ el: visual, startLine: quoteRange.startLine, endLine: quoteRange.endLine });
        }
        for (const visual of Array.from(editorView.scrollDOM.querySelectorAll(BUILTIN_EMBED_SELECTOR))) {
          if (isWbBookmarkEmbed(visual)) continue;
          const root = getEmbedBlockRoot(visual);
          if (!root || isTableElement(root)) continue;
          const embedRange = resolveBuiltinEmbedRange(visual, editorView, embedRanges);
          if (!embedRange) continue;
          if (isRangeHiddenByCollapsedToggle(toggles, embedRange.startLine, embedRange.endLine)) continue;
          if (seen.has(embedRange.startLine)) continue;
          for (let i = embedRange.startLine; i <= embedRange.endLine; i++) seen.add(i);
          units.push({ el: visual, startLine: embedRange.startLine, endLine: embedRange.endLine });
        }
        for (const embed of Array.from(editorView.scrollDOM.querySelectorAll(".cm-embed-block"))) {
          if (isTableElement(embed) || isWbBookmarkEmbed(embed)) continue;
          const r = embed.getBoundingClientRect();
          const h = r.bottom - r.top;
          const probeYs = [
            r.top + 2,
            r.top + Math.max(4, h * 0.15),
            r.top + Math.max(8, h * 0.35),
            r.top + Math.max(12, h * 0.55),
            r.top + Math.max(16, h * 0.75)
          ];
          let bounds = null;
          for (const py of probeYs) {
            try {
              const pos = editorView.posAtCoords({ x: r.left + 4, y: py }, false);
              if (pos == null) continue;
              const lineNum = doc.lineAt(pos).number - 1;
              const b = resolveBlockBoundary(doc, lineNum);
              if (b.startLine < b.endLine) {
                bounds = b;
                break;
              }
              if (!bounds) bounds = b;
            } catch (_) {
            }
          }
          if (!bounds) continue;
          if (isRangeHiddenByCollapsedToggle(toggles, bounds.startLine, bounds.endLine)) continue;
          if (seen.has(bounds.startLine)) continue;
          for (let i = bounds.startLine; i <= bounds.endLine; i++) seen.add(i);
          units.push({ el: embed, startLine: bounds.startLine, endLine: bounds.endLine });
        }
        for (const line of Array.from(editorView.scrollDOM.querySelectorAll(".cm-line"))) {
          if (isOutlinerManaged(line) || isTableElement(line)) continue;
          try {
            const pos = editorView.posAtDOM(line, 0);
            const ln = doc.lineAt(pos).number - 1;
            if (seen.has(ln)) continue;
            if (isVacuumLine(doc, ln)) continue;
            if (toggleMarkerLines.has(ln) || isLineHiddenByCollapsedToggle(toggles, ln)) continue;
            const toggle = toggleTitleByLine.get(ln);
            if (toggle) {
              const unitEnd = toggle.open ? toggle.titleLine : toggle.endLine;
              if (seen.has(toggle.startLine)) continue;
              for (let i = toggle.startLine; i <= unitEnd; i++) seen.add(i);
              units.push({ el: line, startLine: toggle.startLine, endLine: unitEnd, toggleEndLine: toggle.endLine });
              continue;
            }
            const bounds = resolveBlockBoundary(doc, ln);
            if (isRangeHiddenByCollapsedToggle(toggles, bounds.startLine, bounds.endLine)) continue;
            if (seen.has(bounds.startLine)) continue;
            for (let i = bounds.startLine; i <= bounds.endLine; i++) seen.add(i);
            const el = domLineForNum(editorView, editorView.scrollDOM, bounds.startLine) || line;
            units.push({ el, startLine: bounds.startLine, endLine: bounds.endLine });
          } catch (_) {
          }
        }
        units.sort((a, b) => a.startLine - b.startLine);
        return units;
      }
      // CM6 atomic line-range move. Replaces the v2.9.3 moveEditorLines which
      // worked by stitching the entire document text back together and feeding
      // it to editor.replaceRange — that approach mis-diffed widget decorations
      // at the block boundary on bookmark moves (visual lag, surrounding lines
      // appeared to shift while the widget itself stayed put). Identical
      // technique to Web Bookmark v1.3.4's _moveBlock, generalized for NSB.
      // Returns the line the moved block starts on afterwards, or null when the
      // move did not happen. Callers need that line to re-select (or place the
      // cursor on) the block once it has landed — a move is delete+insert, so
      // nothing of the original selection survives the transaction.
      moveBlockIntoToggleCM(editorView, fromStart, fromEnd, toggle) {
        const doc = editorView.state.doc;
        const total = doc.lines;
        if (!toggle || fromStart < 0 || fromEnd >= total || toggle.endLine < 0 || toggle.endLine >= total) return null;
        if (toggle.endLine >= fromStart && toggle.endLine <= fromEnd + 1) return null;
        const blockTextStart = doc.line(fromStart + 1).from;
        const blockTextEnd = doc.line(fromEnd + 1).to;
        const rawBlockText = doc.sliceString(blockTextStart, blockTextEnd);
        let delFrom, delTo;
        if (fromEnd + 1 < total) {
          delFrom = blockTextStart;
          delTo = doc.line(fromEnd + 2).from;
        } else if (fromStart > 0) {
          delFrom = doc.line(fromStart).to;
          delTo = blockTextEnd;
        } else {
          return null;
        }
        const insertPos = doc.line(toggle.endLine + 1).from;
        if (insertPos > delFrom && insertPos < delTo) return null;
        const blockText = renumberOrderedListBlockText(doc, rawBlockText, toggle.endLine);
        const insertText = blockText + "\n";
        const changes = insertPos < delFrom ? [
          { from: insertPos, to: insertPos, insert: insertText },
          { from: delFrom, to: delTo, insert: "" }
        ] : [
          { from: delFrom, to: delTo, insert: "" },
          { from: insertPos, to: insertPos, insert: insertText }
        ];
        editorView.dispatch({ changes, userEvent: "input.nsb.move.into-toggle" });
        const blockSize = fromEnd - fromStart + 1;
        return insertPos < delFrom ? toggle.endLine : toggle.endLine - blockSize;
      }
      // Returns the line the moved block starts on afterwards, or null for a
      // no-op (see moveBlockIntoToggleCM for why callers need it).
      moveBlockCM(editorView, fromStart, fromEnd, to) {
        const doc = editorView.state.doc;
        const total = doc.lines;
        to = this.normalizeCollapsedToggleInsertLine(doc, to);
        if (to >= fromStart && to <= fromEnd + 1) return null;
        if (fromStart < 0 || fromEnd >= total || to < 0 || to > total) return null;
        const blockTextStart = doc.line(fromStart + 1).from;
        const blockTextEnd = doc.line(fromEnd + 1).to;
        let blockText = doc.sliceString(blockTextStart, blockTextEnd);
        if (getToggleInsertDepth(scanToggleBlocks(doc), to) > 0) {
          blockText = renumberOrderedListBlockText(doc, blockText, to);
        }
        const blockEndsQuote = isQuoteLineText(doc.line(fromEnd + 1).text);
        const prevText = to > 0 ? doc.line(to).text : "";
        const nextText = to < total ? doc.line(to + 1).text : "";
        const needsBlankBefore = to > 0 && isQuoteLineText(prevText) && !isBlankLineText(prevText);
        const needsBlankAfter = to < total && blockEndsQuote && !isBlankLineText(nextText);
        let delFrom, delTo;
        if (fromEnd + 1 < total) {
          delFrom = blockTextStart;
          delTo = doc.line(fromEnd + 2).from;
        } else if (fromStart > 0) {
          delFrom = doc.line(fromStart).to;
          delTo = blockTextEnd;
        } else {
          return null;
        }
        let insertPos, insertText;
        if (to >= total) {
          insertPos = doc.length;
          insertText = (needsBlankBefore ? "\n\n" : "\n") + blockText;
        } else {
          insertPos = doc.line(to + 1).from;
          insertText = (needsBlankBefore ? "\n" : "") + blockText + (needsBlankAfter ? "\n\n" : "\n");
        }
        if (insertPos > delFrom && insertPos < delTo) return null;
        const changes = insertPos < delFrom ? [
          { from: insertPos, to: insertPos, insert: insertText },
          { from: delFrom, to: delTo, insert: "" }
        ] : [
          { from: delFrom, to: delTo, insert: "" },
          { from: insertPos, to: insertPos, insert: insertText }
        ];
        editorView.dispatch({ changes, userEvent: "input.nsb.move" });
        const blockSize = fromEnd - fromStart + 1;
        const blankOffset = needsBlankBefore ? 1 : 0;
        if (to >= total) return total - blockSize + blankOffset;
        return (to > fromEnd ? to - blockSize : to) + blankOffset;
      }
      getLogicalTargetRange(doc, target) {
        if (!doc || !target || typeof target.startLine !== "number") return null;
        let startLine = target.startLine;
        let endLine = typeof target.endLine === "number" ? target.endLine : target.startLine;
        if (target.kind === "line") {
          const exp = resolveBlockBoundary(doc, startLine);
          startLine = exp.startLine;
          endLine = exp.endLine;
        }
        if (startLine < 0 || endLine < startLine || endLine >= doc.lines) return null;
        return { startLine, endLine };
      }
      insertBlankLineAtBoundaryCM(editorView, insertLine, userEvent) {
        if (!editorView || !editorView.state || !editorView.state.doc) return false;
        const doc = editorView.state.doc;
        const lineNum = Math.max(0, Math.min(insertLine, doc.lines));
        const atDocumentEnd = lineNum >= doc.lines;
        const insertPos = atDocumentEnd ? doc.length : doc.line(lineNum + 1).from;
        const selectionAnchor = atDocumentEnd ? insertPos + 1 : insertPos;
        editorView.dispatch({
          changes: { from: insertPos, to: insertPos, insert: "\n" },
          selection: { anchor: selectionAnchor, head: selectionAnchor },
          userEvent: userEvent || "input.nsb.insert-blank-line"
        });
        editorView.focus();
        return true;
      }
      insertBlankLineAroundTargetCM(editorView, target, dir) {
        if (!editorView || !target) return false;
        const doc = editorView.state.doc;
        const range = this.getLogicalTargetRange(doc, target);
        if (!range) return false;
        const insertLine = dir === "above" ? range.startLine : range.endLine + 1;
        return this.insertBlankLineAtBoundaryCM(editorView, insertLine, "input.nsb.insert-blank-line-" + (dir || "below"));
      }
      normalizeCollapsedToggleInsertLine(doc, insertLine) {
        if (!doc || insertLine == null) return insertLine;
        let line = Math.max(0, Math.min(insertLine, doc.lines));
        const toggles = scanToggleBlocks(doc);
        for (const t of toggles) {
          if (!t.open && line > t.titleLine && line <= t.endLine) line = t.endLine + 1;
        }
        return line;
      }
      insertBlankLineAfterTargetCM(editorView, target) {
        if (!editorView || !target) return false;
        return this.insertBlankLineAroundTargetCM(editorView, target, "below");
      }
      getLocalizedDeleteLabel() {
        const langs = [];
        try {
          if (navigator && Array.isArray(navigator.languages)) langs.push(...navigator.languages);
          if (navigator && navigator.language) langs.push(navigator.language);
        } catch (_) {
        }
        try {
          if (window && window.moment && typeof window.moment.locale === "function") langs.push(window.moment.locale());
        } catch (_) {
        }
        return langs.some((lang) => /^zh\b|^zh[-_]/i.test(String(lang || ""))) ? "\u5220\u9664" : "Delete";
      }
      showBlockMenu(e, block, view, mode, target) {
        const editor = view.editor, isEdit = mode === "edit";
        const canMakeToggle = isEdit && this.canMakeToggleListFromTarget(editor, target);
        this.closeOpenContextMenus();
        block.classList.add("nsb-selected");
        setTimeout(() => block.classList.remove("nsb-selected"), 1200);
        const menu = new import_obsidian.Menu();
        this.activeContextMenu = menu;
        menu.addItem((i) => i.setTitle(paipaT("Duplicate")).setIcon("copy-plus").setDisabled(!isEdit).onClick(() => {
          if (isEdit) this.duplicate(block, editor, target);
        }));
        menu.addItem((i) => i.setTitle(paipaT("Paste")).setIcon("clipboard").setDisabled(!isEdit).onClick(() => {
          if (isEdit) {
            this.selectInEditor(block, editor, target);
            document.execCommand("paste");
          }
        }));
        menu.addItem((i) => i.setTitle(paipaT("Cut")).setIcon("scissors").setDisabled(!isEdit).onClick(() => {
          if (isEdit) {
            this.selectInEditor(block, editor, target);
            document.execCommand("cut");
          }
        }));
        menu.addItem((i) => i.setTitle(paipaT("Delete")).setIcon("trash").setDisabled(!isEdit).onClick(() => {
          if (isEdit) this.deleteTargetBlockFromMenu(editor, target);
        }));
        menu.addSeparator();
        menu.addItem((i) => i.setTitle(paipaT("Insert line above")).setIcon("arrow-up").setDisabled(!isEdit).onClick(() => {
          if (isEdit) this.insertLine(block, editor, "above", target);
        }));
        menu.addItem((i) => i.setTitle(paipaT("Insert line below")).setIcon("arrow-down").setDisabled(!isEdit).onClick(() => {
          if (isEdit) this.insertLine(block, editor, "below", target);
        }));
        if (this.settings.tlFeaturesEnabled !== false) {
          menu.addSeparator();
          menu.addItem((i) => i.setTitle(paipaT("Toggle list")).setIcon("list-plus").setDisabled(!canMakeToggle).onClick(() => {
            if (canMakeToggle) this.insertToggleListAfterTarget(editor, target);
          }));
        }
        if (isEdit) for (const provider of this.blockProviders()) provider.addBlockMenu?.(menu, editor, target);
        const iconEl = e.target && e.target.closest ? e.target.closest(".nsb-handle") : null;
        if (!iconEl) {
          menu.showAtMouseEvent(e);
          return;
        }
        const iconRect = iconEl.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight;
        const EST_W = 185, EST_H = 220;
        const MARGIN = 8;
        const leftX = iconRect.left - EST_W - MARGIN;
        const topY = iconRect.top;
        const fitsLeft = leftX >= MARGIN;
        const fitsAbove = topY + EST_H <= vh - MARGIN;
        if (fitsLeft && fitsAbove) {
          menu.showAtPosition({ x: leftX, y: topY });
          requestAnimationFrame(() => {
            const dom = document.querySelector(".menu");
            if (!dom) return;
            const actual = dom.getBoundingClientRect();
            const adjX = iconRect.left - actual.width - MARGIN;
            if (adjX >= MARGIN) dom.style.left = adjX + "px";
          });
          return;
        }
        const belowY = iconRect.bottom + MARGIN;
        const fitsBelow = belowY + EST_H <= vh - MARGIN;
        if (fitsBelow) {
          menu.showAtPosition({ x: Math.max(MARGIN, iconRect.left - EST_W), y: belowY });
          return;
        }
        menu.showAtMouseEvent(e);
      }
      lineInfo(block, editor, target) {
        if (target && typeof target.startLine === "number" && target.startLine >= 0 && target.startLine < editor.lineCount()) {
          let line = target.startLine;
          if (editor.cm && editor.cm.state && editor.cm.state.doc) {
            const toggle = getToggleHeaderForLine(editor.cm.state.doc, target.startLine);
            if (toggle) {
              return { line: toggle.titleLine, text: toggleVisibleTitleText(editor.cm.state.doc, toggle) };
            }
          }
          const text = editor.getLine(line) || "";
          return { line, text };
        }
        const raw = (block.textContent || "").trim();
        if (!raw) return null;
        const key = raw.substring(0, 25);
        for (let i = 0; i < editor.lineCount(); i++) {
          const lt = editor.getLine(i);
          if (lt.includes(key) || lt.replace(/^[#>\-*\d.\s`]+/, "").trim().startsWith(key.substring(0, 12)))
            return { line: i, text: lt };
        }
        return null;
      }
      selectInEditor(block, editor, target) {
        const info = this.lineInfo(block, editor, target);
        if (!info) return;
        editor.setSelection({ line: info.line, ch: 0 }, { line: info.line, ch: info.text.length });
      }
      duplicate(block, editor, target) {
        const info = this.lineInfo(block, editor, target);
        if (!info) return;
        if (editor.cm && editor.cm.state && editor.cm.state.doc) {
          const toggle = getToggleHeaderForLine(editor.cm.state.doc, info.line);
          if (toggle) {
            const closeLen = (editor.getLine(toggle.endLine) || "").length;
            editor.replaceRange("\n" + info.text, { line: toggle.endLine, ch: closeLen });
            new import_obsidian.Notice(paipaT("Duplicated below"));
            return;
          }
        }
        editor.replaceRange("\n" + info.text, { line: info.line, ch: (editor.getLine(info.line) || "").length });
        new import_obsidian.Notice(paipaT("Duplicated below"));
      }
      insertLine(block, editor, dir, target) {
        if (editor && editor.cm && this.insertBlankLineAroundTargetCM(editor.cm, target, dir)) return;
        const info = this.lineInfo(block, editor, target);
        if (!info) return;
        if (dir === "above") {
          editor.replaceRange("\n", { line: info.line, ch: 0 });
          editor.setCursor({ line: info.line, ch: 0 });
        } else {
          editor.replaceRange("\n", { line: info.line, ch: info.text.length });
          editor.setCursor({ line: info.line + 1, ch: 0 });
        }
        editor.focus();
      }
      // Mobile: tapping an internal link inside a table cell places the cursor
      // into the link text (starts editing) instead of following the link the
      // way a desktop click does. Intercept the tap at capture, resolve the
      // link, and navigate. Taps on non-link cell content keep editing, and an
      // unresolvable link falls through to normal editing (never create a
      // wrongly named note from a mis-parsed alias).
      handleMobileTableLinkTap(editorView, e) {
        if (!this.settings || this.settings.mobileTableLinkNav === false) return false;
        const t = e.target;
        if (!t || !t.closest) return false;
        if (!t.closest(".cm-table-widget, table")) return false;
        let linktext = null;
        const a = t.closest("a.internal-link");
        if (a) linktext = a.getAttribute("data-href") || a.getAttribute("href");
        if (!linktext) {
          const span = t.closest(".cm-hmd-internal-link");
          if (span) linktext = (span.textContent || "").trim();
        }
        if (!linktext) return false;
        linktext = linktext.replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0].trim();
        if (!linktext) return false;
        let sourcePath = "";
        try {
          const info = editorView.state.field(import_obsidian.editorInfoField, false);
          sourcePath = info && info.file && info.file.path || "";
        } catch (_) {
        }
        let dest = null;
        try {
          dest = this.app.metadataCache.getFirstLinkpathDest(linktext.split("#")[0], sourcePath);
        } catch (_) {
        }
        if (!dest) return false;
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        this.app.workspace.openLinkText(linktext, sourcePath, false);
        return true;
      }
      // ── Scroll-position memory ──────────────────────────────────────────────
      // Continuously remembers, per file, which line sits at the top of the
      // editor viewport. When a file seen earlier this session is reopened
      // (e.g. following a link, then navigating back), the position is restored
      // AFTER NSB's fold decorations have collapsed the TLs: Obsidian's own
      // ephemeral restore runs before the decorations arrive, so on long notes
      // full of collapsed TLs the shrinking doc height clamped the view to the
      // bottom of the page.
      recordScrollPosition(editorView) {
        if (this.settings && this.settings.restoreScrollOnReopen === false) return;
        try {
          const infoField = import_obsidian.editorInfoField;
          if (!infoField || !this.scrollMemory) return;
          const info = editorView.state.field(infoField, false);
          if (!info || !(info instanceof import_obsidian.MarkdownView)) return;
          const file = info.file;
          if (!file || !file.path) return;
          if (this._scrollRestoreSuppress && this._scrollRestoreSuppress.has(file.path)) return;
          const scroller = editorView.scrollDOM;
          const topEdge = scroller.getBoundingClientRect().top - editorView.documentTop;
          const block = editorView.lineBlockAtHeight(topEdge);
          this.scrollMemory.set(file.path, {
            line: editorView.state.doc.lineAt(block.from).number - 1,
            offset: topEdge - block.top
          });
        } catch (_) {
        }
      }
      restoreScrollPositionOnOpen(file) {
        if (!file || !file.path || !this.scrollMemory) return;
        if (this.settings && this.settings.restoreScrollOnReopen === false) return;
        const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        if (!view || !view.file || view.file.path !== file.path) return;
        const editorView = view.editor && view.editor.cm;
        if (!editorView) return;
        if (!this._viewLastFile) this._viewLastFile = /* @__PURE__ */ new WeakMap();
        const prevPath = this._viewLastFile.get(view);
        this._viewLastFile.set(view, file.path);
        if (prevPath === file.path) return;
        const scroller = editorView.scrollDOM;
        const win = scroller.ownerDocument && scroller.ownerDocument.defaultView || window;
        const saved = this.scrollMemory.get(file.path);
        if (!saved) {
          win.setTimeout(() => {
            try {
              if (view.file && view.file.path === file.path) this.recordScrollPosition(editorView);
            } catch (_) {
            }
          }, 400);
          return;
        }
        this._scrollRestoreSuppress.add(file.path);
        const release = () => this._scrollRestoreSuppress.delete(file.path);
        win.setTimeout(release, 900);
        const startedAt = Date.now();
        let cancelled = false;
        const cancel = () => {
          cancelled = true;
        };
        const apply = () => {
          if (cancelled) return;
          if (Date.now() - startedAt > 1500) return;
          try {
            if (!view.file || view.file.path !== file.path) return;
            const doc = editorView.state.doc;
            const line = doc.line(Math.min(saved.line, doc.lines - 1) + 1);
            const cur = scroller.getBoundingClientRect().top - editorView.documentTop;
            const want = editorView.lineBlockAt(line.from).top + saved.offset;
            scroller.scrollTop += want - cur;
          } catch (_) {
          }
        };
        const raf = win.requestAnimationFrame ? win.requestAnimationFrame.bind(win) : requestAnimationFrame;
        raf(() => raf(() => {
          apply();
          const winDoc = scroller.ownerDocument || document;
          const opts = { passive: true, once: true };
          scroller.addEventListener("wheel", cancel, opts);
          scroller.addEventListener("touchmove", cancel, opts);
          winDoc.addEventListener("keydown", cancel, opts);
          win.setTimeout(() => {
            apply();
            scroller.removeEventListener("wheel", cancel);
            scroller.removeEventListener("touchmove", cancel);
            winDoc.removeEventListener("keydown", cancel);
            release();
          }, 300);
        }));
      }
      async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        paipaSetLang(this.settings.language);
      }
      async saveSettings() {
        paipaSetLang(this.settings.language);
        await this.saveData(this.settings);
        setNsbTlFeaturesEnabled(this.settings.tlFeaturesEnabled);
        setNsbBlockFeaturesEnabled(this.settings.blockFeaturesEnabled);
        setNsbCtxMenuFeaturesEnabled(this.settings.contextMenuFeaturesEnabled);
        setNsbListMarkerFeaturesEnabled(this.settings.listMarkerFeaturesEnabled);
        this._applyCSSVars();
        this._applyBlockSpacingStyle();
        this._applyFoldStyle();
        this.refreshToggleDecorations();
        this.refreshBlockFeatures();
      }
      // Live-applies the "Notion blocks" master switch to every open editor.
      // The CM ViewPlugin is not rebuilt on settings changes, so this is done
      // imperatively: OFF destroys each view's handle overlay (listeners + DOM
      // nodes) and releases the reserved left gutter; ON re-creates the overlay
      // and re-runs the gutter check. overlayMap holds the NsbEditorViewPlugin
      // instances (nothing else reads it).
      refreshBlockFeatures() {
        try {
          for (const pv of this.overlayMap.values()) {
            if (!pv || typeof pv.scheduleGutterCheck !== "function") continue;
            if (!NSB_BLOCK_FEATURES_ENABLED) {
              if (pv.overlay) {
                try {
                  pv.overlay.destroy();
                } catch (_) {
                }
              }
              pv.overlay = null;
              try {
                pv.scroller.style.paddingLeft = "";
              } catch (_) {
              }
              pv.appliedGutterPad = 0;
            } else if (!pv.overlay && !pv.mobileViewOnly) {
              try {
                pv.overlay = new EditOverlay(this, pv.view, pv.cmEl);
                pv.scheduleGutterCheck();
              } catch (_) {
              }
            }
          }
        } catch (_) {
        }
      }
      // Forces every open editor to rebuild NSB decorations (used when the TL
      // feature switch flips so markers show/hide without reopening notes).
      refreshToggleDecorations() {
        try {
          this.app.workspace.iterateAllLeaves((leaf) => {
            const view = leaf.view;
            if (!(view instanceof import_obsidian.MarkdownView)) return;
            const cm = view.editor && view.editor.cm;
            if (!cm || !this.setLivePreviewModeEffect) return;
            try {
              cm.dispatch({ effects: this.setLivePreviewModeEffect.of(isLivePreviewEditorView(cm)) });
            } catch (_) {
            }
          });
        } catch (_) {
        }
      }
    };
    var SettingsTab = class extends import_obsidian.PluginSettingTab {
      constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
      }
      display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: paipaT("Editor Enhancer") });
        new import_obsidian.Setting(containerEl).setName(paipaT("Language")).setDesc(paipaT("Follow Obsidian's language, or choose one for this plugin.")).addDropdown((d) => d.addOption("auto", paipaT("Follow Obsidian")).addOption("en", "English").addOption("zh", "中文").setValue(["auto", "en", "zh"].includes(this.plugin.settings.language) ? this.plugin.settings.language : "auto").onChange(async (v) => {
          this.plugin.settings.language = v;
          paipaSetLang(v);
          await this.plugin.saveSettings();
          this.display();
        }));
        containerEl.createEl("h3", { text: paipaT("Feature modules (all on by default, each can be turned off separately)") });
        new import_obsidian.Setting(containerEl).setName(paipaT("Notion blocks")).setDesc(paipaT("Six-dot drag handles, block menu, plus button to insert lines, multi-select drag and block spacing. When off, native block interaction returns; other modules are unaffected.")).addToggle((t) => t.setValue(this.plugin.settings.blockFeaturesEnabled !== false).onChange(async (v) => {
          this.plugin.settings.blockFeaturesEnabled = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Toggle lists")).setDesc(paipaT("Notion-style collapsible lists and related changes to native behavior (heading folds taken over, protected lines, etc.). When off, toggle markers show as plain text; turning it back on restores them.")).addToggle((t) => t.setValue(this.plugin.settings.tlFeaturesEnabled !== false).onChange(async (v) => {
          this.plugin.settings.tlFeaturesEnabled = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("List markers as a unit")).setDesc(paipaT("In Live Preview, the bullet / number / checkbox in front of a list line acts as one unit: the cursor never stops inside it, one Backspace removes the whole marker (a nested item first moves up one level), Delete at the end of a line joins the next item, and ← from the start of the text goes straight to the end of the previous line. When off, Obsidian's native character-by-character deletion returns.")).addToggle((t) => t.setValue(this.plugin.settings.listMarkerFeaturesEnabled !== false).onChange(async (v) => {
          this.plugin.settings.listMarkerFeaturesEnabled = v;
          setNsbListMarkerFeaturesEnabled(v);
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Context menu enhancements")).setDesc(paipaT("Tidies the right-click menu (this plugin's items are grouped in their own section and replace the native delete item) and enables \"Don't select line on right-click\". When off, the right-click menu fully returns to Obsidian's native behavior.")).addToggle((t) => t.setValue(this.plugin.settings.contextMenuFeaturesEnabled !== false).onChange(async (v) => {
          this.plugin.settings.contextMenuFeaturesEnabled = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Table link navigation (mobile)")).setDesc(paipaT("On mobile, tapping an internal link in a table opens it directly (as on desktop); tapping anywhere else still starts editing, and links that can't be resolved fall back to editing.")).addToggle((t) => t.setValue(this.plugin.settings.mobileTableLinkNav !== false).onChange(async (v) => {
          this.plugin.settings.mobileTableLinkNav = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Restore scroll position when returning to a page")).setDesc(paipaT("When you reopen a page viewed earlier in this session (for example, going back after following a link), the scroll position you left it at is restored; long pages no longer land at the bottom.")).addToggle((t) => t.setValue(this.plugin.settings.restoreScrollOnReopen !== false).onChange(async (v) => {
          this.plugin.settings.restoreScrollOnReopen = v;
          await this.plugin.saveSettings();
        }));
        containerEl.createEl("h3", { text: paipaT("Details") });
        new import_obsidian.Setting(containerEl).setName(paipaT("Don't select line on right-click")).setDesc(paipaT("Right-click only opens the menu without selecting the whole line first; an existing selection is kept. Requires \"Context menu enhancements\".")).addToggle((t) => t.setValue(this.plugin.settings.suppressRightClickLineSelection !== false).onChange(async (v) => {
          this.plugin.settings.suppressRightClickLineSelection = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Enable block spacing")).setDesc(paipaT("Add Notion-style extra spacing between content blocks. Requires \"Notion blocks\".")).addToggle((t) => t.setValue(this.plugin.settings.blockSpacingEnabled).onChange(async (v) => {
          this.plugin.settings.blockSpacingEnabled = v;
          await this.plugin.saveSettings();
          this.display();
        }));
        // Developer-mode settings are no longer shown here (the stored
        // developerMode value is left as is); the controls below are kept,
        // unreachable, for reference.
        containerEl.createEl("p", { text: "Editor Enhancer | Author: paipa | v" + this.plugin.manifest.version, cls: "setting-item-description" });
        return;
        containerEl.createEl("h3", { text: paipaT("Drag handle") });
        new import_obsidian.Setting(containerEl).setName(paipaT("Handle opacity")).setDesc(paipaT("Opacity before hover (0.1 – 1.0).")).addSlider((s) => s.setLimits(0.1, 1, 0.05).setValue(this.plugin.settings.handleOpacity).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.handleOpacity = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Handle distance from content")).setDesc(paipaT("Gap between the handle and the left edge of the content (0 – 40 px).")).addSlider((s) => s.setLimits(0, 40, 1).setValue(this.plugin.settings.handleOffset).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.handleOffset = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Handle padding")).setDesc(paipaT("Distance from the dot grid to the handle's border (1 – 16 px).")).addSlider((s) => s.setLimits(1, 16, 0.5).setValue(this.plugin.settings.handleSize).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.handleSize = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Dot diameter")).setDesc(paipaT("1.5 – 8 px.")).addSlider((s) => s.setLimits(1.5, 8, 0.5).setValue(this.plugin.settings.dotSize).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.dotSize = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Dot spacing")).setDesc(paipaT("1 – 6 px.")).addSlider((s) => s.setLimits(1, 6, 0.5).setValue(this.plugin.settings.dotGap).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.dotGap = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Dot gray level")).setDesc(paipaT("0 = white, 100 = black.")).addSlider((s) => s.setLimits(0, 100, 1).setValue(this.plugin.settings.dotGray).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.dotGray = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Toggle triangle size")).setDesc(paipaT("10 – 28 px.")).addSlider((s) => s.setLimits(10, 28, 1).setValue(this.plugin.settings.toggleIconSize || 16).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.toggleIconSize = v;
          await this.plugin.saveSettings();
        }));
        containerEl.createEl("h3", { text: paipaT("Drop indicator line") });
        new import_obsidian.Setting(containerEl).setName(paipaT("Line thickness")).setDesc(paipaT("1 – 8 px.")).addSlider((s) => s.setLimits(1, 8, 0.5).setValue(this.plugin.settings.lineHeight).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.lineHeight = v;
          await this.plugin.saveSettings();
        }));
        new import_obsidian.Setting(containerEl).setName(paipaT("Line opacity")).setDesc(paipaT("0.1 – 1.0.")).addSlider((s) => s.setLimits(0.1, 1, 0.05).setValue(this.plugin.settings.lineOpacity).setDynamicTooltip().onChange(async (v) => {
          this.plugin.settings.lineOpacity = v;
          await this.plugin.saveSettings();
        }));
        if (this.plugin.settings.blockSpacingEnabled) {
          containerEl.createEl("h3", { text: paipaT("Notion-style spacing") });
          new import_obsidian.Setting(containerEl).setName(paipaT("Block spacing")).setDesc(paipaT("Spacing between adjacent content blocks (2 – 32 px).")).addSlider((s) => s.setLimits(2, 32, 1).setValue(this.plugin.settings.blockSpacingPx).setDynamicTooltip().onChange(async (v) => {
            this.plugin.settings.blockSpacingPx = v;
            await this.plugin.saveSettings();
          }));
          new import_obsidian.Setting(containerEl).setName(paipaT("Line spacing within a block")).setDesc(paipaT("Extra spacing between lines of text within one block (0 = theme default, up to 20 px).")).addSlider((s) => s.setLimits(0, 20, 1).setValue(this.plugin.settings.lineSpacingPx).setDynamicTooltip().onChange(async (v) => {
            this.plugin.settings.lineSpacingPx = v;
            await this.plugin.saveSettings();
          }));
        }
        containerEl.createEl("p", { text: "Editor Enhancer | Author: paipa | v" + this.plugin.manifest.version, cls: "setting-item-description" });
      }
    };
  }
});

// plugin.js
var { Plugin, PluginSettingTab, Setting, Notice, MarkdownView, setIcon } = require("obsidian");
var { EditorState, EditorSelection, Transaction, Prec } = require("@codemirror/state");
var { Decoration, WidgetType, ViewPlugin } = require("@codemirror/view");
var core = require_core();
var ToggleEngine = require_toggle_engine().default;
var TWO_HOURS = 2 * 60 * 60 * 1e3;
var INTERNAL = "input.nsb.expiring.";
var validDays = (n) => Number.isInteger(n) && n >= 1 && n <= 3650;
var HeaderWidget = class extends WidgetType {
  constructor(plugin, block) {
    super();
    this.plugin = plugin;
    this.block = block;
    this.lang = paipaEffectiveLang();
  }
  eq(other) {
    return this.plugin === other.plugin && this.block.from === other.block.from && this.block.id === other.block.id && JSON.stringify(this.block.meta.expiry) === JSON.stringify(other.block.meta.expiry) && this.block.daysLeft === other.block.daysLeft && this.lang === other.lang;
  }
  toDOM(view) {
    const b = this.block, document2 = view.dom.ownerDocument;
    const prefix = document2.createElement("span");
    prefix.className = "eb-header-prefix";
    prefix.contentEditable = "false";
    prefix.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.target.closest("button")) return;
      view.dispatch({ selection: EditorSelection.cursor(view.posAtDOM(prefix), 1) });
      view.focus();
    });
    const el = document2.createElement("span");
    el.className = "eb-badge";
    el.textContent = b.daysLeft === 1 ? paipaT("{n} day", { n: b.daysLeft }) : paipaT("{n} days", { n: b.daysLeft });
    el.dataset.urgency = b.daysLeft === 1 ? "urgent" : b.daysLeft === 2 ? "soon" : "normal";
    el.title = b.daysLeft === 0 ? paipaT("Expires on {date}; contents have expired", { date: core.expiryDate(b.meta.expiry) }) : paipaT("Expires on {date}; contents are cleared when it expires", { date: core.expiryDate(b.meta.expiry) });
    el.setAttribute("aria-label", paipaT("{badge}, {title}", { badge: el.textContent, title: el.title }));
    const reset = document2.createElement("button");
    reset.className = "eb-reset";
    reset.type = "button";
    reset.textContent = "\u21BA";
    reset.title = paipaT("Restart the timer from today");
    reset.setAttribute("aria-label", paipaT("Reset timer"));
    reset.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      let pos;
      try {
        pos = view.posAtDOM(prefix);
      } catch (_) {
        return;
      }
      this.plugin.reset(view, b.id, pos);
    });
    const clear = document2.createElement("button");
    clear.className = "eb-clear clickable-icon";
    clear.type = "button";
    clear.title = paipaT("Clear contents");
    clear.setAttribute("aria-label", paipaT("Clear contents"));
    setIcon(clear, "eraser");
    clear.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      let pos;
      try {
        pos = view.posAtDOM(prefix);
      } catch (_) {
        return;
      }
      this.plugin.clear(view, b.id, pos);
    });
    prefix.append(el, reset, clear);
    return prefix;
  }
  ignoreEvent() {
    return true;
  }
};
var ExpiringBlocks = class extends Plugin {
  async onload() {
    this.settings = { days: 7, language: "auto", ...await this.loadData() };
    paipaSetLang(this.settings.language);
    if (!validDays(this.settings.days)) this.settings.days = 7;
    this.stopped = false;
    this.pendingFiles = /* @__PURE__ */ new Map();
    this.busyFiles = /* @__PURE__ */ new Map();
    this.contextTargets = /* @__PURE__ */ new WeakMap();
    this.adapter = {
      decorate: (doc, toggles, decos) => this.decorate(doc, toggles, decos),
      clearVisual: (root) => root.querySelectorAll(".eb-body-visual").forEach((el) => el.classList.remove("eb-body-visual")),
      decorateVisual: (el, start, end, toggles) => {
        if (toggles.some((t) => core.validExpiry(t.meta?.expiry) && t.open && start >= t.bodyStartLine && end <= t.bodyEndLine))
          el.classList.add("eb-body-visual");
      }
    };
    this.addSettingTab(new ExpiringSettings(this.app, this));
    this.registerEvent(this.app.workspace.on("nsb:engine-loading", () => this.stopFallback()));
    this.registerEvent(this.app.workspace.on("nsb:engine-ready", (engine) => this.attach(engine)));
    this.registerEvent(this.app.workspace.on("nsb:engine-unloaded", (engine) => {
      if (this.engine === engine) this.engine = null;
      this.scheduleFallback();
    }));
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
      const hit = this.contextTargets.get(editor.cm);
      const pointer = hit && Date.now() - hit.at < 1e3 && hit.doc === editor.cm?.state.doc;
      const line = pointer ? hit.line : editor.getCursor().line;
      if (!this.canCreate(editor, line, pointer)) return;
      const doc = editor.cm.state.doc;
      menu.addItem((item) => item.setTitle(paipaT("Expiring block")).setIcon("hourglass").setSection("editor-enhancer").onClick(() => {
        if (editor.cm.state.doc === doc) this.create(editor, line, pointer);
      }));
    }));
    this.addCommand({ id: "create", name: paipaT("Create expiring block"), editorCheckCallback: (checking, editor) => {
      if (!this.canCreate(editor)) return false;
      if (!checking) this.create(editor, editor.getCursor().line);
      return true;
    } });
    this.registerEditorExtension([
      Prec.highest(EditorState.transactionFilter.of((tr) => this.renewTransaction(tr))),
      ViewPlugin.define((view) => {
        const capture = (event) => {
          const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
          if (pos !== null) this.contextTargets.set(view, { line: view.state.doc.lineAt(pos).number - 1, doc: view.state.doc, at: Date.now() });
        };
        view.dom.addEventListener("contextmenu", capture, true);
        const titleClick = (event) => this.titleBlankClick(view, event);
        view.dom.addEventListener("mousedown", titleClick, true);
        return { destroy: () => {
          view.dom.removeEventListener("contextmenu", capture, true);
          view.dom.removeEventListener("mousedown", titleClick, true);
        } };
      })
    ]);
    this.registerEvent(this.app.workspace.on("file-open", (file) => {
      if (file?.extension === "md") this.queueFile(file);
      this.engine?.toggleApi.refresh();
    }));
    this.registerEvent(this.app.vault.on("modify", (file) => {
      if (file.extension === "md") this.queueFile(file);
    }));
    this.registerEvent(this.app.vault.on("create", (file) => {
      if (file.extension === "md") this.queueFile(file);
    }));
    this.registerDomEvent(window, "focus", () => this.checkAll());
    this.registerDomEvent(document, "visibilitychange", () => {
      if (!document.hidden) this.checkAll();
    });
    this.registerInterval(window.setInterval(() => this.checkAll(), TWO_HOURS));
    this.app.workspace.onLayoutReady(() => {
      if (this.stopped) return;
      if (this.app.__nsbToggleEngine) this.attach(this.app.__nsbToggleEngine);
      else this.scheduleFallback();
      this.checkAll();
      this.scheduleMidnight();
    });
  }
  attach(engine) {
    if (this.stopped || this.engine === engine) return;
    this.stopFallback();
    this.engine = engine;
    engine.setExpiringAdapter(this.adapter);
  }
  scheduleFallback() {
    clearTimeout(this.fallbackTimer);
    this.fallbackTimer = setTimeout(() => this.startFallback().catch((e) => this.report(e)), 0);
  }
  async startFallback() {
    if (this.stopped || this.fallback || this.app.__nsbToggleEngine) return;
    const fallback = new ToggleEngine(this.app, { ...this.manifest, id: "expiring-blocks-engine" });
    fallback.isExpiringFallback = true;
    fallback.loadData = async () => ({
      language: this.settings.language,
      tlFeaturesEnabled: false,
      blockFeaturesEnabled: false,
      contextMenuFeaturesEnabled: false,
      blockSpacingEnabled: false,
      restoreScrollOnReopen: true,
      mobileTableLinkNav: false,
      toggleIconSize: 16,
      suppressRightClickLineSelection: false
    });
    fallback.addSettingTab = () => {
    };
    fallback.addCommand = () => {
    };
    this.fallback = fallback;
    fallback.load();
    for (let n = 0; n < 100 && !fallback.toggleApi; n++) await new Promise((r) => setTimeout(r, 10));
    if (this.fallback !== fallback || this.stopped) return;
    if (!fallback.toggleApi) throw new Error(paipaT("Toggle engine failed to load"));
    this.engine = fallback;
    fallback.setExpiringAdapter(this.adapter);
  }
  stopFallback() {
    if (!this.fallback) return;
    const fallback = this.fallback;
    this.fallback = null;
    if (this.engine === fallback) this.engine = null;
    fallback.expiringEngineCancelled = true;
    fallback.unload();
  }
  canCreate(editor, line = editor?.getCursor().line, atPointer = false) {
    if (!editor || !atPointer && editor.somethingSelected() || !this.engine || !Number.isInteger(line)) return false;
    if (editor.getLine(line)?.trim() !== "") return false;
    const cm = editor.cm;
    if (!cm || !cm.dom.closest(".is-live-preview")) return false;
    const text = editor.getValue();
    return core.canCreateAt(text, line);
  }
  create(editor, line, atPointer = false) {
    if (!this.canCreate(editor, line, atPointer)) return;
    const cm = editor.cm, row = cm.state.doc.line(line + 1), title = paipaT("Scratch");
    const meta = core.renew({ id: "tgl-eb-" + crypto.randomUUID(), open: true, v: 2 }, this.settings.days);
    const insert = title + " " + core.marker(meta) + "\n\n%% /nsb-toggle %%\n";
    cm.dispatch({
      changes: { from: row.from, to: row.to, insert },
      selection: { anchor: row.from, head: row.from + title.length },
      userEvent: INTERNAL + "create"
    });
    cm.focus();
  }
  renewTransaction(tr) {
    if (!tr.docChanged) return tr;
    const event = tr.annotation(Transaction.userEvent) || "";
    if (event.startsWith(INTERNAL) || event === "input.nsb.toggle" || /^undo|^redo/.test(event)) return tr;
    const before = this.editingBlocks(tr.startState.doc), after = this.editingBlocks(tr.newDoc);
    if (!before.length || !after.length) return tr;
    const changes = [];
    for (const b of after) {
      const matches = before.filter((a) => a.id === b.id);
      const old = matches.find((a) => tr.changes.mapPos(a.from, 1) === b.from) || (matches.length === 1 ? matches[0] : null);
      if (!old || old.body === b.body) continue;
      changes.push({ from: b.markerFrom, to: b.titleTo, insert: core.marker(core.renew(b.meta, this.settings.days)) });
    }
    return changes.length ? [tr, { changes, sequential: true }] : tr;
  }
  titleBlankClick(view, event) {
    if (event.button !== 0 || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
    const row = event.target.closest?.(".eb-title-line");
    if (!row || event.target.closest("button,a,.eb-header-prefix,.nsb-toggle-triangle")) return;
    const prefix = row.querySelector(".eb-header-prefix");
    if (!prefix) return;
    const from = view.posAtDOM(prefix);
    const block = this.editingBlocks(view.state.doc).find((b) => b.from === from);
    if (!block) return;
    const end = view.coordsAtPos(from + block.title.length, -1), start = view.coordsAtPos(from, 1);
    const onLine = (rect) => rect && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!(onLine(end) && event.clientX > end.right || onLine(start) && event.clientX < start.left)) return;
    event.preventDefault();
    event.stopPropagation();
    view.dispatch({ selection: EditorSelection.cursor(onLine(end) && event.clientX > end.right ? from + block.title.length : from, 1) });
    view.focus();
  }
  clear(cm, id, pos) {
    const row = cm.state.doc.lineAt(Math.min(pos, cm.state.doc.length));
    const text = cm.state.doc.toString();
    const b = core.scan(text).find((b2) => b2.id === id && b2.from === row.from);
    if (!b) {
      new Notice(paipaT("Cannot clear an incomplete block."));
      return;
    }
    const newline = text.slice(b.titleTo, b.bodyFrom) || "\n";
    cm.dispatch({
      changes: { from: b.bodyFrom, to: b.bodyTo, insert: newline },
      selection: EditorSelection.cursor(b.from + b.title.length, 1),
      userEvent: INTERNAL + "clear"
    });
  }
  reset(cm, id, pos) {
    const row = cm.state.doc.lineAt(Math.min(pos, cm.state.doc.length));
    const b = this.editingBlocks(cm.state.doc).find((b2) => b2.id === id && b2.from === row.from);
    if (!b) return;
    cm.dispatch({
      changes: { from: b.markerFrom, to: b.titleTo, insert: core.marker(core.renew(b.meta, this.settings.days)) },
      userEvent: INTERNAL + "reset"
    });
  }
  decorate(doc, toggles, decos) {
    const blocks = this.editingBlocks(doc, toggles), now = Date.now();
    for (const b of blocks) {
      if (toggles.some((t2) => !t2.open && b.titleLine >= t2.bodyStartLine && b.titleLine <= t2.endLine)) continue;
      const t = toggles.find((t2) => t2.startLine === b.startLine);
      if (!t) continue;
      b.daysLeft = core.remainingDays(b.meta.expiry, now);
      decos.push(Decoration.line({ attributes: { class: "eb-title-line" } }).range(b.from));
      decos.push(Decoration.widget({ widget: new HeaderWidget(this, b), side: -1 }).range(b.from));
      if (!t.open) continue;
      const visible = [];
      for (let n = t.bodyStartLine; n <= t.bodyEndLine; n++) {
        if (toggles.some((x) => n === x.endLine || !x.inline && n === x.startLine || !x.open && n >= x.bodyStartLine && n <= x.endLine)) continue;
        visible.push(n);
      }
      for (const n of visible) {
        let cls = "eb-body-line";
        if (n === visible[0]) cls += " eb-body-first";
        if (n === visible[visible.length - 1]) cls += " eb-body-last";
        if (t.bodyStartLine === t.bodyEndLine && !b.body.trim()) cls += " eb-body-empty";
        decos.push(Decoration.line({ attributes: { class: cls, "data-eb-placeholder": paipaT("Write down what you need to keep for now\u2026") } }).range(doc.line(n + 1).from));
      }
    }
  }
  editingBlocks(doc, toggles = this.engine?.toggleApi.scan(doc)) {
    if (!toggles) return core.scan(doc.toString());
    const eligible = core.editingOpenerLines(doc.toString());
    return toggles.filter((t) => t.inline && eligible.has(t.startLine) && core.validExpiry(t.meta?.expiry)).map((t) => {
      const row = doc.line(t.titleLine + 1), close = doc.line(t.endLine + 1);
      const bodyFrom = t.bodyStartLine <= t.bodyEndLine ? doc.line(t.bodyStartLine + 1).from : close.from;
      const marker = row.text.match(/%%\s*nsb-toggle\s+\{/);
      return {
        ...t,
        from: row.from,
        titleTo: row.to,
        markerFrom: row.from + marker.index,
        title: row.text.slice(0, t.titleMarkerFrom),
        bodyFrom,
        bodyTo: close.from,
        body: doc.sliceString(bodyFrom, close.from)
      };
    });
  }
  editorsFor(file) {
    const editors = [];
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.file?.path === file.path && leaf.view.editor)
        editors.push(leaf.view.editor);
    });
    return editors;
  }
  queueFile(file) {
    if (this.stopped) return;
    const path = file.path;
    clearTimeout(this.pendingFiles.get(path));
    const timer = setTimeout(() => {
      this.pendingFiles.delete(path);
      this.checkFile(file).catch((e) => this.report(e));
    }, 200);
    this.pendingFiles.set(path, timer);
  }
  async checkFile(file) {
    const path = file.path;
    if (this.stopped || this.busyFiles.has(path)) return;
    this.busyFiles.set(path, true);
    try {
      const editors = this.editorsFor(file), now = Date.now();
      if (editors.length) {
        const text = editors[0].getValue();
        if (editors.some((e) => e.getValue() !== text)) return;
        const changes = core.expireChanges(text, now);
        if (!changes.length) return;
        for (const editor of editors) {
          const cm = editor.cm;
          if (!cm || cm.composing || editor.getValue() !== text) continue;
          cm.dispatch({ changes, userEvent: INTERNAL + "expire" });
        }
      } else {
        const snapshot = await this.app.vault.cachedRead(file);
        if (!core.expireChanges(snapshot, now).length) return;
        await this.app.vault.process(file, (text) => {
          if (this.stopped || this.editorsFor(file).length) return text;
          return core.applyChanges(text, core.expireChanges(text, Date.now()));
        });
      }
    } finally {
      this.busyFiles.delete(path);
    }
  }
  async checkAll() {
    if (this.stopped || this.checking) return;
    this.checking = true;
    try {
      for (const file of this.app.vault.getMarkdownFiles()) {
        if (this.stopped) break;
        try {
          await this.checkFile(file);
        } catch (e) {
          this.report(e);
        }
      }
      this.engine?.toggleApi.refresh();
    } finally {
      this.checking = false;
    }
  }
  scheduleMidnight() {
    const next = /* @__PURE__ */ new Date();
    next.setHours(24, 0, 0, 20);
    this.midnightTimer = setTimeout(() => {
      this.checkAll();
      this.scheduleMidnight();
    }, next.getTime() - Date.now());
  }
  report(error) {
    console.error("Expiring Blocks:", error);
    new Notice(paipaT("Expiring block update failed: {error}", { error: error.message }));
  }
  onunload() {
    this.stopped = true;
    clearTimeout(this.midnightTimer);
    clearTimeout(this.fallbackTimer);
    for (const t of this.pendingFiles.values()) clearTimeout(t);
    if (this.engine && !this.fallback) this.engine.setExpiringAdapter(null);
    this.stopFallback();
    this.engine = null;
  }
};
var ExpiringSettings = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: paipaT("Expiring Blocks") });
    new Setting(this.containerEl).setName(paipaT("Language")).setDesc(paipaT("Follow Obsidian's language, or choose one for this plugin.")).addDropdown((d) => d.addOption("auto", paipaT("Follow Obsidian")).addOption("en", "English").addOption("zh", "中文").setValue(["auto", "en", "zh"].includes(this.plugin.settings.language) ? this.plugin.settings.language : "auto").onChange(async (value) => {
      this.plugin.settings.language = value;
      paipaSetLang(value);
      await this.plugin.saveData(this.plugin.settings);
      this.display();
      this.plugin.engine?.toggleApi.refresh();
    }));
    new Setting(this.containerEl).setName(paipaT("Lifetime (days)")).setDesc(paipaT("1\u20133650 days. Applied when editing content or resetting.")).addText((text) => {
      text.inputEl.type = "number";
      text.inputEl.min = "1";
      text.inputEl.max = "3650";
      text.inputEl.step = "1";
      text.setValue(String(this.plugin.settings.days)).onChange(async (value) => {
        const days = Number(value);
        text.inputEl.setCustomValidity(validDays(days) ? "" : paipaT("Enter a whole number from 1 to 3650."));
        if (validDays(days)) {
          this.plugin.settings.days = days;
          await this.plugin.saveData(this.plugin.settings);
        }
      });
    });
    this.containerEl.createEl("p", { text: paipaT("Right-click a blank line to create a block. Reset restarts the timer; Clear removes its contents.") });
    this.containerEl.createEl("p", { text: paipaT("2 days: yellow. 1 day: red. Expired contents are cleared; titles remain. Checked on opening, focus, midnight and every 2 hours.") });
  }
};
module.exports = ExpiringBlocks;
