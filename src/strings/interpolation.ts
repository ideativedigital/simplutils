type primitive = number | string | boolean

/**
 * An object containing values for string interpolation.
 * Can be nested to support dot-notation paths.
 */
type Interpolator = { [k: string]: Interpolator | primitive | Error }

/**
 * A tuple defining the start and end markers for interpolation placeholders.
 */
type InterpolatorMatcher = [string, string]

const stripMatcher = (str: string, matcher: InterpolatorMatcher) =>
  str.replace(new RegExp(matcher[0]), '').replace(new RegExp(matcher[1]), '')

/**
 * Interpolates values into a string template using placeholder markers.
 * Supports nested object access using dot notation.
 * @param str - The string template with placeholders
 * @param interpolator - The object containing values to interpolate, or a primitive value
 * @param matcher - The placeholder markers as [start, end] (default: ['{', '}'])
 * @returns The interpolated string with placeholders replaced
 * @example
 * interpolate('Hello {name}!', { name: 'Alice' })
 * // => 'Hello Alice!'
 *
 * interpolate('City: {address.city}', { address: { city: 'NYC' } })
 * // => 'City: NYC'
 *
 * interpolate('Value: ${val}', { val: 42 }, ['${', '}'])
 * // => 'Value: 42'
 */
export const interpolate = (
  str: string,
  interpolator: Interpolator | primitive,
  matcher: InterpolatorMatcher = ['{', '}']
): string => {
  return str.replace(new RegExp(`${matcher[0]}.*?${matcher[1]}`, 'g'), g => {
    if (typeof interpolator !== 'object') return (interpolator as primitive) + ''
    const replacer = stripMatcher(g, matcher)
    const nest = replacer.split('.')
    let obj = interpolator
    for (let i = 0; i < nest.length; i++) {
      const key = nest[i]!
      const nested = (obj as any)?.[key]
      if (['string', 'number'].includes(typeof nested) && i === nest.length - 1) {
        return (nested + '') as string
      } else if (typeof nested === 'object') {
        obj = nested
      } else {
        return g
      }
    }
    return g
  })
}

/**
 * Validates that all placeholders in a string have corresponding keys in the allowed list.
 * Throws an error if any placeholder keys are missing from the allowed keys.
 * @param str - The string template to validate
 * @param keys - The list of allowed interpolation keys
 * @param matcher - The placeholder markers (default: ['\\${', '}'] for ${...} syntax)
 * @throws Error if any placeholder keys are not in the allowed list
 * @example
 * validateStringAgainstInterpolatorKeys('Hello ${name}', ['name', 'age'])
 * // => undefined (valid)
 *
 * validateStringAgainstInterpolatorKeys('Hello ${unknown}', ['name'])
 * // => throws Error: missing keys: unknown
 */
export const validateStringAgainstInterpolatorKeys = (
  str: string,
  keys: string[],
  matcher: InterpolatorMatcher = ['\\${', '}']
) => {
  const result = str.match(new RegExp(`${matcher[0]}.*?${matcher[1]}`, 'g'))
  if (!result) return
  const missingKeys = result.reduce((acc, g) => {
    const replacer = stripMatcher(g, matcher)
    return !keys.includes(replacer) ? [...acc, replacer] : acc
  }, [] as string[])
  if (missingKeys.length > 0)
    throw new Error(
      `Cannot validate ${str} against provider keys definition: ${keys}, missing keys: ${missingKeys.join(
        ', '
      )}`
    )
  return
}

/**
 * Will replace the different matcher elements in the string
 * matchers will look like this: [id] and can contain anything textual within the brackets
 * @param str the string to replace parts in
 * @param replacements the ordered replacements
 * @returns the modified string
 */
export const replaceInOrder = (str: string, ...replacements: string[]) => {
  let i = 0
  return str.replace(/\[.*?\]/g, g => {
    return replacements[i++] ?? g
  })
}
