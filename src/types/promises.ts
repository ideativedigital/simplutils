import { AnyObject } from '../objects'

/**
 * A type that represents either a value or a Promise of that value.
 * @template T - The underlying value type
 */
export type MaybePromise<T> = T | Promise<T>

/**
 * Converts a value or promise to a Promise.
 * If the value is already a Promise, returns it as-is.
 * If it's a plain value, wraps it in a resolved Promise.
 * @param mbPromise - A value or promise to convert
 * @returns A Promise resolving to the value
 * @example
 * await toPromise(42)              // => 42
 * await toPromise(Promise.resolve(42)) // => 42
 */
export const toPromise = <T>(mbPromise: MaybePromise<T>): Promise<T> => Promise.resolve(mbPromise)

/**
 * Type guard that checks if a value is a Promise.
 * @param value - The value to check
 * @returns True if the value is a Promise or thenable
 * @example
 * isPromise(Promise.resolve(1))  // => true
 * isPromise(42)                  // => false
 */
export const isPromise = <T>(value: MaybePromise<T>): value is Promise<T> =>
  value && (value instanceof Promise || (typeof value === 'object' && 'then' in value))

/**
 * Creates a proxy that allows accessing properties of a promised object as individual promises.
 * Each property access returns a Promise that resolves to that property's value.
 * @param promise - A Promise that resolves to an object
 * @returns A proxy object where each property is a Promise of the original property
 * @example
 * const userPromise = fetchUser() // Promise<{ name: string, age: number }>
 * const proxied = proxifyPromise(userPromise)
 * const name = await proxied.name // string
 * const age = await proxied.age   // number
 */
export function proxifyPromise<T extends AnyObject>(
  promise: Promise<T>
): { [K in keyof T]: Promise<T[K]> } {
  const handler: ProxyHandler<T> = {
    get(target, prop) {
      return promise.then(result => result[prop as string])
    }
  }
  return new Proxy({} as T, handler) as { [K in keyof T]: Promise<T[K]> }
}
