import {
  deepArrayEqual,
  deepEqual,
  groupBy,
  groupById,
  groupByKey,
  isInstanceOfAnyClass,
  lowerCaseKeys,
  mapKeys,
  mapValues,
  objectIsNotEmpty,
  omit,
  pick,
  pickAsArray,
  prefixKeys,
  removePrefixFromKeys,
  removeUndefined,
  substitute,
  swapObject,
  upperCaseKeys
} from '../../src/objects/object-utils'

describe('objectIsNotEmpty', () => {
  it('should return true for object with properties', () => {
    expect(objectIsNotEmpty({ a: 1 })).toBe(true)
  })

  it('should return false for empty object', () => {
    expect(objectIsNotEmpty({})).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(objectIsNotEmpty(undefined)).toBe(false)
  })
})

describe('mapKeys', () => {
  it('should transform keys', () => {
    expect(mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())).toEqual({ A: 1, B: 2 })
  })

  it('should handle empty object', () => {
    expect(mapKeys({}, k => k)).toEqual({})
  })
})

describe('prefixKeys', () => {
  it('should add prefix to all keys', () => {
    expect(prefixKeys('pre_', { a: 1, b: 2 })).toEqual({ pre_a: 1, pre_b: 2 })
  })
})

describe('removePrefixFromKeys', () => {
  it('should remove prefix from keys', () => {
    expect(removePrefixFromKeys({ pre_a: 1, pre_b: 2 }, 'pre_')).toEqual({ a: 1, b: 2 })
  })

  it('should keep keys without prefix unchanged', () => {
    expect(removePrefixFromKeys({ pre_a: 1, other: 2 }, 'pre_')).toEqual({ a: 1, other: 2 })
  })
})

describe('lowerCaseKeys', () => {
  it('should lowercase all keys', () => {
    expect(lowerCaseKeys({ ABC: 1, DeF: 2 })).toEqual({ abc: 1, def: 2 })
  })
})

describe('upperCaseKeys', () => {
  it('should uppercase all keys', () => {
    expect(upperCaseKeys({ abc: 1, def: 2 })).toEqual({ ABC: 1, DEF: 2 })
  })
})

describe('omit', () => {
  it('should remove specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, 'b', 'c')).toEqual({ a: 1 })
  })

  it('should handle non-existent keys', () => {
    expect(omit({ a: 1 }, 'b' as any)).toEqual({ a: 1 })
  })
})

describe('pick', () => {
  it('should keep only specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ a: 1, c: 3 })
  })

  it('should handle non-existent keys', () => {
    expect(pick({ a: 1 }, 'a', 'b' as any)).toEqual({ a: 1 })
  })
})

describe('pickAsArray', () => {
  it('should return values as tuple', () => {
    const obj = { name: 'Alice', age: 30, city: 'NYC' }
    expect(pickAsArray(obj, 'name', 'age')).toEqual(['Alice', 30])
  })
})

describe('mapValues', () => {
  it('should transform values', () => {
    expect(mapValues({ a: 1, b: 2 }, v => v * 2)).toEqual({ a: 2, b: 4 })
  })

  it('should provide key and index', () => {
    const result = mapValues({ a: 1, b: 2 }, (v, k, i) => `${k}-${v}-${i}`)
    expect(result).toEqual({ a: 'a-1-0', b: 'b-2-1' })
  })
})

describe('groupBy', () => {
  it('should group by function result', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'a', value: 2 },
      { type: 'b', value: 3 }
    ]
    const result = groupBy(items, i => i.type)
    expect(result).toEqual({
      a: [{ type: 'a', value: 1 }, { type: 'a', value: 2 }],
      b: [{ type: 'b', value: 3 }]
    })
  })

  it('should skip items with undefined key', () => {
    const items = [{ type: 'a' }, { type: undefined }]
    const result = groupBy(items, i => i.type)
    expect(result).toEqual({ a: [{ type: 'a' }] })
  })
})

describe('groupByKey', () => {
  it('should group by object key', () => {
    const items = [
      { category: 'fruit', name: 'apple' },
      { category: 'fruit', name: 'banana' },
      { category: 'veg', name: 'carrot' }
    ]
    const result = groupByKey(items, 'category')
    expect(Object.keys(result)).toEqual(['fruit', 'veg'])
    expect(result['fruit']).toHaveLength(2)
  })
})

describe('groupById', () => {
  it('should create object keyed by id', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
    const result = groupById(items, 'id')
    expect(result[1]).toEqual({ id: 1, name: 'Alice' })
    expect(result[2]).toEqual({ id: 2, name: 'Bob' })
  })
})

describe('swapObject', () => {
  it('should swap keys and values', () => {
    expect(swapObject({ a: 'x', b: 'y' })).toEqual({ x: 'a', y: 'b' })
  })
})

describe('removeUndefined', () => {
  it('should remove undefined and null properties', () => {
    expect(removeUndefined({ a: 1, b: undefined, c: null, d: 2 })).toEqual({ a: 1, d: 2 })
  })

  it('should keep falsy values', () => {
    expect(removeUndefined({ a: 0, b: '', c: false })).toEqual({ a: 0, b: '', c: false })
  })
})

describe('deepEqual', () => {
  it('should return true for equal objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
  })

  it('should return false for different objects', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('should handle non-strict mode', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1, b: 2 }
    expect(deepEqual(obj1, obj2, { strict: false })).toBe(true)
    expect(deepEqual(obj1, obj2, { strict: true })).toBe(false)
  })
})

describe('deepArrayEqual', () => {
  it('should return true for equal arrays', () => {
    expect(deepArrayEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true)
  })

  it('should return false for different arrays', () => {
    expect(deepArrayEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
  })

  it('should return false for different lengths', () => {
    expect(deepArrayEqual([1], [1, 2])).toBe(false)
  })
})

describe('isInstanceOfAnyClass', () => {
  it('should return true for class instances', () => {
    class MyClass { }
    expect(isInstanceOfAnyClass(new MyClass())).toBe(true)
    expect(isInstanceOfAnyClass(new Date())).toBe(true)
  })

  it('should return false for plain objects', () => {
    expect(isInstanceOfAnyClass({})).toBe(false)
    expect(isInstanceOfAnyClass({ a: 1 })).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isInstanceOfAnyClass(null)).toBe(false)
    expect(isInstanceOfAnyClass(undefined)).toBe(false)
    expect(isInstanceOfAnyClass(42)).toBe(false)
  })
})

describe('substitute', () => {
  it('should substitute matching values', () => {
    const result = substitute(
      { a: null, b: { c: null } },
      (v): v is null => v === null,
      () => 'N/A'
    )
    expect(result).toEqual({ a: 'N/A', b: { c: 'N/A' } })
  })

  it('should handle arrays', () => {
    const result = substitute(
      [1, null, 2],
      (v): v is null => v === null,
      () => 0
    )
    expect(result).toEqual([1, 0, 2])
  })

  it('should not traverse class instances', () => {
    class MyClass {
      value = null
    }
    const instance = new MyClass()
    const result = substitute(
      { obj: instance },
      (v): v is null => v === null,
      () => 'replaced'
    )
    expect(result.obj).toBe(instance)
  })
})
