import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { json, options } from './_utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '../..')
const resumesDir = resolve(appRoot, 'resumes')
const baselinePath = resolve(resumesDir, 'Nathan Dana - Resume - baseline.pdf')

function safeFileName(value) {
  return String(value || 'resume')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'resume'
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

function parseLines(content) {
  return String(content || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
}

function inferHeader(lines) {
  const nonEmpty = lines.filter(Boolean)
  const first = stripMarkdown(nonEmpty[0] || 'Nathan Dana')
  const second = stripMarkdown(nonEmpty[1] || 'Principal AI Designer')
  const contact = nonEmpty
    .slice(2, 8)
    .map(stripMarkdown)
    .filter((line) => /@|linkedin|https?:|\.app|,\s*[A-Z]{2}\b/.test(line))
  return {
    name: first,
    role: second,
    contact,
  }
}

function splitContactItems(contact) {
  return contact
    .flatMap((line) => String(line || '').split('|'))
    .map(cleanLine)
    .filter(Boolean)
}

function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 10) return `1 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`
  if (digits.length === 11 && digits.startsWith('1')) return `1 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7)}`
  return value
}

function contactLines(contact) {
  const items = splitContactItems(contact)
  const location = items.find((item) => /,\s*[A-Z]{2}\b/.test(item)) || 'Fort Mill, SC'
  const email = items.find((item) => /@/.test(item)) || 'nathan.dana@gmail.com'
  const phone = formatPhone(items.find((item) => /\d/.test(item) && !/@|https?:|\.app|linkedin/i.test(item)) || '8028467679')
  const links = items
    .filter((item) => /linkedin|https?:|\.app/i.test(item))
    .filter((item) => !(item === 'a1design.app' && items.some((candidate) => /nathandana\.a1design\.app/i.test(candidate))))
    .sort((a, b) => {
      const score = (item) => /nathandana\.a1design\.app/i.test(item) ? 0 : /linkedin/i.test(item) ? 1 : 2
      return score(a) - score(b)
    })
  return [
    [
      { text: location, tone: 'muted' },
      { text: ' | ', tone: 'muted' },
      { text: phone, tone: 'muted' },
      { text: ' | ', tone: 'muted' },
      { text: email, tone: 'link' },
    ],
    links.flatMap((link, index) => [
      ...(index > 0 ? [{ text: ' | ', tone: 'muted' }] : []),
      { text: link, tone: 'link' },
    ]),
  ].filter((line) => line.length)
}

function displaySectionTitle(value) {
  const title = stripMarkdown(value)
  if (title.toLowerCase() === 'experience') return 'Professional Experience'
  return title
}

