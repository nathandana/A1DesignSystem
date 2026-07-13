(() => {
  const MAX_TEXT_LENGTH = 60000
  const MAX_ITEMS = 50
  const MAX_ITEM_TEXT_LENGTH = 800

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function shortText(value, maxLength = MAX_ITEM_TEXT_LENGTH) {
    return cleanText(value).slice(0, maxLength)
  }

  function textFromHtml(value) {
    const node = document.createElement('div')
    node.innerHTML = String(value || '')
    return cleanText(node.textContent || '')
  }

  function meta(name) {
    return document.querySelector(`meta[name="${name}"]`)?.content
      || document.querySelector(`meta[property="${name}"]`)?.content
      || ''
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  function flattenJsonLd(value, out = []) {
    if (Array.isArray(value)) {
      for (const item of value) flattenJsonLd(item, out)
      return out
    }
    if (!value || typeof value !== 'object') return out
    out.push(value)
    if (value['@graph']) flattenJsonLd(value['@graph'], out)
    return out
  }

  function jobPostingFromJsonLd() {
    const nodes = []
    for (const script of document.querySelectorAll('script[type*="ld+json"]')) {
      try {
        nodes.push(...flattenJsonLd(JSON.parse(script.textContent || 'null')))
      } catch {
        // Ignore malformed structured data and use visible page text instead.
      }
    }
    return nodes.find((node) => {
      const type = node['@type']
      return type === 'JobPosting' || (Array.isArray(type) && type.includes('JobPosting'))
    }) || null
  }

  function locationFromJobPosting(posting) {
    const locations = Array.isArray(posting?.jobLocation) ? posting.jobLocation : [posting?.jobLocation].filter(Boolean)
    return locations.map((location) => {
      const address = location?.address ?? location
      if (typeof address === 'string') return address
      return cleanText([
        address?.addressLocality,
        address?.addressRegion,
        address?.addressCountry,
      ].filter(Boolean).join(', '))
    }).filter(Boolean).join('; ')
  }

  function salaryFromJobPosting(posting) {
    const salary = posting?.baseSalary
    const value = salary?.value ?? salary
    if (!value || typeof value !== 'object') return ''
    const min = value.minValue
    const max = value.maxValue
    const unit = value.unitText || salary.currency || ''
    if (min && max) return cleanText(`${min}-${max} ${unit}`)
    if (value.value) return cleanText(`${value.value} ${unit}`)
    return ''
  }

  function visibleTextFrom(root) {
    const clone = root.cloneNode(true)
    clone.querySelectorAll('script, style, noscript, svg, canvas, iframe').forEach((node) => node.remove())
    return cleanText(clone.textContent)
  }

  function firstVisible(selector, root = document) {
    return Array.from(root.querySelectorAll(selector)).find(isVisible) || null
  }

  function isLinkedInJobsPage() {
    return /(^|\.)linkedin\.com$/i.test(window.location.hostname) && /\/jobs\//i.test(window.location.pathname)
  }

  function linkedInJobDetailsRoot() {
    const selectors = [
      '.jobs-search__job-details--container',
      '.jobs-search__job-details',
      '.jobs-details',
      '.job-view-layout',
      '.jobs-details__main-content',
      '.scaffold-layout__detail',
      '[data-view-name*="job-detail"]',
      '[data-testid*="job-detail"]',
    ].join(', ')
    const candidates = Array.from(document.querySelectorAll(selectors)).filter(isVisible)
    if (!candidates.length) return null

    function scoreCandidate(root) {
      const text = cleanText(root.innerText || '')
      const buttons = Array.from(root.querySelectorAll('a, button, [role="button"]'))
        .map((element) => cleanText(element.textContent || element.getAttribute('aria-label')))
        .join(' ')
      const rect = root.getBoundingClientRect()
      const jobCardLinks = root.querySelectorAll('a[href*="/jobs/view/"]').length
      const listItems = root.querySelectorAll('li').length
      let score = 0
      if (/\bapply(?: now)?\b/i.test(buttons)) score += 12
      if (/about the job/i.test(text)) score += 8
      if (root.querySelector('.jobs-description__content, .jobs-box__html-content, #job-details, .jobs-description-content__text')) score += 7
      if (root.querySelector('h1')) score += 4
      if (/responses managed off linkedin|promoted by hirer/i.test(text)) score += 2
      if (rect.left > window.innerWidth * 0.3) score += 6
      if (jobCardLinks > 1) score -= Math.min(jobCardLinks, 12) * 4
      if (listItems > 12) score -= Math.min(listItems - 12, 12)
      if (/top job picks for you|\b\d+ results\b/i.test(text)) score -= 10
      return { root, score, area: rect.width * rect.height }
    }

    return candidates
      .map(scoreCandidate)
      .sort((a, b) => b.score - a.score || a.area - b.area)[0].root
  }

  function linkedInTextFromSelectors(root, selectors) {
    return selectors
      .map((selector) => firstVisible(selector, root)?.textContent)
      .map(cleanText)
      .filter(Boolean)
      .join('\n\n')
  }

  function linkedInFirstTextFromSelectors(root, selectors) {
    for (const selector of selectors) {
      const text = cleanText(firstVisible(selector, root)?.textContent)
      if (text) return text
    }
    return ''
  }

  function rightmostVisibleHeading() {
    return Array.from(document.querySelectorAll('h1, h2, [role="heading"]'))
      .filter(isVisible)
      .map((element) => ({ element, text: cleanText(element.textContent), left: element.getBoundingClientRect().left }))
      .filter(({ text }) => text && !/top job picks|search results|jobs/i.test(text))
      .sort((a, b) => b.left - a.left)[0]?.element || null
  }

  function rightmostVisibleJobTitle() {
    return Array.from(document.querySelectorAll([
      '[class*="job-title"]',
      '[class*="jobTitle"]',
      '[data-view-name*="job-title"]',
      '[data-testid*="job-title"]',
    ].join(', ')))
      .filter(isVisible)
      .map((element) => ({ element, text: cleanText(element.textContent), left: element.getBoundingClientRect().left }))
      .filter(({ text }) => text && text.length < 240 && !/top job picks|search results|\bresults\b|about the job/i.test(text))
      .sort((a, b) => b.left - a.left)[0]?.element || null
  }

  function selectedLinkedInJobTitle() {
    const cards = linkedInJobCards()
    const currentJobId = new URL(window.location.href).searchParams.get('currentJobId')
      || window.location.pathname.match(/\/jobs\/view\/(\d+)/i)?.[1]
    const selected = cards.find(({ anchor, card }) => {
      const selectedMarker = card.getAttribute('aria-selected') === 'true'
        || card.getAttribute('aria-current') === 'true'
        || card.getAttribute('data-selected') === 'true'
        || /active|selected/i.test(card.className || '')
      const idMatch = currentJobId && new URL(anchor.href).pathname.match(/\/jobs\/view\/(\d+)/i)?.[1] === currentJobId
      return Boolean(selectedMarker || idMatch)
    })
    return cleanText(selected?.anchor.textContent || '')
  }

  function visibleElement(element) {
    return element && isVisible(element)
  }

  window.a1JobsGetLinkedInShareLink = async function a1JobsGetLinkedInShareLink() {
    if (!isLinkedInJobsPage()) return { url: '', reason: 'Not a LinkedIn Jobs page.' }
    const shareButton = Array.from(document.querySelectorAll('button[aria-label="Share"], .social-share__dropdown-trigger'))
      .find(visibleElement)
    if (!shareButton) return { url: '', reason: 'The selected LinkedIn job does not have a visible Share button.' }

    shareButton.click()
    await new Promise((resolve) => setTimeout(resolve, 250))

    const menuItems = Array.from(document.querySelectorAll('a, button, [role="menuitem"], input'))
      .filter(visibleElement)
    const copyItem = menuItems.find((element) => /copy link|copy link to share/i.test(cleanText(element.textContent || element.getAttribute('aria-label') || element.value)))
    const directLink = copyItem?.href
      || copyItem?.getAttribute('data-url')
      || copyItem?.closest('[data-url]')?.getAttribute('data-url')
      || Array.from(document.querySelectorAll('input, textarea'))
        .filter(visibleElement)
        .map((element) => element.value)
        .find((value) => /^https?:\/\//i.test(value || ''))
    if (directLink) return { url: directLink, source: 'linkedin-share' }

    if (copyItem) {
      copyItem.click()
      await new Promise((resolve) => setTimeout(resolve, 100))
      try {
        const copied = await navigator.clipboard.readText()
        if (/^https?:\/\//i.test(copied)) return { url: copied, source: 'linkedin-share-clipboard' }
      } catch {
        // Clipboard access can be blocked by the browser; the caller reports a manual fallback.
      }
    }
    return { url: '', reason: 'LinkedIn opened Share, but no job link was available to copy.' }
  }

  function linkedInJobSnapshot() {
    const root = linkedInJobDetailsRoot()
    if (!root) return null
    const title = linkedInFirstTextFromSelectors(root, [
      '.job-details-jobs-unified-top-card__job-title',
      '.jobs-unified-top-card__job-title',
      'h1',
    ])
      || cleanText(rightmostVisibleJobTitle()?.textContent)
      || cleanText(rightmostVisibleHeading()?.textContent)
      || selectedLinkedInJobTitle()
    const company = linkedInFirstTextFromSelectors(root, [
      '.job-details-jobs-unified-top-card__company-name',
      '.jobs-unified-top-card__company-name',
      '.jobs-unified-top-card__subtitle-primary-grouping a',
      '.job-details-jobs-unified-top-card__primary-description-container a',
    ])
    const location = linkedInFirstTextFromSelectors(root, [
      '.job-details-jobs-unified-top-card__primary-description-container',
      '.jobs-unified-top-card__bullet',
      '.jobs-unified-top-card__workplace-type',
    ])
    const description = linkedInTextFromSelectors(root, [
      '.jobs-description__content',
      '.jobs-box__html-content',
      '#job-details',
      '.jobs-description-content__text',
    ]) || visibleTextFrom(root)
    return {
      root,
      title,
      company,
      location,
      description,
      focusedText: cleanText([title, company, location, description].filter(Boolean).join('\n\n')),
    }
  }

  function primaryPageText() {
    const linkedInJob = isLinkedInJobsPage() ? linkedInJobSnapshot() : null
    if (linkedInJob?.focusedText) return linkedInJob.focusedText
    const root = document.querySelector('main, [role="main"], article, [data-automation-id*="job"], [class*="job"]') || document.body
    return visibleTextFrom(root)
  }

  function allPageText() {
    const linkedInJob = isLinkedInJobsPage() ? linkedInJobSnapshot() : null
    if (linkedInJob?.focusedText) return linkedInJob.focusedText
    return visibleTextFrom(document.body)
  }

  function metaTags() {
    return Array.from(document.querySelectorAll('meta[name], meta[property]'))
      .map((node) => ({
        name: node.getAttribute('name') || node.getAttribute('property') || '',
        content: shortText(node.content),
      }))
      .filter((item) => item.name && item.content)
      .slice(0, MAX_ITEMS)
  }

  function jobContentRoot() {
    return isLinkedInJobsPage() ? (linkedInJobDetailsRoot() || document) : document
  }

  function headings(root = document) {
    return Array.from(root.querySelectorAll('h1, h2, h3'))
      .filter(isVisible)
      .map((node) => ({ level: node.tagName.toLowerCase(), text: shortText(node.textContent) }))
      .filter((item) => item.text)
      .slice(0, MAX_ITEMS)
  }

  function pageLinks(root = document) {
    return Array.from(root.querySelectorAll('a[href]'))
      .filter(isVisible)
      .map((element) => ({
        label: shortText(element.textContent || element.getAttribute('aria-label')),
        href: shortText(element.href, 1200),
      }))
      .filter((item) => item.label || item.href)
      .slice(0, MAX_ITEMS)
  }

  function pageButtons(root = document) {
    return Array.from(root.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]'))
      .filter(isVisible)
      .map((element) => shortText(element.textContent || element.getAttribute('aria-label') || element.value))
      .filter(Boolean)
      .slice(0, MAX_ITEMS)
  }

  function fieldLabel(element) {
    const labels = []
    if (element.labels) labels.push(...Array.from(element.labels).map((label) => label.textContent))
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      for (const id of labelledBy.split(/\s+/)) labels.push(document.getElementById(id)?.textContent)
    }
    labels.push(
      element.getAttribute('aria-label'),
      element.closest('label')?.textContent,
      element.placeholder,
      element.name,
      element.id,
    )
    return cleanText(labels.find((value) => cleanText(value)) || '')
  }

  function formFields(root = document) {
    return Array.from(root.querySelectorAll('input, textarea, select, [contenteditable="true"]'))
      .filter(isVisible)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        type: element.type || element.tagName.toLowerCase(),
        label: shortText(fieldLabel(element)),
        name: shortText(element.name || ''),
        required: Boolean(element.required || element.getAttribute('aria-required') === 'true'),
      }))
      .filter((item) => item.label || item.name)
      .slice(0, MAX_ITEMS)
  }

  function applyLinks(root = document) {
    return Array.from(root.querySelectorAll('a[href], button'))
      .map((element) => {
        const label = shortText(element.textContent || element.getAttribute('aria-label') || element.value)
        const originalHref = shortText(element.href || '', 1200)
        let resolvedHref = originalHref
        try {
          const link = new URL(originalHref, window.location.href)
          const destination = link.searchParams.get('url')
          if (destination) resolvedHref = new URL(destination, window.location.href).href
        } catch {
          // Keep the original link when it cannot be resolved safely.
        }
        return { label, href: resolvedHref, originalHref, resolvedHref }
      })
      .filter((item) => /apply|application|submit/i.test(`${item.label} ${item.href}`))
      .slice(0, 8)
  }

  function linkedInJobCards() {
    const seen = new Set()
    return Array.from(document.querySelectorAll('a[href*="/jobs/view/"]'))
      .filter(isVisible)
      .map((anchor) => {
        const card = anchor.closest('li, [data-occludable-job-id], .job-card-container, .jobs-search-results__list-item') || anchor
        return { anchor, card }
      })
      .filter(({ anchor, card }) => {
        const key = anchor.href || card
        if (seen.has(key)) return false
        seen.add(key)
        return isVisible(card)
      })
  }

  window.a1JobsReadJobPage = function a1JobsReadJobPage() {
    const posting = jobPostingFromJsonLd()
    const linkedInJob = isLinkedInJobsPage() ? linkedInJobSnapshot() : null
    const root = linkedInJob?.root || jobContentRoot()
    const focusedText = primaryPageText()
    const fullText = allPageText()
    const structuredDescription = textFromHtml(posting?.description || '')
    const title = cleanText(posting?.title || linkedInJob?.title || (isLinkedInJobsPage() ? '' : firstVisible('h1', root)?.textContent || meta('og:title') || document.title))
    const company = cleanText(posting?.hiringOrganization?.name || linkedInJob?.company || meta('og:site_name'))
    const location = cleanText(locationFromJobPosting(posting) || linkedInJob?.location)
    const salaryRange = salaryFromJobPosting(posting)
    const jobDescription = cleanText([
      structuredDescription,
      isLinkedInJobsPage() ? linkedInJob?.focusedText : focusedText,
      isLinkedInJobsPage() ? '' : fullText,
    ].filter(Boolean).join('\n\n')).slice(0, MAX_TEXT_LENGTH)

    return {
      schemaVersion: 1,
      source: 'browser-extension-job-page',
      url: window.location.href,
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || '',
      pageTitle: document.title,
      title,
      company,
      location,
      salaryRange,
      jobDescription,
      text: jobDescription,
      pageDetails: {
        meta: metaTags(),
        headings: headings(root),
        links: pageLinks(root),
        buttons: pageButtons(root),
        formFields: formFields(root),
        focusedText: focusedText.slice(0, MAX_TEXT_LENGTH),
        fullText: fullText.slice(0, MAX_TEXT_LENGTH),
      },
      applyLinks: applyLinks(root),
      structuredJobPosting: posting ? {
        title: posting.title || '',
        company,
        location,
        salaryRange,
        employmentType: Array.isArray(posting.employmentType) ? posting.employmentType.join(', ') : (posting.employmentType || ''),
        datePosted: posting.datePosted || '',
        validThrough: posting.validThrough || '',
      } : {},
      scannedAt: new Date().toISOString(),
    }
  }
})()
