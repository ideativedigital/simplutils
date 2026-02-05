import { AnyObject } from '../objects'
import { Nullable, isDefined } from '../types'

/**
 * Pairs each element in an array with its index.
 * @param arr - The input array to zip with indices
 * @returns An array of tuples where each tuple contains the element and its index
 * @example
 * zipWithIndex(['a', 'b', 'c'])
 * // => [['a', 0], ['b', 1], ['c', 2]]
 */
export const zipWithIndex = <T>(arr: T[]): [T, number][] => {
  return arr.map((t, i) => [t, i])
}

/**
 * Type helper that extracts keys from T whose values are strings or numbers (sortable types).
 */
export type SortableProp<T extends AnyObject, K extends keyof T> = T[K] extends string
  ? K
  : T[K] extends number
  ? K
  : never

/**
 * A chainable sorter function that can sort by multiple keys.
 */
export type Sorter<T extends AnyObject> = {
  <T>(t1: T, t2: T): number
  key<K extends keyof T>(k: SortableProp<T, K>, dir?: 'asc' | 'desc'): Sorter<T>
}

/**
 * Creates a chainable sorter for objects that can sort by multiple keys.
 * @returns A Sorter that can be used with Array.sort() and chained with .key() calls
 * @example
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Alice', age: 25 }
 * ]
 * users.sort(createSorter<typeof users[0]>().key('name', 'asc').key('age', 'desc'))
 * // => [{ name: 'Alice', age: 30 }, { name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }]
 */
export function createSorter<T extends AnyObject>(): Sorter<T> {
  const sortBuilder =
    <K extends keyof T>(k: SortableProp<T, K>, dir: 'asc' | 'desc') =>
      (t1: T, t2: T) => {
        const prop1 = t1[k as keyof T]
        const prop2 = t2[k as keyof T]
        const res: number =
          typeof prop1 === 'string'
            ? prop1.localeCompare(prop2)
            : typeof prop1 === 'number'
              ? prop1 - prop2
              : 0

        return dir === 'asc' ? res : -res
      }

  const addKey = (fn: (t1: T, t2: T) => number): Sorter<T> => {
    return Object.assign(fn, {
      key: <K extends keyof T>(k2: SortableProp<T, K>, dir2: 'asc' | 'desc' = 'asc') => {
        return addKey((t1, t2) => {
          const r1 = fn(t1, t2)
          return r1 || sortBuilder(k2, dir2)(t1, t2)
        })
      }
    }) as Sorter<T>
  }
  return addKey(() => 0)
}

/**
 * A function that takes a value and returns a boolean.
 */
export type Predicate<T> = (t: T) => boolean

/**
 * A composable filter that can be combined with other predicates using `and` and `or`.
 */
export type Filter<T> = Predicate<T> & {
  and<U extends T>(p: Predicate<U>): Filter<U>
  or<U extends T>(p: Predicate<U>): Filter<U>
}

/**
 * Creates a composable filter that can be chained with `and` and `or` operations.
 * @param initial - The initial predicate function
 * @returns A Filter that can be used with Array.filter() and combined with other predicates
 * @example
 * const isAdult = createFilter<{ age: number }>(u => u.age >= 18)
 * const isActive = (u: { active: boolean }) => u.active
 * const activeAdults = users.filter(isAdult.and(isActive))
 */
export const createFilter = <T>(initial: Predicate<T>): Filter<T> => {
  const filter = (t: T) => initial(t)
  filter.and = <U extends T>(p: Predicate<U>) => createFilter<U>(t => initial(t) && p(t))
  filter.or = <U extends T>(p: Predicate<U>) => createFilter<U>(t => initial(t) || p(t))
  return filter
}

/**
 * An array that may contain null or undefined values.
 */
export type optArray<T> = Nullable<T>[]

/**
 * Removes all null and undefined values from an array.
 * @param value - An array that may contain null or undefined values
 * @returns A new array with all null and undefined values removed
 * @example
 * removeUndefinedItems([1, null, 2, undefined, 3])
 * // => [1, 2, 3]
 */
export const removeUndefinedItems = <T>(value: optArray<T>): T[] => {
  return value.filter(isDefined)
}
