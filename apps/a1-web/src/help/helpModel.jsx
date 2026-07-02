import { isValidElement } from 'react'

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function keywordList(keywords) {
  if (Array.isArray(keywords)) return keywords.map((keyword) => normalizeWhitespace(String(keyword))).filter(Boolean)
  return normalizeWhitespace(String(keywords || '')).split(/\s+/).filter(Boolean)
}

function extractText(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).filter(Boolean).join(' ')
  if (!isValidElement(node)) return ''

  const parts = []
  const { alt, caption, children, label, title } = node.props || {}

  if (typeof title === 'string' && title.trim()) parts.push(title)
  if (typeof label === 'string' && label.trim()) parts.push(label)
  if (typeof alt === 'string' && alt.trim()) parts.push(alt)
  if (typeof caption === 'string' && caption.trim()) parts.push(caption)
  if (children != null) parts.push(extractText(children))

  return parts.filter(Boolean).join(' ')
}

function normalizeArticle(category, article) {
  const keywords = keywordList(article.keywords)
  const bodyText = normalizeWhitespace(extractText(article.body))
  const searchText = normalizeWhitespace([
    category.title,
    article.title,
    keywords.join(' '),
    bodyText,
  ].filter(Boolean).join(' ')).toLowerCase()

  return {
    ...article,
    keywords,
    bodyText,
    searchText,
  }
}

export function buildHelpCategories(categories) {
  return categories.map((category) => ({
    ...category,
    articles: category.articles.map((article) => normalizeArticle(category, article)),
  }))
}

export function matchHelpArticle(article, tokens) {
  if (!tokens.length) return true
  return tokens.every((token) => article.searchText.includes(token))
}

export function buildHelpAiCatalog(categories) {
  return categories.flatMap((category) =>
    category.articles.map((article) => ({
      categoryId: category.id,
      categoryTitle: category.title,
      articleId: article.id,
      articleTitle: article.title,
      keywords: article.keywords,
      bodyText: article.bodyText,
    })),
  )
}
