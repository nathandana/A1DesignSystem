(() => {
  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function profileUrl(value) {
    try {
      const url = new URL(value, window.location.href)
      url.hash = ''
      url.search = ''
      return url.href
    } catch {
      return ''
    }
  }

  function uniqueLines(value) {
    const seen = new Set()
    return cleanText(value).split(/\s{2,}|\n+/).map(cleanText).filter((line) => {
      if (!line || seen.has(line)) return false
      seen.add(line)
      return true
    })
  }

  function closestCard(anchor) {
    return anchor.closest('li, [data-view-name], .reusable-search__result-container, .artdeco-card, .org-people-profile-card__profile-card-spacing') || anchor
  }

  function connectionFromAnchor(anchor) {
    const card = closestCard(anchor)
    const lines = uniqueLines(card.innerText)
    const href = profileUrl(anchor.href)
    const anchorText = cleanText(anchor.innerText)
    const name = cleanText(anchorText.split('\n')[0] || lines[0] || anchor.getAttribute('aria-label'))
      .replace(/^View\s+/, '')
      .replace(/\s+profile$/, '')
    const degree = lines.find((line) => /\b(1st|2nd|3rd)\b/i.test(line)) || ''
    const mutualText = lines.find((line) => /mutual|connection/i.test(line) && line !== degree) || ''
    const headline = lines.find((line) => {
      if (!line || line === name || line === degree || line === mutualText) return false
      if (/message|connect|follow|view/i.test(line)) return false
      return line.length > 8
    }) || ''
    return {
      name,
      headline,
      degree,
      mutualText,
      profileUrl: href,
    }
  }

  window.a1JobsScanLinkedIn = function a1JobsScanLinkedIn() {
    const anchors = Array.from(document.querySelectorAll('a[href*="/in/"]'))
    const connectionsByUrl = new Map()
    for (const anchor of anchors) {
      const connection = connectionFromAnchor(anchor)
      if (!connection.profileUrl || !connection.name) continue
      if (!connectionsByUrl.has(connection.profileUrl)) connectionsByUrl.set(connection.profileUrl, connection)
    }
    return {
      schemaVersion: 1,
      source: 'linkedin-visible-connections',
      url: window.location.href,
      title: document.title,
      scannedAt: new Date().toISOString(),
      connections: Array.from(connectionsByUrl.values()),
      note: 'User-initiated scan of visible LinkedIn page content only. It does not scroll, bypass login, or submit actions.',
    }
  }
})()
