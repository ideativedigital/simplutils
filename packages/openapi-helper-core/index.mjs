import { parse as parseYaml } from 'yaml'

export function parseOpenApiContent(content, sourceName = 'openapi.yaml') {
  const isJson = sourceName.toLowerCase().endsWith('.json')
  return isJson ? JSON.parse(content) : parseYaml(content)
}

export function generateOpenApiArtifacts(spec) {
  const schemas = getSchemasOrThrow(spec)
  const schemaNames = Object.keys(schemas)
  if (schemaNames.length === 0) {
    throw new Error('No schemas found in OpenAPI components.schemas.')
  }
  const resources = resolveResourceConfigs(spec, schemaNames)

  const schemaLines = []
  const typeLines = []
  for (const [rawSchemaName, schema] of Object.entries(schemas)) {
    const schemaName = toPascalIdentifier(rawSchemaName)
    schemaLines.push(`export const ${schemaName} = ${schemaToZod(schema)}`)
    typeLines.push(`export type ${schemaName} = z.infer<typeof ${schemaName}>`)
  }

  const resourceLines = []
  const storeLines = []
  for (const resourceConfig of resources) {
    const schemaName = toPascalIdentifier(resourceConfig.schema)
    resourceLines.push(
      `export const ${resourceConfig.resourceName} = resource<${schemaName}>(${JSON.stringify(resourceConfig.urlPrefix)}, { parser: ${schemaName} })`
    )
    storeLines.push(`export const ${resourceConfig.storeName} = createResourceStore(${resourceConfig.resourceName})`)
  }

  const fullFileLines = [
    '// AUTO-GENERATED FILE. DO NOT EDIT.',
    "import { z } from 'zod'",
    "import { resource } from '@ideative/simplutils/resource'",
    "import { createResourceStore } from '@ideative/simplutils/zustand'",
    '',
    ...schemaLines,
    '',
    ...typeLines,
    '',
    ...resourceLines,
    '',
    ...storeLines
  ]

  return {
    schemas: schemaLines.join('\n'),
    types: typeLines.join('\n'),
    resources: resourceLines.join('\n'),
    stores: storeLines.join('\n'),
    fullFile: `${fullFileLines.join('\n').trimEnd()}\n`,
    schemaCount: schemaNames.length,
    resourceCount: resources.length
  }
}

function getSchemasOrThrow(spec) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('Invalid OpenAPI payload.')
  }
  const components = spec.components
  if (!components || typeof components !== 'object') {
    throw new Error('Missing "components" section.')
  }
  const schemas = components.schemas
  if (!schemas || typeof schemas !== 'object') {
    throw new Error('Missing "components.schemas" section.')
  }
  return schemas
}

function resolveResourceConfigs(spec, schemaNames) {
  const configured = spec?.['x-simplutils']?.resources
  if (!Array.isArray(configured) || configured.length === 0) {
    return schemaNames.map(schemaName => ({
      schema: schemaName,
      resourceName: `${toCamelIdentifier(schemaName)}Resource`,
      storeName: ensureUseStoreName(`${toCamelIdentifier(schemaName)}Store`),
      urlPrefix: defaultUrlPrefix(schemaName)
    }))
  }

  return configured.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || typeof entry.schema !== 'string') {
      throw new Error(`x-simplutils.resources[${index}] must contain a "schema" string.`)
    }
    if (!schemaNames.includes(entry.schema)) {
      throw new Error(`x-simplutils.resources[${index}] references unknown schema "${entry.schema}".`)
    }
    return {
      schema: entry.schema,
      resourceName: toCamelIdentifier(entry.resourceName ?? `${toCamelIdentifier(entry.schema)}Resource`),
      storeName: ensureUseStoreName(entry.storeName ?? `${toCamelIdentifier(entry.schema)}Store`),
      urlPrefix: entry.urlPrefix ?? defaultUrlPrefix(entry.schema)
    }
  })
}

function ensureUseStoreName(rawStoreName) {
  const name = toCamelIdentifier(rawStoreName)
  return /^use[A-Z]/.test(name) ? name : `use${name[0].toUpperCase()}${name.slice(1)}`
}

