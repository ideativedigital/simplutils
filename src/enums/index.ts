export type EnumLike<V extends string | number = string | number> = Record<string, V>

export type EnumKeys<Enum extends EnumLike> = Exclude<keyof Enum, number>

export type EnumValue<Enum extends EnumLike> = `${Enum[EnumKeys<Enum>]}`

export const enumObject = <Enum extends EnumLike>(e: Enum) => {
  const copy = { ...e } as { [K in EnumKeys<Enum>]: Enum[K] }
  Object.values(e).forEach(value => typeof value === 'number' && delete copy[value])
  return copy
}

export const enumKeys = <Enum extends EnumLike>(e: Enum) => {
  return Object.keys(enumObject(e)) as EnumKeys<Enum>[]
}

export const enumValues = <Enum extends EnumLike>(e: Enum) => {
  return [...new Set(Object.values(enumObject(e)))] as Enum[EnumKeys<Enum>][]
}
