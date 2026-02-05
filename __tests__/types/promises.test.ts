import { isPromise, proxifyPromise, toPromise } from '../../src/types/promises'

describe('toPromise', () => {
  it('should wrap non-promise value in Promise', async () => {
    const result = await toPromise(42)
    expect(result).toBe(42)
  })

  it('should return promise as-is', async () => {
    const promise = Promise.resolve('hello')
    const wrapped = toPromise(promise)
    expect(wrapped).toBe(promise)
    expect(await wrapped).toBe('hello')
  })
})

describe('isPromise', () => {
  it('should return true for Promise', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => { }))).toBe(true)
  })

  it('should return true for thenable', () => {
    const thenable = { then: () => { } }
    expect(isPromise(thenable)).toBe(true)
  })

  it('should return falsy for non-promise', () => {
    expect(isPromise(42)).toBeFalsy()
    expect(isPromise('hello')).toBeFalsy()
    expect(isPromise({})).toBeFalsy()
    // null returns null (falsy) due to short-circuit evaluation
    expect(isPromise(null as any)).toBeFalsy()
  })
})

describe('proxifyPromise', () => {
  it('should allow property access on promise of object', async () => {
    const promise = Promise.resolve({ name: 'Alice', age: 30 })
    const proxied = proxifyPromise(promise)

    expect(await proxied.name).toBe('Alice')
    expect(await proxied.age).toBe(30)
  })

  it('should not maintain the original object when awaiting proxy directly', async () => {
    // The proxy wraps an empty object, so awaiting it returns that empty object
    // Use property access to get values from the promise
    const promise = Promise.resolve({ value: 42 })
    const proxied = proxifyPromise(promise)

    // Direct await returns the proxy target (empty object)
    const result = await proxied
    expect(result).toEqual({})

    // But property access works
    expect(await proxied.value).toBe(42)
  })
})
