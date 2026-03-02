#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { generateOpenApiArtifacts, parseOpenApiContent } from '@simplutils/openapi-helper-core'

const DEFAULT_INPUT = './openapi/schema.yaml'
const DEFAULT_OUTPUT = './openapi/generated.ts'

const args = parseArgs(process.argv.slice(2))
const cwd = process.cwd()
const inputPath = path.resolve(cwd, args.input ?? DEFAULT_INPUT)
const outputPath = path.resolve(cwd, args.output ?? DEFAULT_OUTPUT)

const source = readFileOrThrow(inputPath)
const spec = parseOpenApiContent(source, inputPath)
const artifacts = generateOpenApiArtifacts(spec)

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, artifacts.fullFile)

console.log(`Generated ${artifacts.schemaCount} schema(s) and ${artifacts.resourceCount} resource/store pair(s).`)
console.log(`Output: ${outputPath}`)

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i]
    if (current === '--input' || current === '-i') {
      out.input = argv[i + 1]
      i += 1
      continue
    }
    if (current === '--output' || current === '-o') {
      out.output = argv[i + 1]
      i += 1
      continue
    }
  }
  return out
}

function readFileOrThrow(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`OpenAPI file not found: ${filePath}`)
  }
  return fs.readFileSync(filePath, 'utf8')
}

