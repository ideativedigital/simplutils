type primitive = number | string | boolean

type Interpolator = { [k: string]: Interpolator | primitive | Error }

type InterpolatorMatcher = [string, string]

const stripMatcher = (str: string, matcher: InterpolatorMatcher) =>
  str.replace(new RegExp(matcher[0]), '').replace(new RegExp(matcher[1]), '')
/**
 *
 * @param str the string to interpolate into
 * @param interpolator the interpolator object
 * @returns the interpolated string
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
