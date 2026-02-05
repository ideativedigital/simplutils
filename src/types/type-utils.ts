import { ZodType } from 'zod'
import { TypeHolder } from './class'

/**
 * Valid types for object keys: string, number, or symbol.
 */
export type RecordKey = string | number | symbol

/**
 * JavaScript primitive types.
 */
export type Primitive = RecordKey | bigint | boolean | null | undefined

/**
 * A record of type sources (TypeHolder or ZodType) for dependency injection patterns.
 */
export type AnyExtraSources = Record<string, TypeHolder<any> | ZodType<any>>

/**
 * Extracts the output type from a TypeHolder or ZodType.
 */
export type outputType<T extends TypeHolder<any> | ZodType<any>> =
  T extends ZodType<any> ? T['_output'] : T extends TypeHolder<any> ? T['Out'] : never

/**
 * Maps a record of type sources to their output types.
 */
export type ExtraSources<ES extends AnyExtraSources> = { [k in keyof ES]: outputType<ES[k]> }

/**
 * Type-level enumeration from 0 to N-1.
 * @example
 * type Nums = Enumerate<3> // 0 | 1 | 2
 */
export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

/**
 * Type representing a range of integers from F (inclusive) to T (exclusive).
 * @example
 * type Range = IntRange<2, 5> // 2 | 3 | 4
 */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

/**
 * A type guard function that narrows the type of its argument.
 */
export type Validator<T> = (obj: any) => obj is T

/**
 * Creates a type guard (Validator) from a predicate function.
 * @param predicate - A function that returns true if the value matches the expected type
 * @returns A type guard function
 * @example
 * const isPositive = validate<number>(n => typeof n === 'number' && n > 0)
 * if (isPositive(value)) {
 *   // value is typed as number here
 * }
 */
export const validate =
  <T>(predicate: (obj: any) => boolean): Validator<T> =>
    (obj: any): obj is T => {
      return predicate(obj)
    }

/**
 * Type representing null or undefined values.
 */
export type Empty = null | undefined

/**
 * Type guard that checks if a value is a string.
 */
export const isString = validate<string>(s => typeof s === 'string')

/**
 * Type guard that checks if a value is a number.
 */
export const isNumber = validate<number>(n => typeof n === 'number')

/**
 * Type guard that checks if a value is null or undefined.
 */
export const isEmpty = validate<Empty>(o => typeof o === 'undefined' || o === null)

/**
 * Type guard that checks if a value is an empty object (no own properties).
 */
export const isEmptyObject = validate<{}>(
  o => typeof o === 'object' && Object.getOwnPropertyNames(o).length === 0
)

/**
 * Type guard that checks if a value is an empty array.
 */
export const isEmptyArray = validate<[]>(o => Array.isArray(o) && o.length === 0)

/**
 * Type guard that checks if a value is a non-empty string (after trimming).
 */
export const hasCharacters = validate<string>(o => isString(o) && o.trim() !== '')

/**
 * A type representing values that are considered "falsy" or empty.
 * Includes null, undefined, false, empty string, and 0.
 */
export type Nullable<T> = T | null | false | undefined | '' | 0

/**
 * Type guard that checks if a value is defined (not null, undefined, false, or empty string).
 * @param t - The value to check
 * @returns True if the value is defined and truthy
 * @example
 * const items = [1, null, 2, undefined, 3]
 * const defined = items.filter(isDefined) // [1, 2, 3]
 */
export const isDefined = <T>(t: Nullable<T>): t is T =>
  t !== null && t !== undefined && t !== false && t !== ''

/**
 * Applies a function to a value if it's defined, otherwise returns undefined.
 * Similar to Option.map in functional programming.
 * @param t - The value to map (may be null/undefined)
 * @param fn - The function to apply if value is defined
 * @returns The mapped value, or undefined if input was null/undefined
 * @example
 * mapDefined(5, n => n * 2)        // => 10
 * mapDefined(null, n => n * 2)    // => undefined
 * mapDefined(undefined, n => n)   // => undefined
 */
export function mapDefined<U, T>(t: T | null | undefined, fn: (t: T) => U) {
  if (t === undefined || t === null) {
    return undefined
  }
  return fn(t)
}
