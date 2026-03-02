import { describe, expect, it } from 'vitest'
import { generateOpenApiArtifacts, parseOpenApiContent } from '@simplutils/openapi-helper-core'

describe('openapi helper core', () => {
  it('generates schemas, resources, and stores from complete openapi payload', () => {
    const spec = parseOpenApiContent(`
openapi: 3.0.3
info:
  title: Test
  version: 1.0.0
components:
  schemas:
    User:
      type: object
      required: [id, name]
      properties:
        id: { type: string }
        name: { type: string }
`)
    const generated = generateOpenApiArtifacts(spec)

    expect(generated.schemas).toContain('export const User = z.object')
    expect(generated.types).toContain('export type User = z.infer<typeof User>')
    expect(generated.resources).toContain('export const userResource = resource<User>(')
    expect(generated.stores).toContain('export const useUserStore = createResourceStore(userResource)')
    expect(generated.fullFile).toContain("import { z } from 'zod'")
  })
})