function isSectionHeading(line) {
  if (/^#{1,3}\s+/.test(line)) return true
  if (!line || /^[-*]\s+/.test(line)) return false
  if (line.length > 54) return false
  return [
    'summary',
    'professional summary',
    'experience',
    'professional experience',
    'selected experience',
    'education',
    'core competencies',
    'skills',
    'tools',
    'software',
    'ai agents',
  ].includes(stripMarkdown(line).toLowerCase())
}

function wrapText(value, font, size, maxWidth) {
  const words = stripMarkdown(value).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth || !line) {
      line = next
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

async function renderResumePdf({ content, title = 'Tailored resume', company = '' }) {
  if (!existsSync(baselinePath)) {
    throw new Error(`Baseline resume PDF is missing at ${relative(appRoot, baselinePath)}.`)
  }

  const baselineBytes = await readFile(baselinePath)
  const doc = await PDFDocument.load(baselineBytes)
  while (doc.getPageCount() > 1) doc.removePage(1)

  const times = await doc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const firstPage = doc.getPage(0)
  const { width, height } = firstPage.getSize()
  const layout = {
    width,
    height,
    sectionX: 36,
    bodyX: 54,
    bulletTextX: 72,
    right: 54,
    bodyStartFromTop: 154,
    bottom: 52,
  }
  const colors = {
    text: rgb(0, 0, 0),
    muted: rgb(0.32, 0.32, 0.32),
    white: rgb(1, 1, 1),
  }
  const lines = parseLines(content)
  const header = inferHeader(lines)
  const displayName = header.name === 'Nathan Dana' ? 'Nathan A. Dana' : header.name
  let page = firstPage
  let y = layout.height - layout.bodyStartFromTop

  function maskTemplateBody(targetPage, preserveTop = 142) {
    targetPage.drawRectangle({
      x: 0,
      y: 0,
      width: layout.width,
      height: layout.height - preserveTop,
      color: colors.white,
      borderWidth: 0,
    })
  }

  maskTemplateBody(firstPage)

  function addPageIfNeeded(nextHeight = 18) {
    if (y - nextHeight >= layout.bottom) return
    page = doc.addPage([layout.width, layout.height])
    page.drawRectangle({ x: 0, y: 0, width: layout.width, height: layout.height, color: colors.white })
    y = layout.height - 54
  }

  function text(value, options = {}) {
    const {
      size = 11.2,
      style = 'normal',
      color = colors.text,
      x = layout.bodyX,
      maxWidth = layout.width - layout.bodyX - layout.right,
      leading = 15.5,
      bullet = false,
    } = options
    const font = style === 'bold' ? timesBold : times
    const wrapped = wrapText(value, font, size, maxWidth)
    addPageIfNeeded(wrapped.length * leading + 3)
    if (bullet) {
      page.drawText('•', { x: layout.bodyX, y, size: 11.2, font: times, color })
      for (const line of wrapped) {
        page.drawText(line, { x: layout.bulletTextX, y, size, font, color })
        y -= leading
      }
    } else {
      for (const line of wrapped) {
        page.drawText(line, { x, y, size, font, color })
        y -= leading
      }
    }
  }

  doc.setTitle(`${displayName} - ${company || title}`)
  doc.setSubject(`Tailored resume based on ${relative(appRoot, baselinePath)}`)
  doc.setAuthor(displayName)
  doc.setCreator('A1 Jobs')

  let skipHeaderLines = 2 + header.contact.length
  let currentSection = ''
  for (const rawLine of lines) {
    if (skipHeaderLines > 0 && rawLine) {
      skipHeaderLines -= 1
      continue
    }
    if (!rawLine) {
      y -= 5
      continue
    }
    if (isSectionHeading(rawLine)) {
      currentSection = stripMarkdown(rawLine).toLowerCase()
      y -= y < layout.height - layout.bodyStartFromTop ? 12 : 0
      addPageIfNeeded(30)
      page.drawText(displaySectionTitle(rawLine), {
        x: layout.sectionX,
        y,
        size: 16,
        font: timesBold,
        color: colors.text,
      })
      y -= currentSection.includes('experience') ? 38 : 31
      continue
    }
    if (/^[-*]\s+/.test(rawLine)) {
      text(rawLine, { size: 11.1, leading: 15.4, bullet: true, maxWidth: layout.width - layout.bulletTextX - layout.right })
      y -= 3
      continue
    }
    if (currentSection.includes('experience')) {
      addPageIfNeeded(24)
      text(rawLine.replace(/,\s*/g, (match, offset) => (offset === 0 ? match : match)), {
        size: 12.5,
        color: colors.muted,
        leading: 15,
      })
      y -= 10
      continue
    }
    text(rawLine, { size: 11.5, leading: 16.2 })
    y -= currentSection.includes('summary') ? 15 : 7
  }

  const filename = `${safeFileName(`${displayName}-${company || title}`)}.pdf`
  return {
    buffer: Buffer.from(await doc.save()),
    filename,
    baselinePath,
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const result = await renderResumePdf(body)
    await mkdir(resumesDir, { recursive: true })
    const outputPath = resolve(resumesDir, result.filename)
    await writeFile(outputPath, result.buffer)
    return json(200, {
      result: {
        filename: result.filename,
        path: outputPath,
        relativePath: relative(appRoot, outputPath),
        baselineRelativePath: relative(appRoot, result.baselinePath),
      },
    })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
