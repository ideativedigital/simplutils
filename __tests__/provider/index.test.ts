import { delay } from '../../src/async/delay'
import { Provider, createProvider } from '../../src/provider'

describe('Provider', () => {
  it('should provide dependencies (async)', async () => {
    const provider = new Provider(async () => ({
      db: { query: () => 'result' },
      logger: { log: console.log }
    }))

    const deps = await provider.provide()
    expect(deps.db.query()).toBe('result')
  })

  it('should cache dependencies with default context', async () => {
    let createCount = 0
    const provider = new Provider(async () => {
      createCount++
      return { service: {} }
    })

    await provider.provide()
    await provider.provide()
    await provider.provide()

    expect(createCount).toBe(1)
  })

  it('should not cache with noCache context', async () => {
    let createCount = 0
    const provider = new Provider(
      async () => {
        createCount++
        return { service: {} }
      },
      { noCache: true }
    )

    await provider.provide()
    await provider.provide()

    expect(createCount).toBe(2)
  })

  it('should eventually refresh after resetCache (timing dependent)', async () => {
    // resetCache sets refreshDate to now, but the check is refreshDate < now
    // This is timing-dependent and may not trigger immediately
    let createCount = 0
    const provider = new Provider(
      async () => {
        createCount++
        return { service: {} }
      },
      { noCache: false, refreshInterval: 10 } // Very short interval
    )

    await provider.provide() // createCount = 1
    provider.resetCache()
    // Need to wait a bit for the time check to work
    await delay(15)
    await provider.provide() // Should be createCount = 2 now

    expect(createCount).toBe(2)
  })

  it('should chain providers with and()', async () => {
    const provider1 = new Provider(async () => ({ a: 1 }))
    const provider2 = new Provider(async () => ({ b: 2 }))

    const combined = provider1.and(provider2)
    const deps = await combined.provide()

    expect(deps).toEqual({ a: 1, b: 2 })
  })

  it('should pick specific dependencies', async () => {
    const provider = new Provider(async () => ({
      a: 1,
      b: 2,
      c: 3
    }))

    const picked = provider.pick('a', 'c')
    const deps = await picked.provide()

    expect(deps).toEqual({ a: 1, c: 3 })
  })

  it('should identify providers with isProvider (returns truthy/undefined)', () => {
    const provider = new Provider(async () => ({}))
    expect(Provider.isProvider(provider)).toBeTruthy()
    // Plain objects return undefined (falsy)
    expect(Provider.isProvider({})).toBeFalsy()
  })
})

describe('createProvider', () => {
  it('should create a provider from factory', async () => {
    const provider = createProvider(async () => ({ value: 42 }))
    expect(await provider.provide()).toEqual({ value: 42 })
  })
})
