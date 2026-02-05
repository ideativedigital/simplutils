/**
 * Type representing a class constructor that creates instances of type E.
 * @template E - The type of instances created by this class
 */
export type Class<E> = new (...args: any[]) => E

/**
 * Checks if a value is a class (not just a function).
 * Distinguishes between ES6 classes and regular functions.
 * @param object - The value to check
 * @returns True if the value is a class, false otherwise
 * @example
 * class MyClass {}
 * isClass(MyClass)        // => true
 * isClass(function() {})  // => false
 * isClass(() => {})       // => false
 */
export const isClass = (object: any): boolean => {
  const propertyNames = Object.getOwnPropertyNames(object)

  return (
    typeof object === 'function' &&
    propertyNames.includes('prototype') &&
    !propertyNames.includes('arguments') &&
    object?.toString?.().startsWith('class')
  )
}

/**
 * A class that holds a type parameter for type inference purposes.
 * Used to pass type information without runtime values.
 * @template T - The type being held
 * @example
 * const holder = new TypeHolder<{ name: string }>()
 * // Use holder.Out to reference the type
 */
export class TypeHolder<T> {
  readonly Out!: T
}

/**
 * Creates a TypeHolder for the specified type.
 * Useful for passing type information to generic functions.
 * @returns A TypeHolder instance for type T
 * @example
 * const userType = withType<{ name: string, age: number }>()
 * // Use with generic functions that need type inference
 * const picker = pathPicker(userType, { name: true })
 */
export const withType = <T>() => {
  return new TypeHolder<T>()
}
