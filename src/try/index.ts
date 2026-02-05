/**
 * Helper type for default values in tryOr.
 */
export type tryDefaultValue<T> = T extends Promise<infer U> ? U | T : T

/**
 * Executes a function and returns a default value if it throws.
 * Works with both sync and async functions.
 * @param fn - The function to execute
 * @param defaultValue - The value to return if the function throws
 * @returns The result of fn, or defaultValue if an error occurs
 * @example
 * const result = tryOr(() => JSON.parse(input), {})
 * const asyncResult = await tryOr(() => fetch('/api'), fallbackData)
 */
export const tryOr = <T>(fn: () => T, defaultValue: tryDefaultValue<T>): T => {
  try {
    const res = fn()
    if (res instanceof Promise) {
      return res.catch(() => defaultValue) as T
    }
    return res
  } catch (e) {
    console.warn('An errored occured in a controled try: ', e, ' now returning: ', defaultValue)
    return Promise.resolve(defaultValue) as T
  }
}

/**
 * Result type for tryOrNull - preserves Promise wrapper if input was async.
 */
export type tryOrNullResult<T> = T extends Promise<infer U> ? Promise<U | null> : T | null

/**
 * Executes a function and returns null if it throws.
 * Works with both sync and async functions.
 * @param fn - The function to execute
 * @returns The result of fn, or null if an error occurs
 * @example
 * const data = tryOrNull(() => JSON.parse(maybeInvalidJson))
 * if (data) { ... }
 */
export const tryOrNull = <T>(fn: () => T): tryOrNullResult<T> => {
  return tryOr(fn, null) as tryOrNullResult<T>
}

/**
 * Executes an async function and silently catches any errors.
 * Useful for operations where you don't care about failures.
 * @param fn - The async function to execute
 * @returns The result, or undefined if an error occurred
 * @example
 * // Log something to analytics, don't care if it fails
 * fireAndForget(() => analytics.track('event'))
 */
export const fireAndForget = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn()
  } catch (e) {
    console.warn('An errored occured in a fireAndForget: ', e)
  }
}

/**
 * Represents a successful result from wrapTry.
 */
export type Success<T> = { isSuccess: true; value: T; error: null }

/**
 * Represents a failed result from wrapTry.
 */
export type Failure = { isSuccess: false; value: null; error: any }

/**
 * Union type representing either a Success or Failure.
 */
export type Try<T> = Success<T> | Failure

/**
 * Wraps a function execution in a try-catch, returning a structured result.
 * @param fn - The function to execute
 * @param fin - Optional finally callback
 * @returns A Try object with isSuccess flag, value, and error
 * @example
 * const result = wrapTry(() => JSON.parse(input))
 * if (result.isSuccess) {
 *   console.log(result.value)
 * } else {
 *   console.error(result.error)
 * }
 */
export const wrapTry = <T>(fn: () => T, fin?: () => void): Try<T> => {
  try {
    return { isSuccess: true, value: fn(), error: null }
  } catch (error) {
    return { isSuccess: false, value: null, error }
  } finally {
    fin?.()
  }
}