function schemaToZod(schema) {
  if (!schema || typeof schema !== 'object') {
    return 'z.unknown()'
  }

  if (typeof schema.$ref === 'string') {
    return toPascalIdentifier(refToSchemaName(schema.$ref))
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    const allStrings = schema.enum.every(value => typeof value === 'string')
    let base
    if (allStrings) {
      const values = schema.enum.map(value => JSON.stringify(value)).join(', ')
      base = `z.enum([${values}])`
    } else {
      base = `z.union([${schema.enum.map(value => `z.literal(${JSON.stringify(value)})`).join(', ')}])`
    }
    return applyCommonModifiers(base, schema)
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return applyCommonModifiers(`z.union([${schema.oneOf.map(part => schemaToZod(part)).join(', ')}])`, schema)
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return applyCommonModifiers(`z.union([${schema.anyOf.map(part => schemaToZod(part)).join(', ')}])`, schema)
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    const [first, ...rest] = schema.allOf.map(part => schemaToZod(part))
    const merged = rest.reduce((acc, current) => `${acc}.and(${current})`, first)
    return applyCommonModifiers(merged, schema)
  }

  const type = inferSchemaType(schema)

  if (type === 'string') {
    let expr = 'z.string()'
    if (typeof schema.minLength === 'number') expr += `.min(${schema.minLength})`
    if (typeof schema.maxLength === 'number') expr += `.max(${schema.maxLength})`
    return applyCommonModifiers(expr, schema)
  }

  if (type === 'number' || type === 'integer') {
    let expr = 'z.number()'
    if (type === 'integer') expr += '.int()'
    if (typeof schema.minimum === 'number') expr += `.min(${schema.minimum})`
    if (typeof schema.maximum === 'number') expr += `.max(${schema.maximum})`
    if (typeof schema.exclusiveMinimum === 'number') expr += `.gt(${schema.exclusiveMinimum})`
    if (typeof schema.exclusiveMaximum === 'number') expr += `.lt(${schema.exclusiveMaximum})`
    return applyCommonModifiers(expr, schema)
  }

  if (type === 'boolean') {
    return applyCommonModifiers('z.boolean()', schema)
  }

  if (type === 'array') {
    const itemType = schemaToZod(schema.items)
    let expr = `z.array(${itemType})`
    if (typeof schema.minItems === 'number') expr += `.min(${schema.minItems})`
    if (typeof schema.maxItems === 'number') expr += `.max(${schema.maxItems})`
    return applyCommonModifiers(expr, schema)
  }

  if (type === 'object') {
    const required = new Set(Array.isArray(schema.required) ? schema.required : [])
    const properties = schema.properties && typeof schema.properties === 'object'
      ? Object.entries(schema.properties)
      : []
    const entries = properties.map(([key, value]) => {
      let propExpr = schemaToZod(value)
      if (!required.has(key)) propExpr += '.optional()'
      return `${JSON.stringify(key)}: ${propExpr}`
    })
    let expr = `z.object({${entries.length > 0 ? `\n  ${entries.join(',\n  ')}\n` : ''}})`

    if (schema.additionalProperties === true) {
      expr += '.catchall(z.unknown())'
    } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      expr += `.catchall(${schemaToZod(schema.additionalProperties)})`
    }
    return applyCommonModifiers(expr, schema)
  }

  return applyCommonModifiers('z.unknown()', schema)
}

function inferSchemaType(schema) {
  if (typeof schema.type === 'string') return schema.type
  if (schema.properties || schema.additionalProperties) return 'object'
  if (schema.items) return 'array'
  return 'unknown'
}

function applyCommonModifiers(base, schema) {
  let expr = base
  if (schema.nullable === true) expr += '.nullable()'
  if (Object.prototype.hasOwnProperty.call(schema, 'default')) {
    const serialized = JSON.stringify(schema.default)
    if (serialized !== undefined) expr += `.default(${serialized})`
  }
  return expr
}

function refToSchemaName(ref) {
  if (!ref.startsWith('#/components/schemas/')) {
    throw new Error(`Unsupported $ref format: ${ref}`)
  }
  return ref.slice('#/components/schemas/'.length)
}

function toPascalIdentifier(value) {
  return ensureValidIdentifier(splitWords(value).map(capitalize).join(''))
}

function toCamelIdentifier(value) {
  const words = splitWords(value)
  if (words.length === 0) return 'item'
  return ensureValidIdentifier(words.map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word))).join(''))
}

function defaultUrlPrefix(schemaName) {
  return `/${splitWords(schemaName).map(word => word.toLowerCase()).join('-')}s`
}

function splitWords(input) {
  return String(input)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function capitalize(value) {
  return value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}` : value
}

function ensureValidIdentifier(raw) {
  const safe = raw.length === 0 ? 'item' : raw
  if (/^[0-9]/.test(safe)) return `_${safe}`
  if (safe === 'default') return '_default'
  return safe
}
