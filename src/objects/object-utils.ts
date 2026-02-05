import lodashEquals from 'lodash.isequal'
import { ZodType } from 'zod'
import { TypeHolder } from '../types'

/**
 * A generic object type with string keys and any values.
 */
export type AnyObject = Record<string, any>

/**
 * Type representing an object that has an ID property.
 * @template ID - The type of the ID
 * @template IDKey - The key name for the ID (default: 'id')
 */
export type HasID<ID = any, IDKey extends string = 'id'> = {
  [key in IDKey]: ID
}

/**
 * Is this an existing object with at least one element
 * @param obj the tested object
 * @returns true if this is an object with at least one element false otherwise
 */
export const objectIsNotEmpty = (obj: object | undefined) => {
  return typeof obj === 'object' && Object.keys(obj).length > 0
}

/**
 * Map the keys of an object
 * @param obj  the original object
 * @param fn the key mapper
 * @returns the object with the new keys
 */
export const mapKeys = <V>(obj: Record<string, V>, fn: (k: string) => string) => {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, [fn(k)]: v }),
    {} as Record<string, V>
  )
}

/**
 * TODO enhance
 */
export type addSuffixToObject<T extends Record<string, any>, S extends string> = {
  [K in keyof T as K extends string ? `${K}${S}` : never]: T[K]
}

/**
 * Adds the prefix to a string
 */
export type addPrefix<Key, Prefix extends string> = Key extends string ? `${Prefix}${Key}` : never
/**
 * Adds the prefix to object keys
 */
export type prefixedObject<P extends string, R extends Record<string, any>> = {
  [K in keyof R as addPrefix<K, P>]: R[K]
}

/**
 * add the prefix to the keys of an object
 * @param prefix the prefix
 * @param obj the object
 * @returns the object with prefixed keys
 */
export const prefixKeys = <P extends string, R extends Record<string, any>>(
  prefix: P,
  obj: R
): prefixedObject<P, R> => {
  return mapKeys(obj, s => `${prefix}${s}`) as prefixedObject<P, R>
}

/**
 * Removes the prefix from string
 */
export type removePrefix<PrefixedKey, Prefix extends string> =
  PrefixedKey extends addPrefix<infer Key, Prefix> ? Key : ''
/**
 * Removes the prefix from object keys
 */
export type unprefixedObject<P extends string, WP extends Record<addPrefix<string, P>, any>> = {
  [k in removePrefix<keyof WP, P>]: WP[addPrefix<k, P>]
}

/**
 * Remove the prefix from the keys of an object
 * @param map the object
 * @param prefix the prefix to remove
 * @returns the unprefixed keys
 */
export const removePrefixFromKeys = <
  P extends string,
  WP extends Record<addPrefix<string, P>, any>
>(
  map: WP,
  prefix: P
): unprefixedObject<P, WP> => {
  return Object.entries(map).reduce(
    (acc, [k, v]) => ({ ...acc, [k.startsWith(prefix) ? k.substring(prefix.length) : k]: v }),
    {} as unprefixedObject<P, WP>
  )
}

/**
 * lowercase the keys
 */
export type lowerCaseKeys<O extends Record<string, any>> = {
  [k in keyof O extends string ? keyof O : never as Lowercase<k>]: O[k]
}

/**
 * Lowercase the keys of an object
 * @param o the object
 * @returns the lowercased object
 */
export const lowerCaseKeys = <O extends Record<string, any>>(o: O): lowerCaseKeys<O> => {
  return Object.entries(o).reduce(
    (acc, [k, v]) => ({ ...acc, [k.toLocaleLowerCase()]: v }),
    {} as lowerCaseKeys<O>
  )
}
/**
 * uppercase the keys
 */
export type upperCaseKeys<O extends Record<string, any>> = {
  [k in keyof O extends string ? keyof O : never as Uppercase<k>]: O[k]
}
/**
 * Uppercase the keys of an object
 * @param o the object
 * @returns the uppercased object
 */
