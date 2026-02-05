import { createFilter, createSorter, removeUndefinedItems, zipWithIndex } from '../../src/arrays/functional'

describe('zipWithIndex', () => {
  it('should pair elements with their indices', () => {
    expect(zipWithIndex(['a', 'b', 'c'])).toEqual([['a', 0], ['b', 1], ['c', 2]])
  })

  it('should return empty array for empty input', () => {
    expect(zipWithIndex([])).toEqual([])
  })

  it('should work with numbers', () => {
    expect(zipWithIndex([10, 20, 30])).toEqual([[10, 0], [20, 1], [30, 2]])
  })
})

describe('createSorter', () => {
  const users = [
    { name: 'Charlie', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 25 },
    { name: 'Alice', age: 30 }
  ]

  it('should sort by a single string key ascending', () => {
    const sorted = [...users].sort(createSorter<typeof users[0]>().key('name', 'asc'))
    expect(sorted[0].name).toBe('Alice')
    expect(sorted[sorted.length - 1].name).toBe('Charlie')
  })

  it('should sort by a single string key descending', () => {
    const sorted = [...users].sort(createSorter<typeof users[0]>().key('name', 'desc'))
    expect(sorted[0].name).toBe('Charlie')
    expect(sorted[sorted.length - 1].name).toBe('Alice')
  })

  it('should sort by multiple keys', () => {
    const sorted = [...users].sort(
      createSorter<typeof users[0]>().key('name', 'asc').key('age', 'desc')
    )
    // First Alice with age 30, then Alice with age 25
    expect(sorted[0]).toEqual({ name: 'Alice', age: 30 })
    expect(sorted[1]).toEqual({ name: 'Alice', age: 25 })
  })

  it('should sort by numeric key', () => {
    const sorted = [...users].sort(createSorter<typeof users[0]>().key('age', 'asc'))
    expect(sorted[0].age).toBe(25)
    expect(sorted[sorted.length - 1].age).toBe(30)
  })
})

describe('createFilter', () => {
  it('should create a basic filter', () => {
    const isEven = createFilter<number>(n => n % 2 === 0)
    expect([1, 2, 3, 4, 5].filter(isEven)).toEqual([2, 4])
  })

  it('should chain with and()', () => {
    const isPositive = createFilter<number>(n => n > 0)
    const isEven = (n: number) => n % 2 === 0
    const isPositiveEven = isPositive.and(isEven)

    expect([-4, -2, 0, 2, 4].filter(isPositiveEven)).toEqual([2, 4])
  })

  it('should chain with or()', () => {
    const isZero = createFilter<number>(n => n === 0)
    const isPositive = (n: number) => n > 0
    const isZeroOrPositive = isZero.or(isPositive)

    expect([-2, -1, 0, 1, 2].filter(isZeroOrPositive)).toEqual([0, 1, 2])
  })
})

describe('removeUndefinedItems', () => {
  it('should remove null and undefined', () => {
    expect(removeUndefinedItems([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
  })

  it('should keep most truthy values', () => {
    expect(removeUndefinedItems([1, 'hello', true, {}, []])).toEqual([1, 'hello', true, {}, []])
  })

  it('should also filter out false and empty string (uses isDefined)', () => {
    // isDefined filters out: null, undefined, false, ''
    // So 0 is kept, but '', false, null, undefined are removed
    expect(removeUndefinedItems([0, '', false, null, undefined])).toEqual([0])
  })

  it('should handle empty array', () => {
    expect(removeUndefinedItems([])).toEqual([])
  })

  it('should handle array of only null/undefined', () => {
    expect(removeUndefinedItems([null, undefined, null])).toEqual([])
  })
})
