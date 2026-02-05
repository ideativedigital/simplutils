import { AnyObject } from '../objects'
import { Nullable, isDefined } from '../types'

export const zipWithIndex = <T>(arr: T[]): [T, number][] => {
  return arr.map((t, i) => [t, i])
}

export type SortableProp<T extends AnyObject, K extends keyof T> = T[K] extends string
  ? K
  : T[K] extends number
  ? K
  : never

export type Sorter<T extends AnyObject> = {
  <T>(t1: T, t2: T): number
  key<K extends keyof T>(k: SortableProp<T, K>, dir?: 'asc' | 'desc'): Sorter<T>
}
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

export type Predicate<T> = (t: T) => boolean
export type Filter<T> = Predicate<T> & {
  and<U extends T>(p: Predicate<U>): Filter<U>
  or<U extends T>(p: Predicate<U>): Filter<U>
}
export const createFilter = <T>(initial: Predicate<T>): Filter<T> => {
  const filter = (t: T) => initial(t)
  filter.and = <U extends T>(p: Predicate<U>) => createFilter<U>(t => initial(t) && p(t))
  filter.or = <U extends T>(p: Predicate<U>) => createFilter<U>(t => initial(t) || p(t))
  return filter
}

export type optArray<T> = Nullable<T>[]

export const removeUndefinedItems = <T>(value: optArray<T>): T[] => {
  return value.filter(isDefined)
}
