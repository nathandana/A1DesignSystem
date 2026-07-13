import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { json, options } from './_utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '../..')
const resumesDir = resolve(appRoot, 'resumes')

function safeResumePath(name) {
  const filename = basename(String(name || ''))
  if (!filename || !/\.pdf$/i.test(filename)) throw new Error('Only generated PDF files can be read.')
  return resolve(resumesDir, filename)
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const filename = event.queryStringParameters?.name
    const path = safeResumePath(filename)
    if (!path.startsWith(`${resumesDir}/`)) throw new Error('File is outside the resumes folder.')
    const buffer = await readFile(path)
    return json(200, {
      result: {
        filename: basename(path),
        mimeType: 'application/pdf',
        base64: buffer.toString('base64'),
      },
    })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
