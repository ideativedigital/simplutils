import { HasID } from '../objects'

/**
 * Do two hasID elems have the same id
 * @param t1 the first elem
 * @param t2 the second elem
 * @returns
 */
export function hasSameId<T extends HasID<any>>(t1: T, t2: T) {
  return t1.id === t2.id
}

export const findById = <T extends HasID<any>>(arr: T[], id: T['id']) => {
  return arr.find(e => e.id === id)
}

export const pullById = <T extends HasID<any>>(arr: T[], id: T['id']): [T[], T | undefined] => {
  const found = arr.find(e => e.id === id)
  const newArray = found ? arr.filter(e => e.id !== id) : arr
  return [newArray, found]
}

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

export const upsertWithId = <T extends HasID<any>>(source: T[], elem: T) => {
  return mergeArraysWithId(source, [elem])
}

export class IdArrays {
  private constructor() {}

  static equals = hasSameId
  static find = findById
  static pull = pullById
  static merge = mergeArraysWithId
  static upsert = upsertWithId
}
