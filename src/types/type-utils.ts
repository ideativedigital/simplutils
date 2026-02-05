import { ZodType } from 'zod'
import { TypeHolder } from './class'


export type RecordKey = string | number | symbol
export type Primitive = RecordKey | bigint | boolean | null | undefined

export type AnyExtraSources = Record<string, TypeHolder<any> | ZodType<any>>

export type outputType<T extends TypeHolder<any> | ZodType<any>> =
  T extends ZodType<any> ? T['_output'] : T extends TypeHolder<any> ? T['Out'] : never

export type ExtraSources<ES extends AnyExtraSources> = { [k in keyof ES]: outputType<ES[k]> }

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type Validator<T> = (obj: any) => obj is T
export const validate =
  <T>(predicate: (obj: any) => boolean): Validator<T> =>
    (obj: any): obj is T => {
      return predicate(obj)
    }

export type Empty = null | undefined

export const isString = validate<string>(s => typeof s === 'string')

export const isNumber = validate<number>(n => typeof n === 'number')
export const isEmpty = validate<Empty>(o => typeof o === 'undefined' || o === null)

export const isEmptyObject = validate<{}>(
  o => typeof o === 'object' && Object.getOwnPropertyNames(o).length === 0
)
export const isEmptyArray = validate<[]>(o => Array.isArray(o) && o.length === 0)
export const hasCharacters = validate<string>(o => isString(o) && o.trim() !== '')

export type Nullable<T> = T | null | false | undefined | '' | 0

export const isDefined = <T>(t: Nullable<T>): t is T =>
  t !== null && t !== undefined && t !== false && t !== ''

export function mapDefined<U, T>(t: T | null | undefined, fn: (t: T) => U) {
  if (t === undefined || t === null) {
    return undefined
  }
  return fn(t)
}
