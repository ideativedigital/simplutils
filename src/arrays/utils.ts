/**
 * Function signature for take with multiple overloads.
 */
export type Take = {
  <T>(array: T[], n: number): T[]
  <T>(array: T[], start: number, n?: number): T[]
}

/**
 * Takes a specified number of elements from an array, optionally starting from a given index.
 * @param array - The source array
 * @param param - When called with 2 arguments: the number of elements to take from the start.
 *                When called with 3 arguments: the starting index.
 * @param n - The number of elements to take (when using start index)
 * @returns A new array containing the taken elements
 * @example
 * take([1, 2, 3, 4, 5], 3)     // => [1, 2, 3]
 * take([1, 2, 3, 4, 5], 1, 3)  // => [2, 3, 4]
 */
export const take: Take = <T>(array: T[], param: number, n?: number) => {
  const start = typeof n === 'number' ? param : 0
  const count = typeof n === 'number' ? start + n : param
  return array.slice(start, count)
}

/**
 * Create a batched array
 * @param array the original array
 * @param size the size of each chunks
 * @returns the batches
 */
export const batch = <T>(array: T[], size: number): T[][] => {
  return array.reduce((acc, i) => {
    if (acc.length === 0) return [[i]]
    const lastBatch = acc[acc.length - 1]!
    if (lastBatch.length >= size) return [...acc, [i]]
    else {
      const untilLastBatch = acc.length - 1
      return [...take(acc, untilLastBatch), [...lastBatch, i]]
    }
  }, [] as T[][])
}

/**
 * remove duplicates from an array
 * @param array the array to check
 * @param uniqFn the function to fun on each element to know if they're unique
 * @returns array without duplicates according to the function
 */
export const unique = <T>(
  array: T[],
  uniqFn?: T extends object ? keyof T | ((t: T) => string) : (t: T) => string
): T[] => {
  const valueTransformer: (t: T) => any =
    typeof uniqFn === 'string'
      ? (t: T) => t[uniqFn as keyof T]
      : typeof uniqFn === 'function'
        ? uniqFn
        : (t: T) => t
  return array.reduce((acc, e) => {
    return acc.find(previousElement => valueTransformer(previousElement) === valueTransformer(e))
      ? acc
      : [...acc, e]
  }, [] as T[])
}

/**
 * Number Aggregator on an array
 * @param op the setup for the operation
 * @param initial the initial value
 * @returns the operation ready to receive params
 */
export const numberAggregator =
  (op: (n1: number, n2: number, idx: number, length: number) => number, initial?: number) =>
    <T>(array: T[]): T extends number ? number : (transform: (t: T) => number) => number => {
      if (array.length === 0) return (initial ?? 0) as any
      else if (typeof array[0] === 'number')
        return array.reduce(
          (acc, e, i, arr) => (acc ? op(acc, e as number, i, arr.length) : (e as number)),
          initial
        ) as any
      else
        return ((transform: (t: T) => number) =>
          array.reduce(
            (acc, e, i, arr) => (acc ? op(acc, transform(e), i, arr.length) : transform(e)),
            initial
          )) as any
    }

/**
 * Sum an array using the Number Aggregator
 */
export const sum = numberAggregator((n1, n2) => n1 + n2, 0)

/**
 * Multiply an array using the Number Aggregator
 */
export const mul = numberAggregator((n1, n2) => n1 * n2, 1)

/**
 * Find the max in an array using the Number Aggregator
 */
export const max = numberAggregator((n1, n2) => (n1 > n2 ? n1 : n2))

/**
 * Find the min in an array using the Number Aggregator
 */
export const min = numberAggregator((n1, n2) => (n1 < n2 ? n1 : n2))

/**
 * Upserts an element into an array provided a matcher
 * @param arr the source array
 * @param elem the element to add
 * @param matcher the matcher
 * @returns the updated array
 */
export function upsert<T>(arr: T[], elem: T, matcher: (t1: T, t2: T) => boolean): T[] {
  const { array, found } = arr.reduce(
    ({ array, found }, e) => {
      if (matcher(elem, e)) {
        return { array: [...array, elem], found: true }
      } else {
        return { array: [...array, e], found }
      }
    },
    { array: [] as T[], found: false }
  )
  return found ? array : [...array, elem]
}

/**
 * Splits an array into two arrays based on a predicate function.
 * @param arr - The source array
 * @param predicate - A function that returns true for elements that should go in the first array
 * @returns A tuple of two arrays: [elements matching predicate, elements not matching]
 * @example
 * partition([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // => [[2, 4], [1, 3, 5]]
 */
export function partition<T>(arr: T[], predicate: (t: T) => boolean): [T[], T[]] {
  return arr.reduce(
    ([left, right], e) => (predicate(e) ? [[...left, e], right] : [left, [...right, e]]),
    [[], []] as [T[], T[]]
  )
}

/**
 * Take elements while the predicate is true
 * @param arr the array
 * @param predicate the predicate to respect
 * @returns the elements that respected the predicate until the first that didn't
 */
export const takeWhile = <T>(
  arr: T[],
  predicate: (el: T) => boolean,
  includeLast: boolean = false
): T[] => {
  const result = []
  for (const el of arr) {
    if (predicate(el)) result.push(el)
    else {
      if (includeLast) result.push(el)
      break
    }
  }
  return result
}
