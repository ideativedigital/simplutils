import { arrayRange } from '../../src/arrays/range'

describe('arrayRange', () => {
  it('should generate range from 0 to stop (exclusive)', () => {
    expect(arrayRange(5)).toEqual([0, 1, 2, 3, 4])
  })

  it('should generate range with start and end', () => {
    expect(arrayRange(2, 6)).toEqual([2, 3, 4, 5])
  })

  it('should generate range with custom step', () => {
    expect(arrayRange(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
  })

  it('should throw error for step of 0', () => {
    expect(() => arrayRange(0, 10, 0)).toThrow('No 0 step allowed')
  })

  it('should generate empty array when start equals end', () => {
    expect(arrayRange(5, 5)).toEqual([])
  })

  it('should handle negative step (generates from start with negative increments)', () => {
    // With negative step, it calculates length as (count - param) / abs(step)
    // arrayRange(10, 0, -1) -> length = (0 - 10) / 1 = -10 (treated as 0 or wrapped?)
    // Actually looking at the implementation, it does: length / Math.abs(step)
    // So length = 0 - 10 = -10, then -10 / 1 = -10
    // Array.from with negative length creates empty array... let's test
    expect(arrayRange(0, 10, -1)).toEqual([0, -1, -2, -3, -4, -5, -6, -7, -8, -9])
  })
})
