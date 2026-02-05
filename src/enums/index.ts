/**
 * Type representing an enum-like object with string or number values.
 */
export type EnumLike<V extends string | number = string | number> = Record<string, V>

/**
 * Extracts the string keys from an enum type (excluding numeric reverse mappings).
 */
export type EnumKeys<Enum extends EnumLike> = Exclude<keyof Enum, number>

/**
 * Extracts the value type from an enum.
 */
export type EnumValue<Enum extends EnumLike> = `${Enum[EnumKeys<Enum>]}`

/**
 * Returns a clean enum object without numeric reverse mappings.
 * TypeScript enums with numeric values include reverse mappings (value -> key),
 * this function returns only the key -> value pairs.
 * @param e - The enum to clean
 * @returns An object with only the string keys and their values
 * @example
 * enum Status { Active = 0, Inactive = 1 }
 * enumObject(Status) // => { Active: 0, Inactive: 1 }
 */
export const enumObject = <Enum extends EnumLike>(e: Enum) => {
  const copy = { ...e } as { [K in EnumKeys<Enum>]: Enum[K] }
  Object.values(e).forEach(value => typeof value === 'number' && delete copy[value])
  return copy
}

/**
 * Returns an array of the enum's keys (names).
 * @param e - The enum
 * @returns Array of enum key names
 * @example
 * enum Color { Red = 'red', Blue = 'blue' }
 * enumKeys(Color) // => ['Red', 'Blue']
 */
export const enumKeys = <Enum extends EnumLike>(e: Enum) => {
  return Object.keys(enumObject(e)) as EnumKeys<Enum>[]
}

/**
 * Returns an array of the enum's values (unique).
 * @param e - The enum
 * @returns Array of unique enum values
 * @example
 * enum Color { Red = 'red', Blue = 'blue' }
 * enumValues(Color) // => ['red', 'blue']
 */
export const enumValues = <Enum extends EnumLike>(e: Enum) => {
  return [...new Set(Object.values(enumObject(e)))] as Enum[EnumKeys<Enum>][]
}
