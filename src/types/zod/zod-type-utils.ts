import {
  ZodArray,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodEnum,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodString,
  ZodTypeAny,
  ZodUnion,
  z
} from 'zod'
import { ZodEffects, ZodNativeEnum } from 'zod/v3'
import { AnyObject } from '../../objects'
import { validate } from '../type-utils'

export const isZodNumber = validate<ZodNumber>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNumber'
)
export const isZodDate = validate<ZodDate>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDate'
)
export const isZodString = validate<ZodString>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodString'
)
export const isZodBoolean = validate<ZodBoolean>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodBoolean'
)

export const isZodType = validate<ZodTypeAny>(
  o =>
    typeof o === 'object' &&
    typeof o._def?.typeName === 'string' &&
    o._def?.typeName.startsWith('Zod')
)

export const keys = <K extends string>(r: Record<K, any>): K[] => Object.keys(r) as K[]

export function ObjectKeysEnum<K extends string>(obj: Record<K, any>) {
  return z.enum([keys(obj)[0]!, ...keys(obj)])
}

export const isZodObject = validate<ZodObject<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodObject'
)

export const isZodNullable = validate<ZodNullable<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNullable'
)

export const isZodOptional = validate<ZodOptional<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodOptional'
)
export const isZodDefault = validate<ZodDefault<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDefault'
)

export const isZodEffects = validate<ZodEffects<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodEffects'
)

export const isZodArray = validate<ZodArray<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodArray'
)
export const isZodRecord = validate<ZodRecord<any, any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodRecord'
)

export const isZodEnum = validate<ZodEnum<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodEnum'
)
export const isZodUnion = validate<ZodUnion<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodUnion'
)
export const isZodDiscriminatedUnion = validate<ZodDiscriminatedUnion<any, any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDiscriminatedUnion'
)
export const isZodNativeEnum = validate<ZodNativeEnum<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNativeEnum'
)

/**
 * Unwrap a zod type
 * @param zType the zod type to unwrap
 * @returns the unwrapped zod type
 */
const unwrapZType = (zType: ZodTypeAny): ZodTypeAny => {
  if (isZodNullable(zType)) {
    return unwrapZType(zType.unwrap())
  } else if (isZodOptional(zType)) {
    return unwrapZType(zType.unwrap())
  } else if (isZodEffects(zType)) {
    return unwrapZType(zType.innerType())
  } else if (isZodDefault(zType)) {
    return unwrapZType(zType.removeDefault())
  } else return zType
}


const schemes = ['http://', 'https://']

export const zUrl = (args: Parameters<typeof z.string>[0] & { urlMessage?: string } = {}) =>
  z.string(args).transform((s, ctx) => {
    if (s.startsWith('$') || s.startsWith('{')) {
      return s
    }
    const fixed = !schemes.some(sch => s.startsWith(sch)) ? `https://${s}` : s
    const result = z.string().url().safeParse(fixed)
    if (!result.success) {
      ctx.addIssue({
        code: 'invalid_format',
        format: 'url',
        message: args?.urlMessage || 'Invalid URL'
      })
      return z.NEVER
    }
    return new URL(fixed).toString()
  })
/**
 * Add a view to an object
 * @param fn the function to add to the zod type
 * @returns the zod type with the view added
 */
export const addView = <T extends AnyObject, U extends AnyObject>(
  fn: (t: T) => U
): ((t: T) => T & U) => {
  return t => Object.assign(t, fn(t)) as T & U
}
