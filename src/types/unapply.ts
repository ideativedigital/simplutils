import { Class, isClass } from './class'
import { Validator } from './type-utils'

/**
 * A type that can be used for pattern matching: either a class constructor or a validator function.
 * @template T - The type being matched
 */
export type Unapply<T> = Class<T> | Validator<T>

/**
 * Converts an Unapply (class or validator) into a type guard function.
 * If given a class, returns an instanceof check. If given a validator, returns it as-is.
 * @param unapply - A class constructor or validator function
 * @returns A type guard function
 * @example
 * class Dog { bark() {} }
 * const isDog = unapply(Dog)
 * if (isDog(animal)) {
 *   animal.bark() // TypeScript knows animal is Dog
 * }
 */
export const unapply = <T>(unapply: Unapply<T>): ((obj: any) => obj is T) =>
  (isClass(unapply) ? (obj: any): obj is T => obj instanceof unapply : unapply) as (
    obj: any
  ) => obj is T

type VoidOr<R, T> = void extends R ? T | undefined : void extends T ? R | undefined : R | T

/**
 * Internal class for building type-safe switch/case expressions.
 */
class SwitchCase<T, R = void> {
  private Output!: R
  private value: T
  private cases: Map<Validator<any>, (value: any) => R> = new Map()
  private defaultCase: ((value: T) => R) | null = null

  constructor(value: T) {
    this.value = value
  }

  /**
   * Adds a case to match against a type.
   * @param type - The type to match (class or validator)
   * @param handler - Function to execute if matched, receives the narrowed value
   */
  case<U extends T, V>(type: Unapply<U>, handler: (value: U) => V): SwitchCase<T, VoidOr<R, V>> {
    this.cases.set(unapply(type), handler as (value: any) => any)
    return this as unknown as SwitchCase<T, VoidOr<R, V>>
  }

  /**
   * Adds a default case if no other cases match.
   * @param handler - Function to execute as fallback
   */
  default<V>(handler: (value: T) => V): SwitchCase<T, VoidOr<R, V>> {
    this.defaultCase = handler as (value: any) => any
    return this as unknown as SwitchCase<T, VoidOr<R, V>>
  }

  /**
   * Executes the switch, running the first matching case handler.
   * @returns The result of the matched handler, or undefined if no match
   */
  execute(): R | undefined {
    for (const [validator, handler] of this.cases) {
      if (validator(this.value)) {
        return handler(this.value)
      }
    }
    if (this.defaultCase) {
      return this.defaultCase(this.value)
    }
    return undefined
  }
}

/**
 * Creates a functional switch/case expression for type-safe pattern matching.
 * Chain .case() calls for each type to match, optionally add .default(), then call .execute().
 * @param t - The value to switch on
 * @returns A SwitchCase builder
 * @example
 * class Dog { bark() { return 'woof' } }
 * class Cat { meow() { return 'meow' } }
 *
 * const sound = fswitch(animal)
 *   .case(Dog, dog => dog.bark())
 *   .case(Cat, cat => cat.meow())
 *   .default(() => 'unknown')
 *   .execute()
 */
export const fswitch = <T>(t: T) => new SwitchCase(t)
