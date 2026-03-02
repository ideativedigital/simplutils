export type ResourceConfig = {
  schema: string
  resourceName: string
  storeName: string
  urlPrefix: string
}

export type GeneratedArtifacts = {
  schemas: string
  types: string
  resources: string
  stores: string
  fullFile: string
  schemaCount: number
  resourceCount: number
}

export declare function parseOpenApiContent(content: string, sourceName?: string): Record<string, unknown>
export declare function generateOpenApiArtifacts(spec: Record<string, unknown>): GeneratedArtifacts
