/**
 * Checks if a string is valid JSON.
 * @param str - The string to check
 * @returns True if the string can be parsed as JSON, false otherwise
 * @example
 * isJson('{"name": "Alice"}') // => true
 * isJson('not json')          // => false
 * isJson('')                  // => false
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Parses a JSON string, returning a default value if parsing fails.
 * @param str - The string to parse
 * @param defaultValue - The value to return if parsing fails
 * @returns The parsed JSON object, or defaultValue if parsing fails
 * @example
 * parseJson('{"name": "Alice"}', {}) // => { name: 'Alice' }
 * parseJson('invalid', { name: 'default' }) // => { name: 'default' }
 */
export function parseJson(str: string, defaultValue: any): any {
  try {
    return JSON.parse(str)
  } catch (e) {
    return defaultValue
  }
}
