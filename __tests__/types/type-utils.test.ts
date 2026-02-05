import {
  hasCharacters,
  isDefined,
  isEmpty,
  isEmptyArray,
  isEmptyObject,
  isNumber,
  isString,
  mapDefined,
  validate
} from '../../src/types/type-utils'

describe('validate', () => {
  it('should create a type guard from predicate', () => {
    const isPositiveNumber = validate<number>(n => typeof n === 'number' && n > 0)
    expect(isPositiveNumber(42)).toBe(true)
    expect(isPositiveNumber(-1)).toBe(false)
    expect(isPositiveNumber('42')).toBe(false)
  })
})

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
  })

  it('should return false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(42)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(3.14)).toBe(true)
  })

  it('should return true for NaN (typeof NaN is number)', () => {
    // NaN is technically a number in JavaScript
    expect(isNumber(NaN)).toBe(true)
  })

  it('should return false for non-numbers', () => {
    expect(isNumber('42')).toBe(false)
    expect(isNumber(null)).toBe(false)
  })
})

describe('isEmpty', () => {
  it('should return true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    // isEmpty only checks for null/undefined
    expect(isEmpty('')).toBe(false)
    expect(isEmpty([])).toBe(false)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
  })
})

describe('isEmptyObject', () => {
  it('should return true for empty object', () => {
    expect(isEmptyObject({})).toBe(true)
  })

  it('should return false for object with properties', () => {
    expect(isEmptyObject({ a: 1 })).toBe(false)
  })

  it('should handle arrays (they are objects)', () => {
    // Empty array has no own enumerable properties
    expect(isEmptyObject([])).toBe(false) // Arrays have length property
  })
})

describe('isEmptyArray', () => {
  it('should return true for empty array', () => {
    expect(isEmptyArray([])).toBe(true)
  })

  it('should return false for non-empty array', () => {
    expect(isEmptyArray([1])).toBe(false)
  })

  it('should return false for non-arrays', () => {
    expect(isEmptyArray({})).toBe(false)
  })
})

describe('hasCharacters', () => {
  it('should return true for non-empty string', () => {
    expect(hasCharacters('hello')).toBe(true)
  })

  it('should return false for empty string', () => {
    expect(hasCharacters('')).toBe(false)
  })

  it('should return false for whitespace-only string', () => {
    expect(hasCharacters('   ')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(hasCharacters(null as any)).toBe(false)
    expect(hasCharacters(undefined as any)).toBe(false)
  })
})

describe('isDefined', () => {
  it('should return true for most defined values', () => {
    expect(isDefined('hello')).toBe(true)
    expect(isDefined(0)).toBe(true)
    expect(isDefined(1)).toBe(true)
    expect(isDefined({})).toBe(true)
    expect(isDefined([])).toBe(true)
  })

  it('should return false for null and undefined', () => {
    expect(isDefined(null)).toBe(false)
    expect(isDefined(undefined)).toBe(false)
  })

  it('should return false for falsy values (false and empty string)', () => {
    // isDefined filters out false and '' in addition to null/undefined
    expect(isDefined(false)).toBe(false)
    expect(isDefined('')).toBe(false)
  })
})

describe('mapDefined', () => {
  it('should map defined values', () => {
    expect(mapDefined('hello', s => s.toUpperCase())).toBe('HELLO')
  })

  it('should return undefined for null/undefined', () => {
    expect(mapDefined(null, s => s)).toBeUndefined()
    expect(mapDefined(undefined, s => s)).toBeUndefined()
  })
})
