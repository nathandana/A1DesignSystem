(() => {
  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function isVisible(element) {
    if (element.type === 'hidden') return false
    const style = window.getComputedStyle(element)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(value)
    return String(value).replace(/["\\#.:,[\]>+~*^$|=]/g, '\\$&')
  }

  function selectorFor(element) {
    if (element.id) return `#${cssEscape(element.id)}`
    if (element.name) {
      const tag = element.tagName.toLocaleLowerCase()
      return `${tag}[name="${cssEscape(element.name)}"]`
    }

    const path = []
    let node = element
    while (node && node.nodeType === Node.ELEMENT_NODE && path.length < 5) {
      const tag = node.tagName.toLocaleLowerCase()
      const parent = node.parentElement
      if (!parent) {
        path.unshift(tag)
        break
      }
      const siblings = Array.from(parent.children).filter((child) => child.tagName === node.tagName)
      const index = siblings.indexOf(node) + 1
      path.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag)
      node = parent
    }
    return path.join(' > ')
  }

  function directText(element) {
    return cleanText(Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join(' '))
  }

  function labelFor(element) {
    const labels = []
    if (element.labels) {
      labels.push(...Array.from(element.labels).map((label) => cleanText(label.textContent)))
    }
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      for (const id of labelledBy.split(/\s+/)) {
        const node = document.getElementById(id)
        if (node) labels.push(cleanText(node.textContent))
      }
    }
    labels.push(
      element.getAttribute('aria-label'),
      element.closest('label')?.textContent,
      element.closest('[role="group"], fieldset')?.querySelector('legend')?.textContent,
      element.placeholder,
      element.name,
      element.id,
    )
    const nearby = element.parentElement
    if (nearby) {
      labels.push(
        nearby.querySelector('label')?.textContent,
        directText(nearby),
      )
    }
    return cleanText(Array.from(new Set(labels.map(cleanText).filter(Boolean))).slice(0, 4).join(' - '))
  }

  function formIndexFor(element) {
    if (!element.form) return -1
    return Array.from(document.forms).indexOf(element.form)
  }

  function optionList(element) {
    if (element.tagName.toLocaleLowerCase() !== 'select') return []
    return Array.from(element.options).map((option) => ({
      value: option.value,
      label: cleanText(option.textContent),
      selected: option.selected,
    }))
  }

  function submissionError() {
    const alertText = cleanText(Array.from(document.querySelectorAll('[role="alert"], [aria-live]'))
      .map((element) => element.textContent)
      .join(' '))
    const pageText = cleanText(`${document.title} ${alertText} ${document.body?.innerText || ''}`).slice(0, 5000)
    const patterns = [
      /couldn't submit your application/i,
      /could not submit your application/i,
      /application submission was flagged as possible spam/i,
      /flagged as possible spam/i,
      /please submit your application again/i,
    ]
    const match = patterns.find((pattern) => pattern.test(pageText))
    if (!match) return null
    const message = alertText || pageText.match(/.{0,80}(?:couldn't submit|flagged as possible spam|submit your application again).{0,240}/i)?.[0]
    return {
      kind: 'submission-rejected',
      message: cleanText(message || 'The application site rejected the submission as possible spam.'),
    }
  }

  function fieldFromElement(element, index) {
    const tag = element.tagName.toLocaleLowerCase()
    const type = tag === 'input' ? (element.type || 'text') : tag
    return {
      fieldId: `field-${index + 1}`,
      selector: selectorFor(element),
      formIndex: formIndexFor(element),
      tag,
      type,
      name: element.name || '',
      id: element.id || '',
      autocomplete: element.autocomplete || '',
      label: labelFor(element),
      placeholder: element.placeholder || '',
      required: Boolean(element.required || element.getAttribute('aria-required') === 'true'),
      disabled: Boolean(element.disabled),
      readOnly: Boolean(element.readOnly),
      value: type === 'password' || type === 'file' ? '' : (element.value || ''),
      options: optionList(element),
      accept: type === 'file' ? (element.accept || '') : '',
      multiple: Boolean(element.multiple),
      maxLength: Number.isFinite(element.maxLength) && element.maxLength > 0 ? element.maxLength : null,
      needsManualUpload: type === 'file',
    }
  }

  window.a1JobsScanForm = function a1JobsScanForm() {
    const controls = Array.from(document.querySelectorAll('input, textarea, select, [contenteditable="true"]'))
      .filter((element) => !element.disabled && isVisible(element))

    return {
      schemaVersion: 1,
      url: window.location.href,
      title: document.title,
      scannedAt: new Date().toISOString(),
      submissionError: submissionError(),
      formCount: document.forms.length,
      fields: controls.map(fieldFromElement),
      submitButtons: Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'))
        .filter(isVisible)
        .map((button, index) => ({
          buttonId: `button-${index + 1}`,
          selector: selectorFor(button),
          type: button.type || '',
          label: cleanText(button.textContent || button.value || button.getAttribute('aria-label')),
        })),
    }
  }
})()
