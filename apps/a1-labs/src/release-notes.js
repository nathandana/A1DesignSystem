// Labs changelogs use dated version headings and top-level bullet entries.
// Read the checked-in changelog so public notes cannot drift from version history.
export function parseReleaseNotes(markdown) {
  return markdown.split(/^## /m).slice(1).flatMap(section => {
    const [heading, ...lines] = section.split('\n')
    const match = heading.match(/^(\d+\.\d+\.\d+) — (.+)$/)
    if (!match) return []
    const entries = []
    for (const line of lines) {
      if (line.startsWith('- ')) entries.push(line.slice(2).trim())
      else if (line.trim() && entries.length) entries[entries.length - 1] += ` ${line.trim()}`
    }
    return [{ version: match[1], date: match[2], entries }]
  })
}
