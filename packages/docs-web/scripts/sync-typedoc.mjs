import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const source = path.resolve(root, '../docs/site')
const target = path.resolve(root, 'public/docs')

if (!fs.existsSync(source)) {
  console.warn(`TypeDoc output not found at ${source}. Skipping docs sync.`)
  process.exit(0)
}

fs.rmSync(target, { recursive: true, force: true })
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.cpSync(source, target, { recursive: true })
console.log(`Synced TypeDoc assets to ${target}`)
