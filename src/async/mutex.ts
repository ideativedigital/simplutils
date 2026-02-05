import { deepArrayEqual } from '../objects'
export class Mutex {
  private _queue: (() => void)[] = []
  private _locked = false

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
