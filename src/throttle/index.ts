import { deepArrayEqual } from '../objects'

/**
 * Extracts the parameter types from a function type.
 */
export type FnParams<T extends ((...args: any[]) => void) | undefined> = T extends (
  ...args: any[]
) => void
  ? Parameters<T>
  : never

/**
 * The return type of a throttled function.
 */
export type ThrottleResult<T extends ((...args: any[]) => void) | undefined> = T extends (
  ...args: any[]
) => void
  ? (...args: FnParams<T>) => void
  : undefined

const t: ThrottleResult<undefined> = undefined

/**
 * Creates a throttled version of a function that can only be called once per time limit.
 * Subsequent calls within the limit period are ignored.
 * @param func - The function to throttle (optional)
 * @param limit - The minimum time between calls in milliseconds (default: 500)
 * @returns A throttled version of the function, or undefined if no function provided
 * @example
 * const throttledScroll = throttle(() => console.log('scrolled'), 100)
 * window.addEventListener('scroll', throttledScroll)
 */
export function throttle<T extends ((...args: any[]) => void) | undefined>(
  func?: T,
  limit: number = 500
): ThrottleResult<T> {
  let inThrottle: boolean

  return (
    func
      ? function (...args: FnParams<T>): void {
        if (!inThrottle) {
          func(...args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
      : undefined
  ) as ThrottleResult<T>
}

/**
 * Configuration options for throttling.
 */
export type ThrottledOptions = {
  /** Delay in milliseconds before allowing duplicate calls (default: 500) */
  delay?: number
  /** If true, disables throttling entirely */
  disable?: boolean
}

/**
 * Default throttle options: 500ms delay, throttling enabled.
 */
export const defaultThrottleOptions: ThrottledOptions = {
  delay: 500,
  disable: false
}

/**
 * Utility type that unwraps the return type of a Promise-returning function.
 */
export type unwrapPromiseReturn<T extends (...args: any[]) => Promise<any>> =
  ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

type AlreadyRunning<T extends any[], R> = [T, Promise<R>]

/**
 * Creates a smart throttled version of an async function with deduplication.
 * If called multiple times with the same arguments while a call is in progress,
 * returns the existing promise instead of making a new call.
 * @param func - The async function to throttle
 * @param opts - Throttle options (delay, disable)
 * @returns A throttled version of the function
 * @example
 * const fetchUser = smartThrottle(async (id: number) => api.getUser(id))
 *
 * // These concurrent calls with same args share one API call
 * const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(1)])
 */
export const smartThrottle = <Args extends any[], R>(
  func: (...args: Args) => Promise<R>,
  opts?: ThrottledOptions
): ((...args: Args) => Promise<R>) => {
  const options = { ...defaultThrottleOptions, ...opts }
  if (options.disable) return func
  let currents: AlreadyRunning<Args, R>[] = []
  return async (...args: Args): Promise<R> => {
    const p = currents.find(([a]) => deepArrayEqual(args, a))?.[1]

    if (p) return p
    else {
      const p = func(...args)
      currents.push([args, p])
      setTimeout(async () => {
        try {
          await p
        } catch (e) {
        } finally {
          currents = currents.filter(([a]) => !deepArrayEqual(args, a))
        }
      }, options.delay)
      return p
    }
  }
}

/**
 * A decorator for class methods that applies smart throttling.
 * @param opts - Throttle options
 * @returns A method decorator
 * @example
 * class UserService {
 *   @throttled({ delay: 1000 })
 *   async fetchUser(id: number) {
 *     return api.getUser(id)
 *   }
 * }
 */
export function throttled<This, T extends any[], R>(opts?: ThrottledOptions) {
  return function actualDecorator(
    original: (t: This, ...args: T) => Promise<R>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: T) => Promise<R>>
  ) {
    return function replacementMethod(t: This, ...args: T) {
      return smartThrottle<T, R>((...args) => original(t, ...args), opts)(...args)
    }
  }
}
