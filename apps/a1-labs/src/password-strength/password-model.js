// Password strength model for the Labs meter. A local, deterministic estimate:
// nothing is sent anywhere. It measures how many guesses an attacker would
// need, assuming they try common passwords and patterns first, then every
// combination of the character types used. It is a teaching estimate, not a
// replacement for a server-side breached-password check.

/** Frequently breached passwords and words (checked after undoing look-alike swaps). */
export const COMMON = [
  'password', 'passw0rd', '123456', '12345678', '123456789', 'qwerty', 'qwertyuiop', 'asdfgh', 'zxcvbn',
  'letmein', 'welcome', 'admin', 'login', 'iloveyou', 'monkey', 'dragon', 'football', 'baseball',
  'sunshine', 'princess', 'shadow', 'master', 'superman', 'batman', 'trustno1', 'whatever', 'freedom',
  'summer', 'winter', 'spring', 'autumn', 'secret', 'hello', 'charlie', 'michael', 'jennifer', 'abc123',
  'starwars', 'pokemon', 'computer', 'internet', 'cheese', 'flower', 'hunter', 'soccer', 'killer',
]

const LOOK_ALIKES = { 0: 'o', 1: 'l', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's', '!': 'i' }
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890']
const GUESSES_PER_SECOND = 1e10 // an offline attack on a fast hash

/** Level names for 3, 4 or 5 levels, weakest first. */
export const LEVEL_NAMES = {
  3: ['Weak', 'Fair', 'Strong'],
  4: ['Weak', 'Fair', 'Good', 'Strong'],
  5: ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'],
}
// How the five underlying grades fold into fewer levels.
const FOLD = { 3: [0, 0, 1, 2, 2], 4: [0, 0, 1, 2, 3], 5: [0, 1, 2, 3, 4] }
// Entropy thresholds (bits) between the five grades.
const GRADE_BITS = [28, 40, 60, 80]
// Bits at which a continuous bar is full.
export const FULL_BITS = 100

const unswap = text => [...text].map(char => LOOK_ALIKES[char] ?? char).join('')

function poolSize(password) {
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[ -/:-@[-`{-~]/.test(password)) pool += 33
  if (/[^\x00-\x7f]/.test(password)) pool += 100
  return pool
}

const adjacent = (a, b) => {
  if (Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 1) return true
  return KEYBOARD_ROWS.some(row => { const i = row.indexOf(a); return i >= 0 && (row[i + 1] === b || row[i - 1] === b) })
}

/**
 * Characters that add little: repeats ("aaa") and runs ("abc", "123", "qwe")
 * after their first two characters count a quarter each.
 * @returns {{ length: number, repeats: boolean, sequence: boolean }}
 */
export function effectiveLength(password) {
  const chars = [...password.toLowerCase()]
  let length = 0
  let repeats = false
  let sequence = false
  chars.forEach((char, i) => {
    const repeat = i >= 2 && char === chars[i - 1] && char === chars[i - 2]
    const run = i >= 2 && adjacent(chars[i - 2], chars[i - 1]) && adjacent(chars[i - 1], char)
    if (repeat) repeats = true
    if (run && !repeat) sequence = true
    length += repeat || run ? 0.25 : 1
  })
  return { length, repeats, sequence }
}

/** The longest common password or word contained in the password, or ''. */
export function commonWord(password) {
  const plain = unswap(password.toLowerCase())
  return COMMON.filter(word => plain.includes(word)).sort((a, b) => b.length - a.length)[0] ?? ''
}

/** Human description of a time in seconds: "instantly", "about 3 hours", "centuries". */
export function describeTime(seconds) {
  if (seconds < 1) return 'instantly'
  const units = [['second', 60], ['minute', 60], ['hour', 24], ['day', 30], ['month', 12], ['year', 100]]
  let value = seconds
  for (const [unit, size] of units) {
    if (value < size) { const n = Math.round(value); return `about ${n} ${unit}${n === 1 ? '' : 's'}` }
    value /= size
  }
  return 'centuries'
}

/**
 * @param {string} password
 * @param {{ minLength?: number, require?: Array<'lower'|'upper'|'number'|'symbol'> }} [rules]
 * @returns {{ empty: boolean, bits: number, grade: number, crackSeconds: number,
 *   checks: Array<{ id: string, label: string, met: boolean }>, meetsRules: boolean,
 *   common: string, repeats: boolean, sequence: boolean, suggestions: Array<{ id: string, text: string }> }}
 *   Suggestions are in priority order; show the first one or two.
 */
export function analysePassword(password, { minLength = 12, require = [] } = {}) {
  const { length, repeats, sequence } = effectiveLength(password)
  const common = commonWord(password)
  let usefulLength = length
  // A common word is one guess from a list, not one guess per character.
  if (common) usefulLength = Math.max(0, usefulLength - common.length + 1)
  const exact = common && unswap(password.toLowerCase()).replace(/[^a-z]/g, '') === common
  const bits = password ? (exact ? Math.min(10, usefulLength * Math.log2(poolSize(password))) : usefulLength * Math.log2(poolSize(password))) : 0
  const grade = GRADE_BITS.filter(limit => bits >= limit).length
  const characters = [...password].length

  const checks = [
    { id: 'length', label: `At least ${minLength} characters`, met: characters >= minLength },
    ...[
      ['lower', 'A lowercase letter', /[a-z]/],
      ['upper', 'An uppercase letter', /[A-Z]/],
      ['number', 'A number', /[0-9]/],
      ['symbol', 'A symbol, such as ! or #', /[^A-Za-z0-9\s]/],
    ].filter(([id]) => require.includes(id)).map(([id, label, pattern]) => ({ id, label, met: pattern.test(password) })),
  ]

  const suggestions = []
  if (common) suggestions.push({ id: 'common', text: 'Avoid common passwords and words, even with numbers or symbols swapped in.' })
  if (characters < minLength) suggestions.push({ id: 'length', text: `Use at least ${minLength} characters.` })
  if (repeats || sequence) suggestions.push({ id: 'pattern', text: 'Avoid repeated characters and runs like abc, 123 or qwerty.' })
  if (grade < 3) suggestions.push({ id: 'words', text: 'Try three or four unrelated words: length beats complexity.' })

  return {
    empty: password.length === 0,
    bits,
    grade,
    crackSeconds: 2 ** bits / 2 / GUESSES_PER_SECOND,
    checks,
    meetsRules: checks.every(check => check.met),
    common,
    repeats,
    sequence,
    suggestions,
  }
}

/** The level (0-based) a five-step grade falls in when showing 3, 4 or 5 levels. */
export const levelFor = (grade, levels) => FOLD[levels][grade]

/** A1 status tone for a level: weakest levels are errors, the top is success. */
export function toneFor(level, levels) {
  if (level === levels - 1 || (levels === 5 && level === 3)) return 'success'
  if (level === 0 || (levels === 5 && level === 1)) return 'error'
  return levels === 4 && level === 2 ? 'info' : 'warn'
}
