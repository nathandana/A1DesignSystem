const HEADING = /^(#{1,2})\s+(.+)$/
const LIST_ITEM = /^(-|\d+\.)\s+(.+)$/

function startsBlock(line) {
  return !line || HEADING.test(line) || line.startsWith('```') || LIST_ITEM.test(line)
}

export function parseContentStandards(markdown) {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    const heading = line.match(HEADING)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const code = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index])
        index += 1
      }
      index += 1
      blocks.push({ type: 'code', language, text: code.join('\n') })
      continue
    }

    const firstItem = line.match(LIST_ITEM)
    if (firstItem) {
      const ordered = firstItem[1] !== '-'
      const items = []
      while (index < lines.length) {
        const item = lines[index].trim().match(LIST_ITEM)
        if (!item || (item[1] !== '-') !== ordered) break

        let text = item[2]
        index += 1
        while (index < lines.length) {
          const continuation = lines[index].trim()
          if (startsBlock(continuation)) break
          text += ` ${continuation}`
          index += 1
        }
        items.push(text)
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length) {
      const continuation = lines[index].trim()
      if (startsBlock(continuation)) break
      paragraph.push(continuation)
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
  }

  const title = blocks[0]?.type === 'heading' && blocks[0].level === 1
    ? blocks.shift().text
    : 'Content standards'
  const intro = []
  const sections = []
  let currentSection = null

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 2) {
      currentSection = { title: block.text, blocks: [] }
      sections.push(currentSection)
    } else if (currentSection) {
      currentSection.blocks.push(block)
    } else {
      intro.push(block)
    }
  }

  return { title, intro, sections }
}
