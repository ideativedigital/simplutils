import {
  camelCaseDots,
  capitalize,
  capitalizeFirstname,
  hashToHexa,
  idify,
  randomCode,
  shorten,
  toString
} from '../../src/strings/strings-utils'

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should handle already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})

describe('capitalizeFirstname', () => {
  it('should capitalize simple name', () => {
    expect(capitalizeFirstname('alice')).toBe('Alice')
  })

  it('should handle hyphenated names', () => {
    expect(capitalizeFirstname('jean-pierre')).toBe('Jean-Pierre')
  })

  it('should handle multiple parts', () => {
    expect(capitalizeFirstname('mary jane')).toBe('Mary Jane')
  })

  it('should handle apostrophes', () => {
    expect(capitalizeFirstname("o'connor")).toBe("O'Connor")
  })
})

describe('camelCaseDots', () => {
  it('should convert dotted path to camelCase', () => {
    expect(camelCaseDots('user.first.name')).toBe('userFirstName')
  })

  it('should handle single word', () => {
    expect(camelCaseDots('user')).toBe('user')
  })

  it('should handle already capitalized segments', () => {
    expect(camelCaseDots('User.Name')).toBe('UserName')
  })
})

describe('idify', () => {
  it('should create id from string (uses underscores for spaces)', () => {
    expect(idify('Hello World')).toBe('hello_world')
  })

  it('should keep special characters (except accents)', () => {
    // idify doesn't remove punctuation
    expect(idify('Hello, World!')).toBe('hello,_world!')
  })

  it('should handle multiple spaces', () => {
    expect(idify('Hello   World')).toBe('hello___world')
  })

  it('should handle accented characters', () => {
    expect(idify('Café Résumé')).toBe('cafe_resume')
  })

  it('should replace forward slashes with hyphens', () => {
    expect(idify('path/to/file')).toBe('path-to-file')
  })
})

describe('toString', () => {
  it('should convert string to string', () => {
    expect(toString('hello')).toBe('hello')
  })

  it('should convert number to string', () => {
    expect(toString(42)).toBe('42')
  })

  it('should convert object using JSON', () => {
    expect(toString({ a: 1 })).toBe('{"a":1}')
  })

  it('should convert boolean to string', () => {
    expect(toString(true)).toBe('true')
    expect(toString(false)).toBe('false')
  })

  it('should return empty string for undefined', () => {
    expect(toString(undefined)).toBe('')
  })

  it('should convert null to string', () => {
    expect(toString(null)).toBe('null')
  })

  it('should convert array to string (default array join)', () => {
    expect(toString([1, 2, 3])).toBe('1,2,3')
  })

  it('should handle Date objects', () => {
    const date = new Date('2023-01-15T12:00:00Z')
    expect(toString(date)).toBe('2023-01-15T12:00:00.000Z')
  })
})

describe('hashToHexa', () => {
  it('should convert to hex string', () => {
    const hex = hashToHexa('test')
    expect(typeof hex).toBe('string')
    expect(hex).toMatch(/^[0-9a-f]+$/i)
  })

  it('should be deterministic', () => {
    expect(hashToHexa('test')).toBe(hashToHexa('test'))
  })

  it('should produce different hashes for different inputs', () => {
    expect(hashToHexa('alice')).not.toBe(hashToHexa('bob'))
  })

  it('should accept a seed parameter', () => {
    expect(hashToHexa('test', 0)).not.toBe(hashToHexa('test', 1))
  })
})

describe('shorten', () => {
  it('should shorten long strings with ellipsis in the middle', () => {
    // shorten takes first 2 chars, '...', and last 3 chars
    expect(shorten('Hello World', 9)).toBe('He...rld')
  })

  it('should not modify short strings', () => {
    expect(shorten('Hi', 10)).toBe('Hi')
  })

  it('should not modify strings at max length', () => {
    // shorten returns as-is if length < maxLength (not <=)
    expect(shorten('Hello', 6)).toBe('Hello')
  })

  it('should use default max length of 9', () => {
    expect(shorten('A very long string')).toBe('A ...ing')
  })
})

describe('randomCode', () => {
  it('should generate code of specified length', () => {
    expect(randomCode(6)).toHaveLength(6)
    expect(randomCode(10)).toHaveLength(10)
  })

  it('should only contain uppercase letters and digits', () => {
    expect(randomCode(100)).toMatch(/^[A-Z0-9]+$/)
  })

  it('should generate different codes', () => {
    const codes = new Set([randomCode(10), randomCode(10), randomCode(10)])
    expect(codes.size).toBe(3) // Highly unlikely to be duplicates
  })
})
