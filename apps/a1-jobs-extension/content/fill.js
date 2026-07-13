(() => {
  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function dispatchEditEvents(element) {
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }

  function booleanValue(value) {
    return ['1', 'true', 'yes', 'y', 'checked', 'on'].includes(String(value || '').trim().toLocaleLowerCase())
  }

  function foldedText(value) {
    return cleanText(value).toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(value)
    return String(value).replace(/["\\#.:,[\]>+~*^$|=]/g, '\\$&')
  }

  function selectOption(element, value) {
    const requested = cleanText(value)
    const requestedFolded = foldedText(requested)
    const match = Array.from(element.options).find((option) => {
      const optionText = foldedText(option.textContent)
      const optionValue = foldedText(option.value)
      return option.value === requested || cleanText(option.textContent) === requested
        || optionValue === requestedFolded
        || optionText === requestedFolded
        || (requestedFolded && optionText.includes(requestedFolded))
        || (optionText && requestedFolded.includes(optionText))
    })
    if (!match) return false
    element.value = match.value
    dispatchEditEvents(element)
    return true
  }

  function fieldById(fieldId) {
    const scan = window.a1JobsScanForm?.()
    const field = scan?.fields?.find((item) => item.fieldId === fieldId)
    if (!field) return null
    return document.querySelector(field.selector)
  }

  function targetFor(mapping) {
    if (mapping.selector) {
      const bySelector = document.querySelector(mapping.selector)
      if (bySelector) return bySelector
    }
    if (mapping.fieldId) return fieldById(mapping.fieldId)
    return null
  }

  function base64ToFile(attachment) {
    const binary = atob(attachment.base64)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    return new File([bytes], attachment.filename, { type: attachment.mimeType || 'application/pdf' })
  }

  function attachmentFor(mapping, fillPackage) {
    const kind = String(mapping.value || mapping.targetKey || '').toLocaleLowerCase()
    const attachments = Array.isArray(fillPackage?.attachments) ? fillPackage.attachments : []
    if (kind.includes('cover')) return attachments.find((attachment) => attachment.kind === 'cover_letter')
    if (kind.includes('resume') || kind.includes('cv')) return attachments.find((attachment) => attachment.kind === 'resume')
    return null
  }

  function fillElement(element, value, mapping, fillPackage) {
    const tag = element.tagName.toLocaleLowerCase()
    const type = tag === 'input' ? (element.type || 'text') : tag
    if (type === 'file') {
      const attachment = attachmentFor(mapping, fillPackage)
      if (!attachment?.base64) return { filled: false, reason: 'No matching generated PDF is available for upload.' }
      const transfer = new DataTransfer()
      transfer.items.add(base64ToFile(attachment))
      element.files = transfer.files
      dispatchEditEvents(element)
      return { filled: true, filename: attachment.filename }
    }
    if (element.disabled || element.readOnly) return { filled: false, reason: 'Field is disabled or read only.' }
    if (type === 'checkbox') {
      element.checked = booleanValue(value)
      dispatchEditEvents(element)
      return { filled: true }
    }
    if (type === 'radio') {
      const group = element.name
        ? Array.from(document.querySelectorAll(`input[type="radio"][name="${cssEscape(element.name)}"]`))
        : [element]
      const requested = cleanText(value).toLocaleLowerCase()
      const requestedFolded = foldedText(value)
      const match = group.find((radio) => {
        const label = radio.labels?.[0]?.textContent || ''
        const radioText = foldedText(label)
        const radioValue = foldedText(radio.value)
        return cleanText(radio.value).toLocaleLowerCase() === requested
          || cleanText(label).toLocaleLowerCase() === requested
          || radioValue === requestedFolded
          || radioText === requestedFolded
          || (requestedFolded && radioText.includes(requestedFolded))
          || (radioText && requestedFolded.includes(radioText))
      })
      if (!match) return { filled: false, reason: 'No matching radio option.' }
      match.checked = true
      dispatchEditEvents(match)
      return { filled: true }
    }
    if (tag === 'select') {
      return selectOption(element, value)
        ? { filled: true }
        : { filled: false, reason: 'No matching select option.' }
    }
    if (element.isContentEditable) {
      element.textContent = String(value ?? '')
      dispatchEditEvents(element)
      return { filled: true }
    }
    element.value = String(value ?? '')
    dispatchEditEvents(element)
    return { filled: true }
  }

  window.a1JobsFillFocusedValue = function a1JobsFillFocusedValue(value) {
    const element = document.activeElement
    if (!element || element === document.body || element === document.documentElement) {
      return { filled: false, reason: 'Click or tab into a form field first.' }
    }
    if (element.tagName?.toLocaleLowerCase() === 'input' && ['file', 'button', 'submit', 'reset'].includes(element.type)) {
      return { filled: false, reason: 'This field cannot receive text.' }
    }
    return {
      filled: true,
      ...fillElement(element, value, { targetKey: 'common-value' }, {}),
    }
  }

  function fillMapping(mapping, fillPackage) {
    if (mapping.needsReview) {
      return { fieldId: mapping.fieldId, label: mapping.label, filled: false, reason: mapping.reason || 'Needs review.' }
    }
    if (mapping.value == null || String(mapping.value) === '') {
      return { fieldId: mapping.fieldId, label: mapping.label, filled: false, reason: 'No value supplied.' }
    }
    const element = targetFor(mapping)
    if (!element) {
      return { fieldId: mapping.fieldId, label: mapping.label, filled: false, reason: 'Field not found on the active page.' }
    }
    return {
      fieldId: mapping.fieldId,
      label: mapping.label,
      ...fillElement(element, mapping.value, mapping, fillPackage),
    }
  }

  window.a1JobsFillField = function a1JobsFillField(mapping, fillPackage) {
    const result = fillMapping(mapping || {}, fillPackage || {})
    return {
      schemaVersion: 1,
      url: window.location.href,
      filledCount: result.filled ? 1 : 0,
      skippedCount: result.filled ? 0 : 1,
      results: [result],
      submitted: false,
    }
  }

  window.a1JobsFillForm = function a1JobsFillForm(fillPackage) {
    const mappings = Array.isArray(fillPackage?.mappings) ? fillPackage.mappings : []
    const results = mappings.map((mapping) => fillMapping(mapping, fillPackage))
    return {
      schemaVersion: 1,
      url: window.location.href,
      filledCount: results.filter((result) => result.filled).length,
      skippedCount: results.filter((result) => !result.filled).length,
      results,
      submitted: false,
    }
  }
})()
