import { delay } from '../../src/async/delay'
import { smartThrottle, throttle } from '../../src/throttle'

describe('throttle', () => {
  it('should throttle calls', async () => {
    let callCount = 0
    const fn = throttle(() => {
      callCount++
    }, 50)

    fn!() // Executes immediately
    fn!() // Throttled
    fn!() // Throttled

    expect(callCount).toBe(1)

    await delay(60)
    fn!() // Should execute again
    expect(callCount).toBe(2)
  })

  it('should return undefined when no function provided', () => {
    const fn = throttle(undefined, 100)
    expect(fn).toBeUndefined()
  })

  it('should pass arguments to the function', () => {
    let receivedArg: number | undefined
    const fn = throttle((x: number) => {
      receivedArg = x
    }, 100)

    fn!(42)
    expect(receivedArg).toBe(42)
  })
})

describe('smartThrottle', () => {
  it('should deduplicate concurrent async calls with same args', async () => {
    let callCount = 0
    const fn = smartThrottle(async (id: number) => {
      callCount++
      await delay(50)
      return `result-${id}`
    })

    const [r1, r2, r3] = await Promise.all([fn(1), fn(1), fn(1)])

    expect(callCount).toBe(1)
    expect(r1).toBe('result-1')
    expect(r2).toBe('result-1')
    expect(r3).toBe('result-1')
  })

  it('should allow different args in parallel', async () => {
    let callCount = 0
    const fn = smartThrottle(async (id: number) => {
      callCount++
      await delay(30)
      return `result-${id}`
    })

    const [r1, r2] = await Promise.all([fn(1), fn(2)])

    expect(callCount).toBe(2)
    expect(r1).toBe('result-1')
    expect(r2).toBe('result-2')
  })

  it('should allow new call after delay timeout clears the cache', async () => {
    let callCount = 0
    const fn = smartThrottle(
      async (id: number) => {
        callCount++
        await delay(10)
        return `result-${id}`
      },
      { delay: 50 }
    )

    await fn(1)
    // Wait for the cache to clear (delay timeout + buffer)
    await delay(60)
    await fn(1)

    expect(callCount).toBe(2)
  })

  it('should return original function when disabled', async () => {
    let callCount = 0
    const original = async (id: number) => {
      callCount++
      return `result-${id}`
    }
    const fn = smartThrottle(original, { disable: true })

    await Promise.all([fn(1), fn(1)])
    expect(callCount).toBe(2) // No deduplication when disabled
  })

  it('should deduplicate concurrent rejected calls and allow retry after cache clears', async () => {
    let callCount = 0
    const fn = smartThrottle(
      async (id: number) => {
        callCount++
        await delay(5)
        throw new Error(`boom-${id}`)
      },
      { delay: 20 }
    )

    await expect(Promise.all([fn(1), fn(1)])).rejects.toThrow('boom-1')
    expect(callCount).toBe(1)

    await delay(30)
    await expect(fn(1)).rejects.toThrow('boom-1')
    expect(callCount).toBe(2)
  })
})
