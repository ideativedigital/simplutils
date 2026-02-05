import { delay } from '../../src/async/delay'

describe('delay', () => {
  it('should delay execution', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(90) // Allow some tolerance
  })

  it('should resolve with undefined', async () => {
    const result = await delay(10)
    expect(result).toBeUndefined()
  })

  it('should work with 0ms delay', async () => {
    const result = await delay(0)
    expect(result).toBeUndefined()
  })
})
