// A small, dependency-free tokenizer for the Labs code highlighting study.
// It favours predictable output for documentation snippets over full
// language grammars: JSX/JavaScript, CSS, HTML and JSON. Every character of
// the input appears in exactly one token, in order, so joining the token text
// always reproduces the source (copy, line numbers and editing rely on that).

export const LANGUAGES = [
  { value: 'jsx', label: 'JSX' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
]

// Token roles, in legend order.
export const ROLES = ['keyword', 'string', 'number', 'constant', 'function', 'tag', 'attribute', 'property', 'selector', 'comment', 'operator', 'punctuation']

const JS_KEYWORDS = new Set('as async await break case catch class const continue default delete do else export extends finally for from function if import in instanceof let new of return static super switch this throw try typeof var void while with yield'.split(' '))
const JS_CONSTANTS = new Set('true false null undefined NaN Infinity'.split(' '))

const STRING = /`(?:\\[\s\S]|[^\\`])*`?|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y
const NUMBER = /(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?![\w$])/y
const SPACE = /\s+/y

function match(regex, source, index) {
  regex.lastIndex = index
  const found = regex.exec(source)
  return found ? found[0] : null
}

function push(tokens, type, text) {
  if (!text) return
  const last = tokens[tokens.length - 1]
  // Merge neighbours of the same type (plain text especially) to keep the DOM small.
  if (last && last.type === type) last.text += text
  else tokens.push({ type, text })
}

// "<" starts a JSX tag unless it follows a value (a comparison like `a < b`).
// A keyword such as `return` before it still allows a tag.
function opensTag(before) {
  const previous = before.match(/([\w$]+|[)\]])\s*$/)
  return !previous || JS_KEYWORDS.has(previous[1])
}

function tokenizeJsx(source) {
  const tokens = []
  let i = 0
  let inTag = false // inside <Tag ...> where identifiers before "=" are attributes
  let afterLt = false // the previous token opened a tag ("<" or "</")
  while (i < source.length) {
    const rest = source.slice(i)
    let text
    if ((text = match(/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, source, i))) push(tokens, 'comment', text)
    else if ((text = match(STRING, source, i))) push(tokens, 'string', text)
    else if (afterLt && (text = match(/[A-Za-z][\w.-]*/y, source, i))) { push(tokens, 'tag', text); inTag = true }
    else if (!inTag && /^<\/?(?=[A-Za-z>])/.test(rest) && opensTag(source.slice(0, i))) {
      text = rest.startsWith('</') ? '</' : '<'
      push(tokens, 'punctuation', text); afterLt = true; i += text.length; continue
    }
    else if (inTag && (text = match(/\/?>/y, source, i))) { push(tokens, 'punctuation', text); inTag = false }
    else if (inTag && (text = match(/[A-Za-z_][\w-]*(?=\s*=|\s|\/?>)/y, source, i))) push(tokens, 'attribute', text)
    else if ((text = match(NUMBER, source, i)) && !/[\w$]$/.test(source.slice(0, i))) push(tokens, 'number', text)
    else if ((text = match(/[A-Za-z_$][\w$]*/y, source, i))) {
      const before = source.slice(0, i)
      const next = source.slice(i + text.length)
      if (JS_KEYWORDS.has(text) && !/\.$/.test(before)) push(tokens, 'keyword', text)
      else if (JS_CONSTANTS.has(text)) push(tokens, 'constant', text)
      else if (/^\s*\(/.test(next)) push(tokens, 'function', text)
      else if (/\.$/.test(before) || /^\s*:(?!:)/.test(next) && /[{,]\s*$/.test(before)) push(tokens, 'property', text)
      else push(tokens, 'plain', text)
    }
    else if ((text = match(/=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?|\?\.|\.\.\.|[+\-*/%=!<>&|^~?:]/y, source, i))) push(tokens, 'operator', text)
    else if ((text = match(/[{}()[\];,.]/y, source, i))) push(tokens, 'punctuation', text)
    else if ((text = match(SPACE, source, i))) push(tokens, 'plain', text)
    else push(tokens, 'plain', (text = source[i]))
    afterLt = false
    i += text.length
  }
  return tokens
}

function tokenizeCss(source) {
  const tokens = []
  const stack = [] // 'rules' | 'decls' per open brace
  let pendingRules = false // an at-rule whose block holds rules (@media, @supports…)
  let i = 0
  const context = () => stack[stack.length - 1] ?? 'rules'
  while (i < source.length) {
    let text
    if ((text = match(/\/\*[\s\S]*?(?:\*\/|$)/y, source, i))) push(tokens, 'comment', text)
    else if ((text = match(STRING, source, i))) push(tokens, 'string', text)
    else if ((text = match(/@[\w-]+/y, source, i))) {
      push(tokens, 'keyword', text)
      pendingRules = /^@(media|supports|layer|container|document|scope)$/.test(text)
    }
    else if ((text = match(/\{/y, source, i))) { push(tokens, 'punctuation', text); stack.push(pendingRules ? 'rules' : 'decls'); pendingRules = false }
    else if ((text = match(/\}/y, source, i))) { push(tokens, 'punctuation', text); stack.pop() }
    else if (context() === 'decls') {
      if ((text = match(/-{0,2}[A-Za-z_][\w-]*(?=\s*:)/y, source, i))) push(tokens, 'property', text)
      else if ((text = match(/#[\da-fA-F]{3,8}(?![\w-])/y, source, i))) push(tokens, 'constant', text)
      else if ((text = match(/-?(?:\d*\.\d+|\d+)(?:[A-Za-z%]+)?/y, source, i))) push(tokens, 'number', text)
      else if ((text = match(/[\w-]+(?=\()/y, source, i))) push(tokens, 'function', text)
      else if ((text = match(/!important/y, source, i))) push(tokens, 'keyword', text)
      else if ((text = match(/--[\w-]+/y, source, i))) push(tokens, 'property', text)
      else if ((text = match(/[\w-]+/y, source, i))) push(tokens, 'plain', text)
      else if ((text = match(/[:;,()]/y, source, i))) push(tokens, 'punctuation', text)
      else if ((text = match(/[+*/>~=]/y, source, i))) push(tokens, 'operator', text)
      else push(tokens, 'plain', (text = match(SPACE, source, i) ?? source[i]))
    }
    else if (pendingRules || /@[\w-]+[^{;]*$/.test(source.slice(0, i))) {
      // At-rule prelude: (min-width: 640px) and friends.
      if ((text = match(/-?(?:\d*\.\d+|\d+)(?:[A-Za-z%]+)?/y, source, i))) push(tokens, 'number', text)
      else if ((text = match(/[\w-]+(?=\s*:)/y, source, i))) push(tokens, 'property', text)
      else if ((text = match(/[():;,]/y, source, i))) push(tokens, 'punctuation', text)
      else push(tokens, 'plain', (text = match(/[\w-]+|\s+/y, source, i) ?? source[i]))
    }
    else if ((text = match(/::?[\w-]+|[.#]?[A-Za-z_*][\w-]*|\*|\[[^\]]*\]/y, source, i))) push(tokens, 'selector', text)
    else if ((text = match(/[>+~,]/y, source, i))) push(tokens, 'operator', text)
    else if ((text = match(/[();]/y, source, i))) push(tokens, 'punctuation', text)
    else push(tokens, 'plain', (text = match(SPACE, source, i) ?? source[i]))
    i += text.length
  }
  return tokens
}

function tokenizeHtml(source) {
  const tokens = []
  let i = 0
  let inTag = false
  while (i < source.length) {
    let text
    if ((text = match(/<!--[\s\S]*?(?:-->|$)/y, source, i))) push(tokens, 'comment', text)
    else if ((text = match(/<!doctype[^>]*>/iy, source, i))) push(tokens, 'keyword', text)
    else if (!inTag && (text = match(/<\/?(?=[A-Za-z])/y, source, i))) {
      push(tokens, 'punctuation', text); i += text.length
      const name = match(/[A-Za-z][\w-]*/y, source, i)
      push(tokens, 'tag', name); i += name.length; inTag = true
      continue
    }
    else if (inTag && (text = match(/\/?>/y, source, i))) { push(tokens, 'punctuation', text); inTag = false }
    else if (inTag && (text = match(/"[^"]*"?|'[^']*'?/y, source, i))) push(tokens, 'string', text)
    else if (inTag && (text = match(/=/y, source, i))) push(tokens, 'operator', text)
    else if (inTag && (text = match(/[^\s=>/"']+/y, source, i))) push(tokens, 'attribute', text)
    else if (!inTag && (text = match(/&(?:[A-Za-z]+|#\d+|#x[\da-fA-F]+);/y, source, i))) push(tokens, 'constant', text)
    else push(tokens, 'plain', (text = match(inTag ? /\s+/y : /[^<&]+/y, source, i) ?? source[i]))
    i += text.length
  }
  return tokens
}

function tokenizeJson(source) {
  const tokens = []
  let i = 0
  while (i < source.length) {
    let text
    if ((text = match(/"(?:\\.|[^"\\\n])*"?/y, source, i))) push(tokens, /^\s*:/.test(source.slice(i + text.length)) ? 'property' : 'string', text)
    else if ((text = match(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y, source, i))) push(tokens, 'number', text)
    else if ((text = match(/true|false|null/y, source, i))) push(tokens, 'constant', text)
    else if ((text = match(/[{}[\]:,]/y, source, i))) push(tokens, 'punctuation', text)
    else push(tokens, 'plain', (text = match(SPACE, source, i) ?? source[i]))
    i += text.length
  }
  return tokens
}

const TOKENIZERS = { jsx: tokenizeJsx, css: tokenizeCss, html: tokenizeHtml, json: tokenizeJson }

export function tokenize(source, language = 'jsx') {
  const tokenizer = TOKENIZERS[language] ?? TOKENIZERS.jsx
  return tokenizer(String(source ?? ''))
}

// Split tokens into lines; a token that spans lines (a block comment, a
// template string) is cut at each newline and keeps its type on every line.
export function toLines(tokens) {
  const lines = [[]]
  for (const token of tokens) {
    const parts = token.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ type: token.type, text: part })
    })
  }
  return lines
}

// "2, 4-6" → Set {2, 4, 5, 6}. Ignores anything it can't read; caps ranges.
export function parseLineRanges(value, max = 999) {
  const lines = new Set()
  for (const part of String(value ?? '').split(/[,\s]+/)) {
    const range = part.match(/^(\d+)(?:-(\d+))?$/)
    if (!range) continue
    const start = Number(range[1]), end = Number(range[2] ?? range[1])
    for (let line = Math.min(start, end); line <= Math.min(Math.max(start, end), max); line++) if (line > 0) lines.add(line)
  }
  return lines
}

// Diff lines start with "+" (added) or "-" (removed) followed by a space or end.
export function diffKind(lineText) {
  if (/^\+(\s|$)/.test(lineText)) return 'added'
  if (/^-(\s|$)/.test(lineText)) return 'removed'
  return null
}
