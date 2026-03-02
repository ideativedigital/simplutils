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
type MergeArraysWithIdOptions<T, id> = {
  getId?: (item: T) => id
  pruneMissing?: boolean
  mergeItem?: (sourceItem: T, incomingItem: T) => T
}

const defaultGetId = <T extends HasID<any>>(item: T): T['id'] => item.id

/**
 * Merges two arrays by logical id with optional custom id resolver.
 * By default it keeps source order, replaces matches from incoming, and appends new incoming.
 * If `pruneMissing` is true, output follows incoming and omits source items not present in incoming.
 */
export const mergeArraysWithId = <T, id = T extends HasID<infer I> ? I : never>(
  source: T[],
  arr: T[],
  options?: MergeArraysWithIdOptions<T, id>
) => {
  const getId = (options?.getId ?? defaultGetId) as (item: T) => id
  const mergeItem = options?.mergeItem ?? ((_source: T, incoming: T) => incoming)
  const pruneMissing = options?.pruneMissing === true

  const incomingMap = new Map<id, T>()
  arr.forEach(item => incomingMap.set(getId(item), item))

  if (pruneMissing) {
    const sourceMap = new Map<id, T>()
    source.forEach(item => sourceMap.set(getId(item), item))
    return arr.map(item => {
      const existing = sourceMap.get(getId(item))
      return existing ? mergeItem(existing, item) : item
    })
  }

  const used = new Set<id>()
  const mergedSource = source.map(item => {
    const key = getId(item)
    const incoming = incomingMap.get(key)
    if (!incoming) return item
    used.add(key)
    return mergeItem(item, incoming)
  })
  const appended = arr.filter(item => !used.has(getId(item)))
  return [...mergedSource, ...appended]
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
  return mergeArraysWithId(source, [elem], { getId: e => e.id })
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
