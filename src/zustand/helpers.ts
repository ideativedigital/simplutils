import { AnyObject } from '../objects'
import { idType, resourceMethodConsolidationKey, ResourceMethodConsolidation } from '../resource'

export const getMethodConsolidation = (
  fn: unknown
): ResourceMethodConsolidation | undefined => {
  if (!fn || typeof fn !== 'function') return undefined
  return (fn as any)[resourceMethodConsolidationKey] as ResourceMethodConsolidation | undefined
}

export const defaultGetId = <T extends AnyObject, forceIdType = never>(item: T): idType<T, forceIdType> => {
  const value = (item as any)?.id ?? (item as any)?._id
  if (value === undefined || value === null) {
    throw new Error('Resource slice item must expose either `id` or `_id`, or provide a custom getId option.')
  }
  return value
}

export const updateById = <T extends AnyObject, forceIdType = never>(
  items: T[],
  target: idType<T, forceIdType>,
  getId: (item: T) => idType<T, forceIdType>,
  updater: (item: T) => T
): T[] => {
  let found = false
  const next = items.map(item => {
    if (getId(item) !== target) return item
    found = true
    return updater(item)
  })
  return found ? next : items
}

export const upsertById = <T extends AnyObject, forceIdType = never>(
  items: T[],
  nextItem: T,
  getId: (item: T) => idType<T, forceIdType>
): T[] => {
  const nextId = getId(nextItem)
  const replaced = updateById(items, nextId, getId, () => nextItem)
  return replaced === items ? [...items, nextItem] : replaced
}

export const removeById = <T extends AnyObject, forceIdType = never>(
  items: T[],
  id: idType<T, forceIdType>,
  getId: (item: T) => idType<T, forceIdType>
): T[] => items.filter(item => getId(item) !== id)
