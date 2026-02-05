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
import { validate } from '../type-utils'


/** Type guard that checks if a Zod type is ZodNumber. */
export const isZodNumber = validate<ZodNumber>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNumber'
)

/** Type guard that checks if a Zod type is ZodDate. */
export const isZodDate = validate<ZodDate>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDate'
)

/** Type guard that checks if a Zod type is ZodString. */
export const isZodString = validate<ZodString>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodString'
)

/** Type guard that checks if a Zod type is ZodBoolean. */
export const isZodBoolean = validate<ZodBoolean>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodBoolean'
)

/** Type guard that checks if a value is any Zod type. */
export const isZodType = validate<ZodTypeAny>(
  o =>
    typeof o === 'object' &&
    typeof o._def?.typeName === 'string' &&
    o._def?.typeName.startsWith('Zod')
)

/**
 * Extracts the keys of an object as a typed array.
 * @param r - The object to get keys from
 * @returns Array of keys with proper typing
 */
export const keys = <K extends string>(r: Record<K, any>): K[] => Object.keys(r) as K[]

/**
 * Creates a Zod enum schema from the keys of an object.
 * @param obj - The object whose keys will become enum values
 * @returns A ZodEnum schema
 * @example
 * const statusMap = { active: 1, inactive: 0 }
 * const StatusEnum = ObjectKeysEnum(statusMap)
 * // StatusEnum accepts 'active' | 'inactive'
 */
export function ObjectKeysEnum<K extends string>(obj: Record<K, any>) {
  return z.enum([keys(obj)[0]!, ...keys(obj)])
}

/** Type guard that checks if a Zod type is ZodObject. */
export const isZodObject = validate<ZodObject<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodObject'
)

/** Type guard that checks if a Zod type is ZodNullable. */
export const isZodNullable = validate<ZodNullable<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNullable'
)

/** Type guard that checks if a Zod type is ZodOptional. */
export const isZodOptional = validate<ZodOptional<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodOptional'
)

/** Type guard that checks if a Zod type is ZodDefault. */
export const isZodDefault = validate<ZodDefault<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDefault'
)

/** Type guard that checks if a Zod type is ZodEffects. */
export const isZodEffects = validate<ZodEffects<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodEffects'
)

/** Type guard that checks if a Zod type is ZodArray. */
export const isZodArray = validate<ZodArray<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodArray'
)

/** Type guard that checks if a Zod type is ZodRecord. */
export const isZodRecord = validate<ZodRecord<any, any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodRecord'
)

/** Type guard that checks if a Zod type is ZodEnum. */
export const isZodEnum = validate<ZodEnum<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodEnum'
)

/** Type guard that checks if a Zod type is ZodUnion. */
export const isZodUnion = validate<ZodUnion<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodUnion'
)

/** Type guard that checks if a Zod type is ZodDiscriminatedUnion. */
export const isZodDiscriminatedUnion = validate<ZodDiscriminatedUnion<any, any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodDiscriminatedUnion'
)

/** Type guard that checks if a Zod type is ZodNativeEnum. */
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
    return unwrapZType(zType.unwrap())
  } else return zType
}


const schemes = ['http://', 'https://']

/**
 * Creates a Zod string schema that validates and normalizes URLs.
 * Automatically prepends 'https://' if no scheme is provided.
 * Allows template strings starting with '$' or '{' to pass through.
 * @param args - Optional string schema arguments plus custom urlMessage
 * @returns A Zod schema that validates and normalizes URLs
 * @example
 * const schema = z.object({ website: zUrl() })
 * schema.parse({ website: 'example.com' })    // => { website: 'https://example.com/' }
 * schema.parse({ website: 'https://foo.com' }) // => { website: 'https://foo.com/' }
 */
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
