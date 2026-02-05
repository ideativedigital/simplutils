import { findById, hasSameId, IdArrays, mergeArraysWithId, pullById, upsertWithId } from '../../src/arrays/id-arrays'

describe('hasSameId', () => {
  it('should return true for objects with same id', () => {
    expect(hasSameId({ id: 1, name: 'Alice' }, { id: 1, name: 'Bob' })).toBe(true)
  })

  it('should return false for objects with different ids', () => {
    expect(hasSameId({ id: 1 }, { id: 2 })).toBe(false)
  })

  it('should work with string ids', () => {
    expect(hasSameId({ id: 'abc' }, { id: 'abc' })).toBe(true)
    expect(hasSameId({ id: 'abc' }, { id: 'def' })).toBe(false)
  })
})

describe('findById', () => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ]

  it('should find element by id', () => {
    expect(findById(users, 2)).toEqual({ id: 2, name: 'Bob' })
  })

  it('should return undefined for non-existent id', () => {
    expect(findById(users, 99)).toBeUndefined()
  })

  it('should return undefined for empty array', () => {
    expect(findById([], 1)).toBeUndefined()
  })
})

describe('pullById', () => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ]

  it('should remove element and return both array and element', () => {
    const [newArr, removed] = pullById(users, 2)
    expect(newArr).toEqual([{ id: 1, name: 'Alice' }, { id: 3, name: 'Charlie' }])
    expect(removed).toEqual({ id: 2, name: 'Bob' })
  })

  it('should return original array and undefined for non-existent id', () => {
    const [newArr, removed] = pullById(users, 99)
    expect(newArr).toEqual(users)
    expect(removed).toBeUndefined()
  })
})

describe('mergeArraysWithId', () => {
  it('should merge arrays, replacing existing elements', () => {
    const source = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }]
    const updates = [{ id: 2, v: 'updated' }, { id: 3, v: 'new' }]
    const result = mergeArraysWithId(source, updates)
    expect(result).toEqual([
      { id: 1, v: 'a' },
      { id: 2, v: 'updated' },
      { id: 3, v: 'new' }
    ])
  })

  it('should preserve order from source', () => {
    const source = [{ id: 1, v: 'first' }, { id: 2, v: 'second' }]
    const updates = [{ id: 2, v: 'new second' }]
    const result = mergeArraysWithId(source, updates)
    expect(result[1]).toEqual({ id: 2, v: 'new second' })
  })

  it('should handle empty source', () => {
    const result = mergeArraysWithId([], [{ id: 1, v: 'new' }])
    expect(result).toEqual([{ id: 1, v: 'new' }])
  })

  it('should handle empty updates', () => {
    const source = [{ id: 1, v: 'a' }]
    const result = mergeArraysWithId(source, [])
    expect(result).toEqual(source)
  })
})

describe('upsertWithId', () => {
  it('should update existing element', () => {
    const users = [{ id: 1, name: 'Alice' }]
    const result = upsertWithId(users, { id: 1, name: 'Alicia' })
    expect(result).toEqual([{ id: 1, name: 'Alicia' }])
  })

  it('should insert new element', () => {
    const users = [{ id: 1, name: 'Alice' }]
    const result = upsertWithId(users, { id: 2, name: 'Bob' })
    expect(result).toEqual([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])
  })
})

describe('IdArrays static class', () => {
  it('should expose all methods', () => {
    expect(IdArrays.equals).toBe(hasSameId)
    expect(IdArrays.find).toBe(findById)
    expect(IdArrays.pull).toBe(pullById)
    expect(IdArrays.merge).toBe(mergeArraysWithId)
    expect(IdArrays.upsert).toBe(upsertWithId)
  })
})
