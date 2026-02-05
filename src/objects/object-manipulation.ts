import { camelCaseDots, CamelCaseKeyFromDottedKey } from '../strings/strings-utils'
import { TypeHolder } from '../types/class'
import { Primitive, RecordKey } from '../types/type-utils'

/**
 * A generic object type with string, number, or symbol keys.
 */
export type GenericObject = Record<RecordKey, unknown>

type Join<L extends Primitive | undefined, R extends Primitive | undefined> = L extends
  | string
  | number
  ? R extends string | number
  ? `${L}.${R}`
  : L
  : R extends string | number
  ? R
  : never

type Union<L extends unknown | undefined, R extends unknown> = L extends undefined ? R : L | R

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedPaths<T extends GenericObject, Prev extends Primitive | undefined = undefined> = {
  [K in keyof T]: T[K] extends GenericObject
  ? Union<Join<Prev, K>, NestedPaths<T[K], Join<Prev, K>>>
  : Union<Prev, Join<Prev, K>>
}[keyof T]

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type typeFromPath<T extends GenericObject, Path extends NestedPaths<T>> = Path extends string
  ? {
    [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
    ? S extends NestedPaths<T[P]>
    ? typeFromPath<T[P], S>
    : never
    : never
    : never
  }[Path]
  : never

export type setTypeAtPath<
  T extends GenericObject,
  Path extends NestedPaths<T>,
  M
> = Path extends string
  ? {
    [K in keyof T]: Path extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
    ? K extends P
    ? S extends NestedPaths<T[P]>
    ? setTypeAtPath<T[P], S, M>
    : never
    : T[K]
    : T[K]
    : K extends Path
    ? M
    : T[K]
  }
  : T

// thanks a lot https://javascript.plainenglish.io/advanced-typescript-type-level-nested-object-paths-7f3d8901f29a

/**
 * Merges a value at a nested path in an object.
 * Supports dot-notation paths and can accept either a value or a function to compute the new value.
 * @param obj - The source object
 * @param path - The dot-notation path to the property (e.g., 'user.address.city')
 * @param toMerge - The value to set, or a function that receives the current value and returns the new value
 * @returns A new object with the value merged at the specified path
 * @example
 * const obj = { user: { name: 'Alice', age: 30 } }
 * merge(obj, 'user.age', 31)
 * // => { user: { name: 'Alice', age: 31 } }
 *
 * merge(obj, 'user.age', age => age + 1)
 * // => { user: { name: 'Alice', age: 31 } }
 */
export const merge = <
  O extends GenericObject,
  P extends NestedPaths<O>,
  M extends GenericObject | Primitive | boolean | any[]
>(
  obj: O,
  path: P,
  toMerge: M | ((elem: typeFromPath<O, P>) => M)
): setTypeAtPath<O, P, M> => {
  const [head, ...parts] = (path as string).split('.') as string[]
  if (parts.length === 0) {
    const result = {
      ...obj,
      [head!]:
        typeof toMerge === 'function' ? toMerge(obj[head!] as typeFromPath<O, P>) : (toMerge as M)
    }
    return result as setTypeAtPath<O, P, M>
  } else {
    if (typeof obj[head!] !== 'object') {
      throw new Error(`Cannot merge ${path} into ${obj}`)
    }
    const result = {
      ...obj,
      [head!]: merge(obj[head!] as any, parts.join('.') as any, toMerge)
    }
    return result as setTypeAtPath<O, P, M>
  }
}

/**
 * Creates a reusable merge function for a specific path and value/transform.
 * @param typeHolder - A TypeHolder for type inference
 * @param path - The dot-notation path to merge at
 * @param toMerge - The value or transform function to apply
 * @returns A function that applies the merge to any object of the specified type
 * @example
 * const incrementAge = createMerger(withType<User>(), 'age', age => age + 1)
 * const older = incrementAge(user)
 */
export const createMerger = <
  O extends GenericObject,
  P extends NestedPaths<O>,
  M extends GenericObject | Primitive | boolean | any[]
>(
  typeHolder: TypeHolder<O>,
  path: P,
  toMerge: M | ((elem: typeFromPath<O, P>) => M)
): ((o: O) => setTypeAtPath<O, P, M>) => {
  return (o: O) => merge(o, path, toMerge)
}

/**
 * Type for specifying which nested paths to pick from an object.
 * Use `true` to include a leaf property, or a nested object to pick nested properties.
 */
export type PickerPath<O extends GenericObject> = {
  [k in keyof O]?: O[k] extends GenericObject ? PickerPath<O[k]> | true : true
}

/**
 * The resulting type after picking paths from an object.
 */
export type Picker<O extends GenericObject, P extends PickerPath<O>> = {
  [k in keyof P]: O[k] extends GenericObject
  ? P[k] extends PickerPath<O[k]>
  ? Picker<O[k], P[k]>
  : never
  : O[k]
}

/**
 * Picks specific nested paths from an object, preserving the structure.
 * @param obj - The source object
 * @param picker - An object specifying which paths to pick (use `true` to include a path)
 * @returns A new object containing only the picked paths
 * @example
 * const user = { name: 'Alice', address: { city: 'NYC', zip: '10001' } }
 * pickWithPaths(user, { name: true, address: { city: true } })
 * // => { name: 'Alice', address: { city: 'NYC' } }
 */
export const pickWithPaths = <O extends GenericObject, P extends PickerPath<O>>(
  obj: O,
  picker: Readonly<P>
): Picker<O, P> => {
  return Object.entries(picker).reduce(
    (acc, [k, v]) =>
      typeof v === 'object'
        ? { ...acc, [k]: pickWithPaths(obj[k] as GenericObject, v) }
        : { ...acc, [k]: obj[k] },
    {} as Picker<O, P>
  )
}

/**
 * The result type of pickAtPaths, with dot-notation paths converted to camelCase keys.
 */
export type PickAtPathResult<
  O extends GenericObject,
  P extends { [k in NestedPaths<O>]?: true }
> = {
    [k in keyof P as `${CamelCaseKeyFromDottedKey<
      string & k
    >}`]: k extends `${infer Pref}.${infer Suf}`
    ? O[Pref] extends GenericObject
    ? Suf extends NestedPaths<O[Pref]>
    ? typeFromPath<O[Pref], Suf>
    : never
    : never
    : O[k]
  }

const pickAtPath = <O extends GenericObject, P extends NestedPaths<O>>(
  obj: O,
  path: Readonly<P>
): typeFromPath<O, P> => {
  const result = path
    .toString()
    .split('.')
    .reduce((acc, p) => (acc as any)[p] ?? ({} as {}), obj as typeFromPath<O, P>)
  return result
}

/**
 * Picks values at multiple dot-notation paths, flattening them into a single object.
 * Path keys are converted to camelCase (e.g., 'user.firstName' becomes 'userFirstName').
 * @param obj - The source object
 * @param paths - An object with dot-notation paths as keys and `true` as values
 * @returns A flattened object with camelCase keys and the picked values
 * @example
 * const data = { user: { firstName: 'Alice', address: { city: 'NYC' } } }
 * pickAtPaths(data, { 'user.firstName': true, 'user.address.city': true })
 * // => { userFirstName: 'Alice', userAddressCity: 'NYC' }
 */
export const pickAtPaths = <O extends GenericObject, P extends { [k in NestedPaths<O>]?: true }>(
  obj: O,
  paths: Readonly<P>
): PickAtPathResult<O, P> => {
  return Object.keys(paths).reduce(
    (acc, p) => ({ ...acc, [camelCaseDots(p as string)]: pickAtPath(obj, p as NestedPaths<O>) }),
    {} as PickAtPathResult<O, P>
  )
}

/**
 * Creates a reusable picker function for specific paths.
 * @param _ - A TypeHolder for type inference
 * @param paths - The paths to pick
 * @returns A function that picks the specified paths from any object of the given type
 * @example
 * const pickUserInfo = pathPicker(withType<User>(), { 'profile.name': true })
 * const info = pickUserInfo(user)
 */
export const pathPicker = <O extends GenericObject, P extends { [k in NestedPaths<O>]?: true }>(
  _: TypeHolder<O>,
  paths: Readonly<P>
): ((obj: O) => PickAtPathResult<O, P>) => {
  return obj => pickAtPaths(obj, paths)
}
