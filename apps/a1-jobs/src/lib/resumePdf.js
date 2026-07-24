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

function isSectionHeading(line) {
  if (/^#{1,3}\s+/.test(line)) return true
  if (!line || /^[-*]\s+/.test(line)) return false
  if (line.length > 48) return false
  return [
    'summary',
    'professional summary',
    'experience',
    'professional experience',
    'education',
    'core competencies',
    'skills',
    'tools',
    'software',
    'ai agents',
  ].includes(line.toLowerCase())
}

export async function downloadResumePdf({ content, title = 'Tailored resume', company = '' }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const page = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: 54,
    bottom: 54,
  }
  const colors = {
    text: [22, 27, 34],
    muted: [82, 95, 113],
    rule: [196, 207, 222],
    accent: [65, 73, 96],
  }
  const lines = parseLines(content)
  const header = inferHeader(lines)
  let y = page.margin

  function addPageIfNeeded(nextHeight = 18) {
    if (y + nextHeight <= page.height - page.bottom) return
    doc.addPage()
    y = page.margin
  }

  function text(value, options = {}) {
    const {
      size = 10,
      style = 'normal',
      color = colors.text,
      indent = 0,
      leading = 13,
      bullet = false,
    } = options
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const maxWidth = page.width - page.margin * 2 - indent - (bullet ? 12 : 0)
    const wrapped = doc.splitTextToSize(stripMarkdown(value), maxWidth)
    addPageIfNeeded(wrapped.length * leading)
    if (bullet) {
      doc.circle(page.margin + indent + 2, y - 3, 1.6, 'F')
      doc.text(wrapped, page.margin + indent + 12, y)
    } else {
      doc.text(wrapped, page.margin + indent, y)
    }
    y += wrapped.length * leading
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...colors.text)
  doc.text(header.name, page.margin, y)
  y += 25

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(...colors.accent)
  doc.text(header.role, page.margin, y)
  y += 18

  const contactLine = header.contact.join('  |  ')
  if (contactLine) {
    text(contactLine, { size: 8.5, color: colors.muted, leading: 11 })
  }
  doc.setDrawColor(...colors.rule)
  doc.line(page.margin, y + 4, page.width - page.margin, y + 4)
  y += 24

  let skipHeaderLines = 2 + header.contact.length
  for (const rawLine of lines) {
    if (skipHeaderLines > 0 && rawLine) {
      skipHeaderLines -= 1
      continue
    }
    if (!rawLine) {
      y += 5
      continue
    }
    if (isSectionHeading(rawLine)) {
      y += y > page.margin + 40 ? 8 : 0
      addPageIfNeeded(24)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...colors.accent)
      doc.text(stripMarkdown(rawLine), page.margin, y)
      y += 9
      doc.setDrawColor(...colors.rule)
      doc.line(page.margin, y, page.width - page.margin, y)
      y += 14
      continue
    }
    if (/^[-*]\s+/.test(rawLine)) {
      text(rawLine, { size: 9.2, leading: 12, bullet: true })
      y += 2
      continue
    }
    text(rawLine, { size: 9.6, leading: 13 })
    y += 4
  }

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...colors.muted)
    doc.text(`${header.name} resume${company ? ` - ${company}` : ''}`, page.margin, page.height - 28)
    doc.text(String(i), page.width - page.margin, page.height - 28, { align: 'right' })
  }

  doc.save(`${safeFileName(`${header.name}-${company || title}`)}.pdf`)
}
