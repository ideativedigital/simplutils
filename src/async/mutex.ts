import { deepArrayEqual } from '../objects'

/**
 * A simple mutex (mutual exclusion) implementation for coordinating async operations.
 * Ensures only one piece of code can execute a critical section at a time.
 * @example
 * const mutex = new Mutex()
 *
 * async function criticalSection() {
 *   await mutex.lock()
 *   try {
 *     // Only one caller can be here at a time
 *     await doSomethingAsync()
 *   } finally {
 *     mutex.unlock()
 *   }
 * }
 */
export class Mutex {
  private _queue: (() => void)[] = []
  private _locked = false

  /**
   * Acquires the lock. If the mutex is already locked, the promise will resolve
   * when it becomes available.
   * @returns A promise that resolves when the lock is acquired
   */
  lock() {
    return new Promise<void>(resolve => {
      if (!this._locked) {
        this._locked = true
        resolve()
      } else {
        this._queue.push(resolve)
      }
    })
  }

  /**
   * Releases the lock, allowing the next waiting caller to acquire it.
   */
  unlock() {
    if (this._queue.length > 0) {
      const resolve = this._queue.shift()
      resolve!()
    } else {
      this._locked = false
    }
  }
}

type AlreadyRunning<T extends any[], R> = [T, Promise<R>]

/**
 * Wraps an async function to prevent concurrent calls with the same arguments.
 * If called multiple times with the same arguments while a call is in progress,
 * subsequent calls will return the same promise as the first call.
 * @param fn - The async function to wrap
 * @returns A wrapped function that deduplicates concurrent calls with identical arguments
 * @example
 * const fetchUser = preventConcurrentCalls(async (id: number) => {
 *   return await api.getUser(id)
 * })
 *
 * // These will share the same API call if called concurrently
 * const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(1)])
 */
export function preventConcurrentCalls<T extends any[], R>(fn: (...args: T) => Promise<R>) {
  let currents: AlreadyRunning<T, R>[] = []
  return async (...args: T): Promise<R> => {
    const p = currents.find(([a]) => deepArrayEqual(args, a))?.[1]
    if (p) return p
    else {
      const p = fn(...args)
      currents.push([args, p])
      await p
      currents = currents.filter(([a]) => !deepArrayEqual(args, a))
      return p
    }
  }
}
