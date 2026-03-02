import { applyDiffs, computeDiff, rewindDiffs, setElementInArray } from '../../src/objects/diff'

describe('computeDiff', () => {
  it('should detect changed primitive values', () => {
    const diff = computeDiff({ name: 'Alice', age: 30 }, { name: 'Alice', age: 31 })
    expect(diff).toEqual([{ field: 'age', oldValue: 30, newValue: 31 }])
  })

  it('should detect added properties', () => {
    const diff = computeDiff({ a: 1 }, { a: 1, b: 2 })
    expect(diff).toEqual([{ field: 'b', oldValue: undefined, newValue: 2 }])
  })

  it('should detect removed properties', () => {
    const diff = computeDiff({ a: 1, b: 2 }, { a: 1 })
    expect(diff).toEqual([{ field: 'b', oldValue: 2, newValue: undefined }])
  })

  it('should detect nested changes', () => {
    const diff = computeDiff(
      { user: { name: 'Alice' } },
      { user: { name: 'Bob' } }
    )
    expect(diff).toEqual([{ field: 'user.name', oldValue: 'Alice', newValue: 'Bob' }])
  })

  it('should detect array changes', () => {
    const diff = computeDiff({ items: [1, 2, 3] }, { items: [1, 2, 4] })
    expect(diff).toEqual([{ field: 'items[2]', oldValue: 3, newValue: 4 }])
  })

  it('should return empty array for identical objects', () => {
    expect(computeDiff({ a: 1 }, { a: 1 })).toEqual([])
  })

  it('should handle null values', () => {
    expect(computeDiff({ a: 1 }, { a: null })).toEqual([{ field: 'a', oldValue: 1, newValue: null }])
    expect(computeDiff({ a: null }, { a: 1 })).toEqual([{ field: 'a', oldValue: null, newValue: 1 }])
  })

  it('should detect type changes', () => {
    expect(computeDiff({ a: 1 }, { a: '1' })).toEqual([{ field: 'a', oldValue: 1, newValue: '1' }])
  })

  it('should compare Date values by time equality', () => {
    const date = new Date('2026-01-01T00:00:00.000Z')
    expect(computeDiff({ d: date }, { d: new Date('2026-01-01T00:00:00.000Z') })).toEqual([])
    expect(computeDiff({ d: date }, { d: new Date('2026-01-02T00:00:00.000Z') })).toEqual([
      {
        field: 'd',
        oldValue: '2026-01-01T00:00:00.000Z',
        newValue: '2026-01-02T00:00:00.000Z'
      }
    ])
  })

  it('should compare class instances via equals or toString', () => {
    class Comparable {
      constructor(private value: number) { }
      equals(other: Comparable) {
        return this.value === other.value
      }
    }
    class Printable {
      constructor(private value: string) { }
      toString() {
        return `Printable(${this.value})`
      }
    }
    class DifferentClass {
      constructor(private value: number) { }
    }

    expect(computeDiff({ c: new Comparable(1) }, { c: new Comparable(1) })).toEqual([])
    expect(computeDiff({ p: new Printable('x') }, { p: new Printable('x') })).toEqual([])
    expect(computeDiff({ c: new Comparable(1) }, { c: new Comparable(2) })).toHaveLength(1)
    expect(computeDiff({ c: new Comparable(1) }, { c: new DifferentClass(1) })).toHaveLength(1)
  })
})

describe('setElementInArray', () => {
  it('should set element at index', () => {
    expect(setElementInArray([1, 2, 3], 1, 'x')).toEqual([1, 'x', 3])
  })

  it('should append if index is beyond length', () => {
    expect(setElementInArray([1, 2], 5, 'x')).toEqual([1, 2, 'x'])
  })

  it('should remove element if value is undefined', () => {
    expect(setElementInArray([1, 2, 3], 1, undefined)).toEqual([1, 3])
  })

  it('should support negative index from array end', () => {
    expect(setElementInArray([1, 2, 3], -1, 'x')).toEqual([1, 2, 'x'])
    expect(setElementInArray([1, 2, 3], -2, undefined)).toEqual([1, 3])
  })

  it('should keep array unchanged when negative index is out of bounds', () => {
    expect(setElementInArray([1, 2, 3], -10, 'x')).toEqual([1, 2, 3])
  })
})

describe('applyDiffs', () => {
  it('should apply diff to object', () => {
    const original = { name: 'Alice', age: 30 }
    const diff = [{ field: 'age', oldValue: 30, newValue: 31 }]
    const result = applyDiffs(original, diff)
    expect(result.age).toBe(31)
  })

  it('should handle nested paths', () => {
    const original = { user: { name: 'Alice' } }
    const diff = [{ field: 'user.name', oldValue: 'Alice', newValue: 'Bob' }]
    const result = applyDiffs(original, diff)
    expect(result.user.name).toBe('Bob')
  })

  it('should handle array paths in nested objects', () => {
    const original = { user: { tags: ['a', 'b'] } }
    const diff = [{ field: 'user.tags[1]', oldValue: 'b', newValue: 'x' }]
    const result = applyDiffs(original, diff)
    expect(result.user.tags).toEqual(['a', 'x'])
  })
})

describe('rewindDiffs', () => {
  it('should revert simple object changes', () => {
    const current = { name: 'Bob', age: 31 }
    const diff = [{ field: 'age', oldValue: 30, newValue: 31 }]
    const rewound = rewindDiffs(current, diff)
    expect(rewound).toEqual({ name: 'Bob', age: 30 })
  })

  it('should revert array element changes', () => {
    const current = { items: [1, 99, 3] }
    const diff = [{ field: 'items[1]', oldValue: 2, newValue: 99 }]
    const rewound = rewindDiffs(current, diff)
    expect(rewound.items).toEqual([1, 2, 3])
  })
})
