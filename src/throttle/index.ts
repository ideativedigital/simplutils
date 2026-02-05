import { deepArrayEqual } from '../objects'

export type FnParams<T extends ((...args: any[]) => void) | undefined> = T extends (
  ...args: any[]
) => void
  ? Parameters<T>
  : never

export type ThrottleResult<T extends ((...args: any[]) => void) | undefined> = T extends (
  ...args: any[]
) => void
  ? (...args: FnParams<T>) => void
  : undefined

const t: ThrottleResult<undefined> = undefined

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

export type ThrottledOptions = {
  delay?: number
  disable?: boolean
}

export const defaultThrottleOptions: ThrottledOptions = {
  delay: 500,
  disable: false
}

export type unwrapPromiseReturn<T extends (...args: any[]) => Promise<any>> =
  ReturnType<T> extends Promise<infer R> ? R : ReturnType<T>

type AlreadyRunning<T extends any[], R> = [T, Promise<R>]
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
