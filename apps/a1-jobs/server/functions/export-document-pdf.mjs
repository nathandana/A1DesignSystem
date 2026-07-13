import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { json, options } from './_utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '../..')
const resumesDir = resolve(appRoot, 'resumes')

function safeFileName(value) {
  return String(value || 'document')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'document'
}

function cleanLine(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function stripMarkdown(value) {
  return cleanLine(String(value || '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1'))
}

function wrapText(value, font, size, maxWidth) {
  const words = stripMarkdown(value).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth || !line) line = next
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

async function renderDocumentPdf({ content, title = 'Document', company = '', kind = 'document' }) {
  const doc = await PDFDocument.create()
  const regular = await doc.embedFont(StandardFonts.TimesRoman)
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const pageSize = [612, 792]
  const margin = 54
  let page = doc.addPage(pageSize)
  let y = 724

  function addPageIfNeeded(height = 18) {
    if (y - height >= margin) return
    page = doc.addPage(pageSize)
    y = 724
  }

  function drawText(value, { size = 11.5, font = regular, leading = 16, x = margin, color = rgb(0, 0, 0) } = {}) {
    const lines = wrapText(value, font, size, pageSize[0] - margin * 2)
    addPageIfNeeded(lines.length * leading)
    for (const line of lines) {
      page.drawText(line, { x, y, size, font, color })
      y -= leading
    }
  }

  doc.setTitle(`${title}${company ? ` - ${company}` : ''}`)
  doc.setAuthor('Nathan A. Dana')
  doc.setCreator('A1 Jobs')

  page.drawText(title, { x: margin, y, size: 18, font: bold, color: rgb(0, 0, 0) })
  y -= 34
  if (company) {
    page.drawText(company, { x: margin, y, size: 12, font: regular, color: rgb(0.32, 0.32, 0.32) })
    y -= 28
  }

  for (const rawLine of String(content || '').replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      y -= 8
      continue
    }
    if (/^#{1,6}\s+/.test(line)) {
      y -= 8
      addPageIfNeeded(24)
      drawText(stripMarkdown(line), { size: 14, font: bold, leading: 18 })
      y -= 4
    } else {
      drawText(line, { size: 11.5, leading: 16 })
    }
  }

  const filename = `${safeFileName(`nathan-a-dana-${company || kind}-${kind}`)}.pdf`
  return { filename, buffer: Buffer.from(await doc.save()) }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const result = await renderDocumentPdf(body)
    await mkdir(resumesDir, { recursive: true })
    const outputPath = resolve(resumesDir, result.filename)
    await writeFile(outputPath, result.buffer)
    return json(200, {
      result: {
        filename: result.filename,
        path: outputPath,
        relativePath: relative(appRoot, outputPath),
      },
    })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
