export type Class<E> = new (...args: any[]) => E

export const isClass = (object: any): boolean => {
  const propertyNames = Object.getOwnPropertyNames(object)

  return (
    typeof object === 'function' &&
    propertyNames.includes('prototype') &&
    !propertyNames.includes('arguments') &&
    object?.toString?.().startsWith('class')
  )
}

export class TypeHolder<T> {
  readonly Out!: T
}

export const withType = <T>() => {
  return new TypeHolder<T>()
}
