import { Box, Clipboard, Heading, IconButton, Text } from '@chakra-ui/react'

type CodeSegmentProps = {
  title: string
  code: string
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const TS_KEYWORDS = /\b(import|from|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|throw|try|catch|finally|async|await|typeof|instanceof|extends|implements|interface|type|class)\b/g
const TS_TYPES = /\b(string|number|boolean|any|unknown|never|void|null|undefined|object|Record|Partial|Pick|Omit|ReturnType|Promise|Array)\b/g
const TS_NUMBERS = /\b\d+(\.\d+)?\b/g

const highlightTypeScript = (source: string): string => {
  let html = escapeHtml(source)

  const comments: string[] = []
  const strings: string[] = []

  html = html.replace(/\/\*[\s\S]*?\*\//g, token => {
    comments.push(token)
    return `__TS_COMMENT_${comments.length - 1}__`
  })

  html = html.replace(/\/\/[^\n]*/g, token => {
    comments.push(token)
    return `__TS_COMMENT_${comments.length - 1}__`
  })

  html = html.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, token => {
    strings.push(token)
    return `__TS_STRING_${strings.length - 1}__`
  })

  html = html
    .replace(TS_KEYWORDS, '<span class="ts-keyword">$1</span>')
    .replace(TS_TYPES, '<span class="ts-type">$1</span>')
    .replace(TS_NUMBERS, '<span class="ts-number">$&</span>')

  html = html.replace(/__TS_STRING_(\d+)__/g, (_match, index) => {
    const token = strings[Number(index)] ?? ''
    return `<span class="ts-string">${token}</span>`
  })

  html = html.replace(/__TS_COMMENT_(\d+)__/g, (_match, index) => {
    const token = comments[Number(index)] ?? ''
    return `<span class="ts-comment">${token}</span>`
  })

  return html
}

export function CodeSegment({ title, code }: CodeSegmentProps) {
  const hasCode = code.trim().length > 0

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="gray.900" borderColor="whiteAlpha.200">
      <Box px={4} py={3} borderBottomWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50">
        <Heading size="sm" color="gray.100">{title}</Heading>
      </Box>
      {hasCode ? (
        <Box position="relative">
          <Clipboard.Root value={code} timeout={0}>
            <Clipboard.Trigger asChild>
              <IconButton
                aria-label="Copy code"
                title="Copy code"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(code)
                }}
                position="absolute"
                top={2}
                right={2}
                zIndex={1}
                variant="solid"
                colorScheme="blackAlpha"
              >
                <Clipboard.Indicator />
                <Clipboard.CopyText srOnly />
              </IconButton>
            </Clipboard.Trigger>
          </Clipboard.Root>
          <Box
            as="pre"
            className="ts-code-block"
            m={0}
            p={4}
            pt={10}
            fontSize="sm"
            overflowX="auto"
            bgGradient="linear(to-b, gray.800, gray.900)"
            color="gray.100"
          >
            <code
              className="language-ts"
              dangerouslySetInnerHTML={{ __html: highlightTypeScript(code) }}
            />
          </Box>
        </Box>
      ) : (
        <Text px={4} py={5} fontSize="sm" color="gray.400">
          No generated output yet.
        </Text>
      )}
    </Box>
  )
}