export const upperCaseKeys = <O extends Record<string, any>>(o: O): upperCaseKeys<O> => {
  return Object.entries(o).reduce(
    (acc, [k, v]) => ({ ...acc, [k.toLocaleUpperCase()]: v }),
    {} as upperCaseKeys<O>
  )
}

/**
 * Remove keys from an object
 * @param obj the object
 * @param keys the keys to omit
 */
export const omit = <O extends Record<string, any>, K extends keyof O>(
  obj: O,
  ...keys: Readonly<K[]>
): Omit<O, K> => {
  return Object.entries(obj).reduce(
    (acc, [k, v]) =>
      keys.includes(k as K)
        ? acc
        : {
          ...acc,
          [k]: v
        },
    {} as Omit<O, K>
  )
}

/**
 * pick only keys from an object
 * @param obj the object
 * @param keys the keys to pick
 */
export const pick = <O extends AnyObject, K extends keyof O>(
  obj: O,
  ...keys: Readonly<K[]>
): Pick<O, K> => {
  return Object.entries(obj).reduce(
    (acc, [k, v]) =>
      keys.includes(k as K)
        ? {
          ...acc,
          [k]: v
        }
        : acc,
    {} as Pick<O, K>
  )
}

export type ResultTuple<S extends AnyObject, K extends Array<keyof S>> = {
  [Index in keyof K]: S[K[Index]]
} & { length: K['length'] }

/**
 * Picks values from an object and returns them as a tuple (array).
 * @param obj - The source object
 * @param keys - The keys to pick, in order
 * @returns A tuple of values in the same order as the keys
 * @example
 * const user = { name: 'Alice', age: 30, city: 'NYC' }
 * pickAsArray(user, 'name', 'age') // => ['Alice', 30]
 */
export const pickAsArray = <O extends AnyObject, K extends (keyof O)[]>(
  obj: O,
  ...keys: K
): ResultTuple<O, K> => {
  return keys.map(k => obj[k]) as ResultTuple<O, K>
}

/**
 * Map the values of an object while keeping its structure
 * @param object the original object
 * @param fn the mapper
 * @returns the object with mapped values
 */
export const mapValues = <M extends AnyObject, U>(
  object: M,
  fn: (value: M[keyof M], key: keyof M, index: number) => U
) => {
  return Object.entries(object).reduce(
    (acc, [k, v], index) => ({ ...acc, [k]: fn(v, k, index) }),
    {} as Record<keyof M, U>
  )
}

/**
 * group the objects using a fuction to define the key
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
export const groupBy = <O extends Record<any, any>>(
  objects: O[],
  fn: (o: O) => string | undefined
): Record<string, O[]> => {
  return objects.reduce(
    (acc, o) => {
      const k = fn(o)
      if (!k) return acc
      return {
        ...acc,
        [k]: [...(acc[k] ?? []), o]
      }
    },
    {} as Record<string, O[]>
  )
}

/**
 * group the objects by one of their keys
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
export const groupByKey = <O extends Record<any, any>, K extends keyof O>(
  objects: O[],
  k: K
): Record<O[K], O[]> => {
  return objects.reduce(
    (acc, o) => ({
      ...acc,
      [o[k]]: [...(acc[o[k]] ?? []), o]
    }),
    {} as Record<O[K], O[]>
  )
}

/**
 * group the objects by one of their keys as unique id
 * @param objects the objects
 * @param k the key to group on
 * @returns the grouped objects
 */
export const groupById = <O extends Record<any, any>, K extends keyof O>(
  objects: O[],
  k: K
): Record<O[K], O> => {
  return objects.reduce(
    (acc, o) => ({
      ...acc,
      [o[k]]: o
    }),
    {} as Record<O[K], O>
  )
}

/**
 * Creates a reusable picker function that extracts specific keys from objects.
 * @param type - A TypeHolder or ZodType for type inference
 * @param keys - The keys to pick
 * @returns A function that picks the specified keys from an object
 * @example
 * const pickName = picker(withType<User>(), 'name', 'email')
 * const nameAndEmail = pickName(user)
 */
