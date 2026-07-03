import { HELP_AI_CONTENT } from './helpContent.jsx'

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'be', 'can', 'do', 'for', 'from', 'how', 'i', 'in',
  'is', 'it', 'me', 'my', 'of', 'on', 'or', 'the', 'this', 'to', 'using', 'what',
  'where', 'with', 'you',
])

const RELATED_TERMS = {
  add: ['create', 'insert', 'new', 'use'],
  ai: ['assistant', 'generate', 'chat'],
  bind: ['binding', 'data', 'dataset', 'token'],
  card: ['cards', 'tile'],
  data: ['dataset', 'source', 'table', 'binding'],
  delete: ['remove'],
  edit: ['change', 'update', 'configure'],
  figure: ['image', 'media'],
  image: ['figure', 'library', 'photo'],
  link: ['navigate', 'navigation', 'page'],
  page: ['screen', 'project'],
  pattern: ['patterns', 'instance', 'linked'],
  preview: ['prototype'],
  project: ['projects', 'editor'],
  search: ['find', 'lookup'],
  section: ['layout', 'surface', 'background'],
  theme: ['tokens', 'brand', 'colors'],
  use: ['add', 'insert', 'apply'],
}

export const HELP_ASSISTANT_STARTERS = [
  'How do I add a pattern to a project?',
  'How do I link a button to another page?',
  'How do I repeat cards from a data source?',
  'How do I change the active theme?',
]

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenize(value) {
  return normalize(value).split(/\s+/).filter(Boolean)
}

function meaningfulTokens(value) {
  return tokenize(value).filter((token) => !STOP_WORDS.has(token))
}

function expandTokens(tokens) {
  const expanded = new Set(tokens)
  for (const token of tokens) {
    const related = RELATED_TERMS[token] ?? []
    for (const value of related) {
      for (const next of tokenize(value)) expanded.add(next)
    }
  }
  return [...expanded]
}

function sentenceFragments(text) {
  return String(text ?? '')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function summarizeArticle(article) {
  const sentences = sentenceFragments(article.bodyText)
  if (!sentences.length) return ''
  return sentences.slice(0, 2).join(' ')
}

function scoreArticle(article, query, expandedTokens) {
  const queryText = normalize(query)
  const title = normalize(article.articleTitle)
  const category = normalize(article.categoryTitle)
  const keywords = article.keywords.map(normalize)
  const body = normalize(article.bodyText)
  const haystack = `${title} ${category} ${keywords.join(' ')} ${body}`

  let score = 0
  if (title.includes(queryText)) score += 120
  if (category.includes(queryText)) score += 60

  for (const token of expandedTokens) {
    if (title.split(' ').some((part) => part.startsWith(token))) score += 36
    if (keywords.some((keyword) => keyword.includes(token))) score += 20
    if (category.includes(token)) score += 12
    if (body.includes(token)) score += 10
    if (haystack.includes(token)) score += 4
  }

  return score
}

function fallbackSuggestions(expandedTokens) {
  return HELP_AI_CONTENT
    .map((article) => ({
      article,
      score: expandedTokens.reduce((sum, token) => sum + (article.bodyText.toLowerCase().includes(token) ? 1 : 0), 0),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.article.articleTitle.localeCompare(b.article.articleTitle))
    .slice(0, 3)
    .map(({ article }) => article)
}

export function answerHelpQuestion(question) {
  const trimmedQuestion = String(question ?? '').trim()
  if (!trimmedQuestion) {
    return {
      status: 'idle',
      answer: '',
      matches: [],
    }
  }

  const baseTokens = meaningfulTokens(trimmedQuestion)
  const expandedTokens = expandTokens(baseTokens)
  const ranked = HELP_AI_CONTENT
    .map((article) => ({
      article,
      score: scoreArticle(article, trimmedQuestion, expandedTokens),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.article.articleTitle.localeCompare(b.article.articleTitle))

  if (!ranked.length) {
    return {
      status: 'no-match',
      answer: 'I could not find a direct answer in Help yet. Try the full Help page or ask with a feature name like pattern, page, data, or theme.',
      matches: fallbackSuggestions(expandedTokens).map((article) => ({
        ...article,
        summary: summarizeArticle(article),
      })),
    }
  }

  const matches = ranked.slice(0, 3).map(({ article }) => ({
    ...article,
    summary: summarizeArticle(article),
  }))
  const primary = matches[0]

  return {
    status: 'match',
    answer: primary.summary || `Open ${primary.articleTitle} in Help for the full guidance.`,
    matches,
  }
}
