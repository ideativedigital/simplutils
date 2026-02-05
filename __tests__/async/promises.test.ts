import { delay } from '../../src/async/delay'
import { mapPromises, sequentialPromises, SyncPromise } from '../../src/async/promises'

describe('sequentialPromises', () => {
  it('should resolve promises in order', async () => {
    const order: number[] = []
    const promises = [
      delay(30).then(() => { order.push(1); return 1 }),
      delay(10).then(() => { order.push(2); return 2 }),
      delay(20).then(() => { order.push(3); return 3 })
    ]

    const results = await sequentialPromises(promises)

    expect(results).toEqual([1, 2, 3])
    // Note: promises are already created, so execution order depends on their resolution
  })

  it('should return empty array for empty input', async () => {
    const results = await sequentialPromises([])
    expect(results).toEqual([])
  })
})

describe('mapPromises', () => {
  it('should map elements to promises in parallel by default', async () => {
    const start = Date.now()
    const results = await mapPromises([1, 2, 3], async (n) => {
      await delay(50)
      return n * 2
    })

    const elapsed = Date.now() - start
    expect(results).toEqual([2, 4, 6])
    expect(elapsed).toBeLessThan(200) // Should be ~50ms in parallel
  })

  it('should map elements sequentially when specified', async () => {
    const order: number[] = []
    const results = await mapPromises(
      [1, 2, 3],
      async (n, i) => {
        await delay(10)
        order.push(n)
        return n * 2
      },
      { isSequential: true }
    )

    expect(results).toEqual([2, 4, 6])
    // Sequential order
    expect(order).toEqual([1, 2, 3])
  })
})

describe('SyncPromise', () => {
  it('should create a resolvable promise', async () => {
    const [promise, controller] = SyncPromise.create<string>()

    setTimeout(() => controller.resolve('done'), 10)

    const result = await promise
    expect(result).toBe('done')
  })

  it('should create a rejectable promise', async () => {
    const [promise, controller] = SyncPromise.create<string>()

    setTimeout(() => controller.reject(new Error('failed')), 10)

    await expect(promise).rejects.toThrow('failed')
  })

  it('should allow resolving with different types', async () => {
    const [promise, controller] = SyncPromise.create<{ value: number }>()

    controller.resolve({ value: 42 })

    const result = await promise
    expect(result).toEqual({ value: 42 })
  })
})
