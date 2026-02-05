import { merge, pickAtPaths, pickWithPaths } from '../../src/objects/object-manipulation'

describe('merge', () => {
  it('should merge value at top level path', () => {
    const obj = { name: 'Alice', age: 30 }
    const result = merge(obj, 'age', 31)
    expect(result).toEqual({ name: 'Alice', age: 31 })
  })

  it('should merge value at nested path', () => {
    const obj = { user: { name: 'Alice', settings: { theme: 'dark' } } }
    const result = merge(obj, 'user.settings.theme', 'light')
    expect(result).toEqual({ user: { name: 'Alice', settings: { theme: 'light' } } })
  })

  it('should accept function for transformation', () => {
    const obj = { count: 5 }
    const result = merge(obj, 'count', (c: number) => c + 1)
    expect(result).toEqual({ count: 6 })
  })

  it('should not mutate original object', () => {
    const obj = { a: 1 }
    merge(obj, 'a', 2)
    expect(obj.a).toBe(1)
  })
})

describe('pickWithPaths', () => {
  it('should pick specified paths', () => {
    const obj = {
      name: 'Alice',
      address: { city: 'NYC', zip: '10001', country: 'USA' },
      age: 30
    }
    const result = pickWithPaths(obj, {
      name: true,
      address: { city: true }
    })
    expect(result).toEqual({
      name: 'Alice',
      address: { city: 'NYC' }
    })
  })

  it('should handle deep nesting', () => {
    const obj = {
      level1: {
        level2: {
          level3: { value: 'deep' },
          other: 'skip'
        }
      }
    }
    const result = pickWithPaths(obj, {
      level1: {
        level2: {
          level3: true
        }
      }
    })
    expect(result).toEqual({
      level1: { level2: { level3: { value: 'deep' } } }
    })
  })
})

describe('pickAtPaths', () => {
  it('should flatten nested paths to camelCase keys', () => {
    const obj = {
      user: {
        firstName: 'Alice',
        address: { city: 'NYC' }
      }
    }
    const result = pickAtPaths(obj, {
      'user.firstName': true,
      'user.address.city': true
    } as any)
    expect(result).toEqual({
      userFirstName: 'Alice',
      userAddressCity: 'NYC'
    })
  })

  it('should handle single level paths', () => {
    const obj = { name: 'Alice', age: 30 }
    const result = pickAtPaths(obj, { name: true } as any)
    expect(result).toEqual({ name: 'Alice' })
  })
})
