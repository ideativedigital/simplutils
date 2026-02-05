import { HasID } from '../objects'

/**
 * Checks if two objects with an `id` property have the same id.
 * @param t1 - The first element to compare
 * @param t2 - The second element to compare
 * @returns True if both elements have the same id
 * @example
 * hasSameId({ id: 1, name: 'Alice' }, { id: 1, name: 'Bob' }) // => true
 * hasSameId({ id: 1 }, { id: 2 }) // => false
 */
export function hasSameId<T extends HasID<any>>(t1: T, t2: T) {
  return t1.id === t2.id
}

/**
 * Finds an element in an array by its id.
 * @param arr - The array to search
 * @param id - The id to find
 * @returns The element with the matching id, or undefined if not found
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * findById(users, 1) // => { id: 1, name: 'Alice' }
 * findById(users, 3) // => undefined
 */
export const findById = <T extends HasID<any>>(arr: T[], id: T['id']) => {
  return arr.find(e => e.id === id)
}

/**
 * Removes an element from an array by its id and returns both the new array and the removed element.
 * @param arr - The source array
 * @param id - The id of the element to remove
 * @returns A tuple of [new array without the element, the removed element or undefined]
 * @example
 * const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * pullById(users, 1) // => [[{ id: 2, name: 'Bob' }], { id: 1, name: 'Alice' }]
 * pullById(users, 3) // => [[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }], undefined]
 */
export const pullById = <T extends HasID<any>>(arr: T[], id: T['id']): [T[], T | undefined] => {
  const found = arr.find(e => e.id === id)
  const newArray = found ? arr.filter(e => e.id !== id) : arr
  return [newArray, found]
}

/**
 * Merges two arrays of objects with ids, replacing elements in source with matching elements from arr.
 * Elements in arr that don't exist in source are appended at the end.
 * @param source - The base array
 * @param arr - The array of elements to merge in
 * @returns A new array with merged elements
 * @example
 * const source = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }]
 * const updates = [{ id: 2, v: 'updated' }, { id: 3, v: 'new' }]
 * mergeArraysWithId(source, updates)
 * // => [{ id: 1, v: 'a' }, { id: 2, v: 'updated' }, { id: 3, v: 'new' }]
 */
export const mergeArraysWithId = <T extends HasID<any>>(source: T[], arr: T[]) => {
  const [res, newArr] = source.reduce(
    (_acc, e) => {
      const [acc, toInsert] = _acc as [T[], T[]]
      const [newToInsert, found] = pullById(toInsert, e.id)
      return [[...acc, found ?? e], newToInsert]
    },
    [[] as T[], [...arr]]
  )
  return [...res, ...newArr]
}

/**
 * Inserts or updates an element in an array based on its id.
 * If an element with the same id exists, it's replaced. Otherwise, the element is appended.
 * @param source - The source array
 * @param elem - The element to upsert
 * @returns A new array with the element upserted
 * @example
 * const users = [{ id: 1, name: 'Alice' }]
 * upsertWithId(users, { id: 1, name: 'Alicia' }) // => [{ id: 1, name: 'Alicia' }]
 * upsertWithId(users, { id: 2, name: 'Bob' }) // => [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 */
export const upsertWithId = <T extends HasID<any>>(source: T[], elem: T) => {
  return mergeArraysWithId(source, [elem])
}

/**
 * Static class providing utility methods for arrays of objects with ids.
 * Provides convenient access to id-based array operations.
 * @example
 * IdArrays.find(users, 1)
 * IdArrays.upsert(users, newUser)
 */
export class IdArrays {
  private constructor() { }

  static equals = hasSameId
  static find = findById
  static pull = pullById
  static merge = mergeArraysWithId
  static upsert = upsertWithId
}
