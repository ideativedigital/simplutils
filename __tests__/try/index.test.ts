import { delay } from '../../src/async/delay'
import { fireAndForget, tryOr, tryOrNull, wrapTry } from '../../src/try'

describe('tryOr', () => {
  it('should return result on success', () => {
    const result = tryOr(() => 42, 0)
    expect(result).toBe(42)
  })

  it('should return default on sync error (returns Promise)', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const result = tryOr(() => {
      throw new Error('fail')
    }, 0)
    // tryOr returns Promise.resolve(defaultValue) on sync error
    expect(await result).toBe(0)
    consoleSpy.mockRestore()
  })

  it('should work with async functions', async () => {
    const result = await tryOr(async () => {
      await delay(10)
      return 'success'
    }, 'default')
    expect(result).toBe('success')
  })

  it('should return default on async error', async () => {
    const result = await tryOr(async () => {
      throw new Error('fail')
    }, 'default')
    expect(result).toBe('default')
  })
})

describe('tryOrNull', () => {
  it('should return value on success', () => {
    const result = tryOrNull(() => 42)
    expect(result).toBe(42)
  })

  it('should return null on sync error (as Promise)', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const result = tryOrNull(() => {
      throw new Error('fail')
    })
    // On sync error, tryOr returns Promise.resolve(null)
    expect(await result).toBeNull()
    consoleSpy.mockRestore()
  })

  it('should work with async functions', async () => {
    const result = await tryOrNull(async () => {
      await delay(10)
      return 'success'
    })
    expect(result).toBe('success')
  })

  it('should return null on async error', async () => {
    const result = await tryOrNull(async () => {
      throw new Error('fail')
    })
    expect(result).toBeNull()
  })
})

describe('fireAndForget', () => {
  it('should execute async function and return result', async () => {
    const result = await fireAndForget(async () => {
      return 'executed'
    })
    expect(result).toBe('executed')
  })

  it('should suppress errors and return undefined', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const result = await fireAndForget(async () => {
      throw new Error('ignored')
    })
    expect(result).toBeUndefined()
    consoleSpy.mockRestore()
  })
})

describe('wrapTry', () => {
  it('should return Success on success', () => {
    const result = wrapTry(() => 42)
    expect(result).toEqual({ isSuccess: true, value: 42, error: null })
  })

  it('should return Failure on error', () => {
    const result = wrapTry(() => {
      throw new Error('fail')
    })
    expect(result.isSuccess).toBe(false)
    expect(result.value).toBeNull()
    expect(result.error).toBeInstanceOf(Error)
  })

  it('should call finally callback', () => {
    let finallyCalled = false
    wrapTry(
      () => 42,
      () => {
        finallyCalled = true
      }
    )
    expect(finallyCalled).toBe(true)
  })

  it('should call finally on error too', () => {
    let finallyCalled = false
    wrapTry(
      () => {
        throw new Error('fail')
      },
      () => {
        finallyCalled = true
      }
    )
    expect(finallyCalled).toBe(true)
  })

  it('should return Promise in value for async functions (not await it)', () => {
    // wrapTry is synchronous and doesn't await - Promise is stored as value
    const result = wrapTry(() => Promise.resolve('async'))
    expect(result.isSuccess).toBe(true)
    expect(result.value).toBeInstanceOf(Promise)
  })
})
