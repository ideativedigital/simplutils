import { interpolate, replaceInOrder, validateStringAgainstInterpolatorKeys } from '../../src/strings/interpolation'

describe('interpolate', () => {
  it('should replace single-brace placeholders', () => {
    expect(interpolate('Hello, {name}!', { name: 'World' })).toBe('Hello, World!')
  })

  it('should handle multiple placeholders', () => {
    expect(interpolate('{greeting}, {name}!', { greeting: 'Hi', name: 'Alice' }))
      .toBe('Hi, Alice!')
  })

  it('should handle repeated placeholders', () => {
    expect(interpolate('{x} + {x} = {y}', { x: 1, y: 2 })).toBe('1 + 1 = 2')
  })

  it('should leave unmatched placeholders', () => {
    expect(interpolate('Hello, {name}!', {})).toBe('Hello, {name}!')
  })

  it('should support custom matcher', () => {
    expect(interpolate('Hello, ${name}!', { name: 'World' }, ['\\${', '}'])).toBe('Hello, World!')
  })

  it('should handle numbers and other primitives', () => {
    expect(interpolate('Value: {value}', { value: 42 })).toBe('Value: 42')
  })

  it('should support dot notation for nested objects', () => {
    expect(interpolate('City: {address.city}', { address: { city: 'NYC' } })).toBe('City: NYC')
  })

  it('should handle primitive as interpolator', () => {
    expect(interpolate('Result: {any}', 42 as any)).toBe('Result: 42')
  })
})

describe('validateStringAgainstInterpolatorKeys', () => {
  it('should not throw when all keys are present', () => {
    // Uses ${} syntax by default
    expect(() => validateStringAgainstInterpolatorKeys('${name} is ${age} years old', ['name', 'age'])).not.toThrow()
  })

  it('should throw when keys are missing', () => {
    expect(() => validateStringAgainstInterpolatorKeys('${name}', [])).toThrow('missing keys')
  })

  it('should return undefined for string without placeholders', () => {
    expect(validateStringAgainstInterpolatorKeys('Hello World', [])).toBeUndefined()
  })
})

describe('replaceInOrder', () => {
  it('should replace [placeholder] brackets in order', () => {
    // replaceInOrder uses [...] syntax and takes rest params
    expect(replaceInOrder('[a] + [b] = [c]', '1', '2', '3')).toBe('1 + 2 = 3')
  })

  it('should handle fewer replacements than placeholders', () => {
    // Unreplaced placeholders stay as-is
    expect(replaceInOrder('[a] + [b] = [c]', '1', '2')).toBe('1 + 2 = [c]')
  })

  it('should handle string with placeholder text', () => {
    expect(replaceInOrder('Hello [name], your id is [id]', 'Alice', '123')).toBe('Hello Alice, your id is 123')
  })
})
