import { batch, max, min, mul, partition, sum, take, takeWhile, unique, upsert } from '../../src/arrays/utils'

describe('take', () => {
  it('should take n elements from start', () => {
    expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3])
  })

  it('should take n elements from specific index', () => {
    expect(take([1, 2, 3, 4, 5], 1, 3)).toEqual([2, 3, 4])
  })

  it('should handle taking more than available', () => {
    expect(take([1, 2], 5)).toEqual([1, 2])
  })

  it('should return empty for empty array', () => {
    expect(take([], 3)).toEqual([])
  })
})

describe('batch', () => {
  it('should create batches of specified size', () => {
    expect(batch([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should handle array smaller than batch size', () => {
    expect(batch([1, 2], 5)).toEqual([[1, 2]])
  })

  it('should handle exact division', () => {
    expect(batch([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]])
  })

  it('should return empty array for empty input', () => {
    expect(batch([], 2)).toEqual([])
  })
})

describe('unique', () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('should remove duplicates by key', () => {
    const items = [{ id: 1 }, { id: 1 }, { id: 2 }]
    expect(unique(items, 'id')).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('should remove duplicates by function', () => {
    const items = [{ name: 'Alice' }, { name: 'alice' }, { name: 'Bob' }]
    expect(unique(items, i => i.name.toLowerCase())).toEqual([{ name: 'Alice' }, { name: 'Bob' }])
  })

  it('should handle empty array', () => {
    expect(unique([])).toEqual([])
  })
})

describe('numberAggregator and aggregations', () => {
  describe('sum', () => {
    it('should sum numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15)
    })

    it('should sum with transform function', () => {
      const items = [{ v: 10 }, { v: 20 }, { v: 30 }]
      expect(sum(items)(i => i.v)).toBe(60)
    })

    it('should return 0 for empty array', () => {
      expect(sum([])).toBe(0)
    })
  })

  describe('mul', () => {
    it('should multiply numbers', () => {
      expect(mul([2, 3, 4])).toBe(24)
    })

    it('should return 1 for empty array', () => {
      expect(mul([])).toBe(1)
    })
  })

  describe('max', () => {
    it('should find maximum', () => {
      expect(max([3, 1, 4, 1, 5, 9])).toBe(9)
    })

    it('should find max with transform', () => {
      const items = [{ v: 10 }, { v: 50 }, { v: 30 }]
      expect(max(items)(i => i.v)).toBe(50)
    })

    it('should return 0 for empty array', () => {
      expect(max([])).toBe(0)
    })
  })

  describe('min', () => {
    it('should find minimum', () => {
      expect(min([3, 1, 4, 1, 5, 9])).toBe(1)
    })

    it('should return 0 for empty array', () => {
      expect(min([])).toBe(0)
    })
  })
})

describe('upsert', () => {
  const matcher = (a: { id: number }, b: { id: number }) => a.id === b.id

  it('should update existing element', () => {
    const arr = [{ id: 1, v: 'old' }]
    const result = upsert(arr, { id: 1, v: 'new' }, matcher)
    expect(result).toEqual([{ id: 1, v: 'new' }])
  })

  it('should insert if not found', () => {
    const arr = [{ id: 1, v: 'a' }]
    const result = upsert(arr, { id: 2, v: 'b' }, matcher)
    expect(result).toEqual([{ id: 1, v: 'a' }, { id: 2, v: 'b' }])
  })

  it('should handle empty array', () => {
    const result = upsert([], { id: 1, v: 'new' }, matcher)
    expect(result).toEqual([{ id: 1, v: 'new' }])
  })
})

describe('partition', () => {
  it('should split array by predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
    expect(evens).toEqual([2, 4])
    expect(odds).toEqual([1, 3, 5])
  })

  it('should handle all matching', () => {
    const [matches, rest] = partition([2, 4, 6], n => n % 2 === 0)
    expect(matches).toEqual([2, 4, 6])
    expect(rest).toEqual([])
  })

  it('should handle none matching', () => {
    const [matches, rest] = partition([1, 3, 5], n => n % 2 === 0)
    expect(matches).toEqual([])
    expect(rest).toEqual([1, 3, 5])
  })

  it('should handle empty array', () => {
    const [matches, rest] = partition([], () => true)
    expect(matches).toEqual([])
    expect(rest).toEqual([])
  })
})

describe('takeWhile', () => {
  it('should take elements while predicate is true', () => {
    expect(takeWhile([1, 2, 3, 4, 5], n => n < 4)).toEqual([1, 2, 3])
  })

  it('should include last element if includeLast is true', () => {
    expect(takeWhile([1, 2, 3, 4, 5], n => n < 4, true)).toEqual([1, 2, 3, 4])
  })

  it('should return all if predicate always true', () => {
    expect(takeWhile([1, 2, 3], () => true)).toEqual([1, 2, 3])
  })

  it('should return empty if predicate immediately false', () => {
    expect(takeWhile([1, 2, 3], () => false)).toEqual([])
  })

  it('should return first element with includeLast if predicate immediately false', () => {
    expect(takeWhile([1, 2, 3], () => false, true)).toEqual([1])
  })
})
