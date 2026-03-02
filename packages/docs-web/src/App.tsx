import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  Link,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useMemo, useState, type ChangeEventHandler } from 'react'
import { generateOpenApiArtifacts, parseOpenApiContent } from '@simplutils/openapi-helper-core'
import { OPENAPI_EXAMPLE } from './openapi-example'
import { CodeSegment } from './CodeSegment'

type Artifacts = ReturnType<typeof generateOpenApiArtifacts>
const DOCS_PATH = `${import.meta.env.BASE_URL}docs/index.html`

function download(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [sourceName, setSourceName] = useState('openapi.yaml')
  const [content, setContent] = useState(OPENAPI_EXAMPLE)
  const [error, setError] = useState<string | null>(null)
  const [artifacts, setArtifacts] = useState<Artifacts | null>(null)

  const generatedLabel = useMemo(() => {
    if (!artifacts) return null
    return `${artifacts.schemaCount} schema(s), ${artifacts.resourceCount} resource/store pair(s)`
  }, [artifacts])

  const schemasWithTypes = useMemo(() => {
    if (!artifacts) return ''
    const schemas = artifacts.schemas?.trim() ?? ''
    const types = artifacts.types?.trim() ?? ''
    if (!schemas && !types) return ''
    if (!types) return schemas
    if (!schemas) return types
    return `${schemas}\n\n// Type Aliases\n${types}`
  }, [artifacts])

  const onGenerate = () => {
    try {
      setError(null)
      const spec = parseOpenApiContent(content, sourceName)
      const output = generateOpenApiArtifacts(spec)
      setArtifacts(output)
    } catch (unknownError) {
      setArtifacts(null)
      setError(unknownError instanceof Error ? unknownError.message : 'Unknown generation error.')
    }
  }

  const onUpload: ChangeEventHandler<HTMLInputElement> = event => {
    const file = event.target.files?.[0]
    if (!file) return
    setSourceName(file.name)
    file.text().then(setContent).catch(() => {
      setError('Unable to read selected file.')
    })
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={6} align="stretch">
        <VStack align="start" gap={2}>
          <Heading size="lg">Simplutils OpenAPI Helper</Heading>
          <Text color="gray.400">
            Generate Zod schemas, resource clients, and zustand stores from OpenAPI.
          </Text>
          <Link href={DOCS_PATH} target="_blank" rel="noreferrer">
            Open API docs (/docs/)
          </Link>
        </VStack>

        <VStack gap={4} align="stretch">
          <Text fontSize="sm" color="gray.400">
            Paste or upload a complete OpenAPI file. Generator reads `components.schemas` and produces Zod schemas/types, resources, and stores.
          </Text>
          <HStack>
            <Input type="file" accept=".yaml,.yml,.json" onChange={onUpload} />
            <Button onClick={() => setContent(OPENAPI_EXAMPLE)} variant="outline">
              Load example
            </Button>
            <Button colorScheme="teal" onClick={onGenerate}>
              Generate
            </Button>
            <Button
              variant="outline"
              onClick={() => artifacts && download('generated.ts', artifacts.fullFile)}
              disabled={!artifacts}
            >
              Download file
            </Button>
          </HStack>
          <Textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            minH="280px"
            fontFamily="mono"
            fontSize="sm"
          />
          {error ? <Box px={3} py={2} borderRadius="md" bg="red.900" color="red.100">{error}</Box> : null}
          {generatedLabel ? <Box px={3} py={2} borderRadius="md" bg="green.900" color="green.100">{generatedLabel}</Box> : null}

          <CodeSegment title="Zod Schemas + Type Aliases" code={schemasWithTypes} />

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
            <GridItem>
              <CodeSegment title="Resources" code={artifacts?.resources ?? ''} />
            </GridItem>
            <GridItem>
              <CodeSegment title="Stores" code={artifacts?.stores ?? ''} />
            </GridItem>
          </Grid>

          <CodeSegment title="Full Generated File" code={artifacts?.fullFile ?? ''} />
        </VStack>
      </VStack>
    </Container>
  )
}