export const picker =
  <T extends AnyObject, K extends keyof T>(type: TypeHolder<T> | ZodType<T>, ...keys: K[]) =>
    (obj: T): Pick<T, K> => {
      return Object.entries(obj).reduce(
        (acc, [k, v]) => (keys.includes(k as K) ? { ...acc, [k]: v } : acc),
        {} as Pick<T, K>
      )
    }

/**
 * Type representing an object with its keys and values swapped.
 */
export type Swapped<O extends Record<string, string>> = { [K in keyof O as O[K]]: K }

/**
 * Swaps the keys and values of an object.
 * @param obj - An object with string keys and string values
 * @returns A new object where original values become keys and original keys become values
 * @example
 * swapObject({ a: 'x', b: 'y' })
 * // => { x: 'a', y: 'b' }
 */
export const swapObject = <O extends Record<string, string>>(obj: O): Swapped<O> => {
  return Object.entries(obj).reduce((acc, [v, k]) => ({ ...acc, [k]: v }), {} as Swapped<O>)
}

/**
 * Removed the undefined parts of an object
 * @param obj the object
 * @returns the sanitized object
 */
export function removeUndefined<T extends AnyObject>(obj: T): T {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => (typeof v === 'undefined' || v === null ? acc : { ...acc, [k]: v }),
    {} as T
  )
}

export { lodashEquals }

/**
 * Deep equality check for objects
 * @param obj1 First object
 * @param obj2 Second object
 * @returns boolean indicating whether the objects are deeply equal
 */
export function deepEqual<T extends AnyObject>(
  obj1: T,
  obj2: AnyObject,
  opts: { strict: boolean } = { strict: true }
): obj2 is T {
  if (opts.strict) {
    return lodashEquals(obj1, obj2)
  } else {
    const obj1Keys = Object.keys(obj1)
    return lodashEquals(obj1, pick(obj2, ...obj1Keys))
  }
}

function isObject(object: any): boolean {
  return object != null && typeof object === 'object'
}

/**
 * Deep equality check for arrays
 * @param arr1 First array
 * @param arr2 Second array
 * @returns boolean indicating whether the arrays are deeply equal
 */
export function deepArrayEqual<T extends AnyObject>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!deepArrayEqual(arr1[i] as any, arr2[i] as any)) {
        return false
      }
    } else if (isObject(arr1[i]) && isObject(arr2[i])) {
      if (!deepEqual(arr1[i]!, arr2[i]!)) {
        return false
      }
    } else if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

/**
 * Check if a parameter is an instance of any class
 * @param obj the parameter to check
 * @returns true if the parameter is an instance of any class, false otherwise
 */
export function isInstanceOfAnyClass(obj: any): boolean {
  return obj != null && typeof obj === 'object' && obj.constructor !== Object
}

/**
 * Recursively substitutes values in an object/array that match a condition.
 * Traverses nested objects and arrays, replacing values that match the condition.
 * Class instances are not traversed.
 * @param obj - The object or array to process
 * @param condition - A type guard function that identifies values to replace
 * @param replace - A function that returns the replacement value
 * @returns A new object/array with substitutions applied
 * @example
 * const data = { name: 'Alice', nested: { value: null } }
 * substitute(data, (v): v is null => v === null, () => 'N/A')
 * // => { name: 'Alice', nested: { value: 'N/A' } }
 */
export const substitute = <T, U>(
  obj: any,
  condition: (r: any) => r is T,
  replace: (r: any) => U
): any => {
  if (condition(obj)) {
    return replace(obj)
  } else if (Array.isArray(obj)) {
    return obj.map(o => substitute(o, condition, replace))
  } else if (isInstanceOfAnyClass(obj)) return obj
  else if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: substitute(value, condition, replace)
      }),
      {}
    )
  }
  return obj
}
