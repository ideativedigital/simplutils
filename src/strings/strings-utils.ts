/**
 * A type that represents any string while preserving literal type inference.
 */
export type AnyString = string & {}

/**
 * Capitalizes the first letter of a string.
 * @param s - The string to capitalize
 * @returns The string with its first letter capitalized
 * @example
 * capitalize('hello')  // => 'Hello'
 * capitalize('WORLD')  // => 'WORLD'
 */
export const capitalize = <S extends string>(s: S): Capitalize<S> =>
  s.split('').reduce((acc, e) => (!acc ? e.toUpperCase() : `${acc}${e}`), '') as Capitalize<S>

/**
 * Capitalizes all parts of a first name, handling common separators found in many languages:
 * - Hyphens (-)
 * - Spaces ( )
 * - Apostrophes (')
 * - Curly apostrophes (’)
 * - Periods (.)
 *
 * Examples:
 *   "jean-luc" => "Jean-Luc"
 *   "anna maria" => "Anna Maria"
 *   "o'connor" => "O'Connor"
 *   "d’angelo" => "D’Angelo"
 *   "mary-jane o'neill" => "Mary-Jane O'Neill"
 *
 * @param firstname The input name string
 * @returns The capitalized name string
 */
export function capitalizeFirstname(firstname: string): string {
  // Regex to match all common separators (hyphen, space, apostrophe, curly apostrophe, period)
  const separatorRegex = /([\- '\u2019\.])/g
  // Split the name, keeping the separators in the result
  return firstname
    .split(separatorRegex)
    .map(part => {
      // If the part is a separator, return as is
      if (separatorRegex.test(part)) return part
      // Otherwise, capitalize the first letter and lowercase the rest
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join('')
}

/**
 * Type that converts a dotted key path to camelCase.
 * @example
 * type Result = CamelCaseKeyFromDottedKey<'user.first.name'>
 * // => 'userFirstName'
 */
export type CamelCaseKeyFromDottedKey<
  K extends string,
  hasPrefix extends boolean = false
> = K extends `${infer P}.${infer S}`
  ? `${P}${Capitalize<CamelCaseKeyFromDottedKey<S, true>>}`
  : hasPrefix extends true
  ? Capitalize<K>
  : K

/**
 * Converts a dot-notation string to camelCase.
 * @param s - The dotted string to convert
 * @returns The camelCase version of the string
 * @example
 * camelCaseDots('user.first.name')  // => 'userFirstName'
 * camelCaseDots('simple')           // => 'simple'
 */
export const camelCaseDots = <S extends string>(s: S): CamelCaseKeyFromDottedKey<S> =>
  s
    .split('.')
    .reduce((acc, e) => (!acc ? e : `${acc}${capitalize(e)}`), '') as CamelCaseKeyFromDottedKey<S>

/**
 * Make the string an id
 * @param str the raw string
 * @returns the id-like string
 */
export const idify = (str: string) =>
  str
    .toLowerCase()
    .replace(new RegExp('\\s', 'g'), '_')
    .replace(new RegExp('[àáâãäå]', 'g'), 'a')
    .replace(new RegExp('æ', 'g'), 'ae')
    .replace(new RegExp('ç', 'g'), 'c')
    .replace(new RegExp('[èéêë]', 'g'), 'e')
    .replace(new RegExp('[ìíîï]', 'g'), 'i')
    .replace(new RegExp('ñ', 'g'), 'n')
    .replace(new RegExp('[òóôõöø]', 'g'), 'o')
    .replace(new RegExp('œ', 'g'), 'oe')
    .replace(new RegExp('[ùúûü]', 'g'), 'u')
    .replace(new RegExp('[ýÿ]', 'g'), 'y')
    .replaceAll('/', '-')

/**
 * basic to string method for anything
 * @param elem anything
 * @returns a string
 */
export const toString = (elem: any) => {
  if (elem instanceof Date) {
    return elem.toISOString()
  }
  switch (typeof elem) {
    case 'string':
    case 'number':
    case 'boolean':
      return elem + ''
    case 'symbol':
    case 'bigint':
      return elem.toString()
    case 'function':
      return ''
    case 'undefined':
      return ''
    case 'object':
      try {
        const str = `${elem}`
        return str === `${{}}` ? JSON.stringify(elem) : str
      } catch (e) {
        console.error(e)
        return `${elem}`
      }
  }
}

/**
 * Hash the object to an hexadecimal string
 * @param obj the object to build a hash from
 * @param seed the optional seed
 * @returns the hash
 */
export const hashToHexa = (obj: any, seed: number = 0) => {
  const str = toString(obj)
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0)
  return hash.toString(16)
}

/**
 * Shortens a string to a maximum length, adding ellipsis in the middle if needed.
 * @param text - The text to shorten
 * @param maxLength - The maximum length (default: 9)
 * @returns The shortened string with '...' in the middle if truncated
 * @example
 * shorten('Hello World', 9)  // => 'He...rld'
 * shorten('Short', 9)        // => 'Short'
 */
export const shorten = (text: string, maxLength: number = 9) => {
  if (text.length < maxLength) return text
  return text.slice(0, 2) + '...' + text.slice(-3)
}

/**
 * Generates a random alphanumeric code of the specified length.
 * Uses uppercase letters (A-Z) and digits (0-9).
 * @param length - The length of the code to generate
 * @returns A random alphanumeric string
 * @example
 * randomCode(6)  // => 'A3B7K9' (random)
 * randomCode(4)  // => 'X2YZ' (random)
 */
export const randomCode = (length: number) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
