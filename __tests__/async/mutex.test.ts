import { delay } from '../../src/async/delay'
import { Mutex, preventConcurrentCalls } from '../../src/async/mutex'

describe('Mutex', () => {
  it('should allow first lock immediately', async () => {
    const mutex = new Mutex()
    const lockPromise = mutex.lock()
    await expect(lockPromise).resolves.toBeUndefined()
  })

  it('should queue subsequent locks', async () => {
    const mutex = new Mutex()
    const order: number[] = []

    await mutex.lock()
    order.push(1)

    const lock2 = mutex.lock().then(() => order.push(2))
    const lock3 = mutex.lock().then(() => order.push(3))

    // Locks should be waiting
    await delay(10)
    expect(order).toEqual([1])

    mutex.unlock()
    await delay(10)
    expect(order).toEqual([1, 2])

    mutex.unlock()
    await delay(10)
    expect(order).toEqual([1, 2, 3])
  })

  it('should release lock when unlocked with empty queue', async () => {
    const mutex = new Mutex()
    await mutex.lock()
    mutex.unlock()

    // Should be able to lock again
    await expect(mutex.lock()).resolves.toBeUndefined()
  })
})

describe('preventConcurrentCalls', () => {
  it('should deduplicate concurrent calls with same args', async () => {
    let callCount = 0
    const fn = preventConcurrentCalls(async (id: number) => {
      callCount++
      await delay(50)
      return `result-${id}`
    })

    const [result1, result2] = await Promise.all([fn(1), fn(1)])

    expect(callCount).toBe(1)
    expect(result1).toBe('result-1')
    expect(result2).toBe('result-1')
  })

  it('should make separate calls for different args', async () => {
    let callCount = 0
    const fn = preventConcurrentCalls(async (id: number) => {
      callCount++
      await delay(50)
      return `result-${id}`
    })

    const [result1, result2] = await Promise.all([fn(1), fn(2)])

    expect(callCount).toBe(2)
    expect(result1).toBe('result-1')
    expect(result2).toBe('result-2')
  })

  it('should allow new calls after previous completes', async () => {
    let callCount = 0
    const fn = preventConcurrentCalls(async (id: number) => {
      callCount++
      await delay(10)
      return `result-${id}`
    })

    await fn(1)
    await fn(1)

    expect(callCount).toBe(2)
  })
})
