import { isJson, parseJson } from '../../src/objects/json-utils'

describe('isJson', () => {
  it('should return true for valid JSON object', () => {
    expect(isJson('{"name": "Alice"}')).toBe(true)
  })

  it('should return true for valid JSON array', () => {
    expect(isJson('[1, 2, 3]')).toBe(true)
  })

  it('should return true for JSON primitives', () => {
    expect(isJson('"hello"')).toBe(true)
    expect(isJson('123')).toBe(true)
    expect(isJson('true')).toBe(true)
    expect(isJson('null')).toBe(true)
  })

  it('should return false for invalid JSON', () => {
    expect(isJson('not json')).toBe(false)
    expect(isJson('{invalid}')).toBe(false)
    expect(isJson('')).toBe(false)
  })
})

describe('parseJson', () => {
  it('should parse valid JSON', () => {
    expect(parseJson('{"name": "Alice"}', {})).toEqual({ name: 'Alice' })
  })

  it('should return default value for invalid JSON', () => {
    expect(parseJson('invalid', { default: true })).toEqual({ default: true })
  })

  it('should return default value for empty string', () => {
    expect(parseJson('', 'default')).toBe('default')
  })

  it('should parse arrays', () => {
    expect(parseJson('[1, 2, 3]', [])).toEqual([1, 2, 3])
  })
})
