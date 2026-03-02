import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeSegment } from './CodeSegment'

describe('CodeSegment', () => {
  it('copies segment content', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(
      <ChakraProvider value={defaultSystem}>
        <CodeSegment title="Segment" code="const x = 1" />
      </ChakraProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /copy/i }))
    expect(writeText).toHaveBeenCalledWith('const x = 1')
  })
})
