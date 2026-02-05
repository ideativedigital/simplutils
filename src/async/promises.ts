/**
 * Awaits an array of promises sequentially (one at a time).
 * Unlike Promise.all, this waits for each promise to complete before starting the next.
 * @param promises - An array of promises to await sequentially
 * @returns A promise that resolves to an array of results in order
 * @example
 * const results = await sequentialPromises([
 *   fetch('/api/1'),
 *   fetch('/api/2'),
 *   fetch('/api/3')
 * ])
 */
export const sequentialPromises = async <T>(promises: Promise<T>[]): Promise<T[]> => {
  const results: T[] = []
  for (const promise of promises) {
    results.push(await promise)
  }
  return results
}

/**
 * Options for mapPromises function.
 */
export type MapPromisesOptions = {
  /** If true, executes promises sequentially. If false (default), executes in parallel. */
  isSequential: boolean
}

/**
 * Maps an array of elements to promises, with control over sequential vs parallel execution.
 * @param elems - The array of elements to map
 * @param mapper - An async function that transforms each element
 * @param options - Options object with isSequential flag (default: false for parallel)
 * @returns A promise that resolves to an array of mapped results
 * @example
 * // Parallel execution (default)
 * const users = await mapPromises(ids, id => fetchUser(id))
 *
 * // Sequential execution
 * const users = await mapPromises(ids, id => fetchUser(id), { isSequential: true })
 */
export const mapPromises = async <T, U>(
  elems: T[],
  mapper: (elem: T, i: number) => Promise<U>,
  options: MapPromisesOptions = { isSequential: false }
): Promise<U[]> => {
  return options.isSequential
    ? sequentialPromises(elems.map(mapper))
    : Promise.all(elems.map(mapper))
}

/**
 * A promise that can be resolved or rejected externally.
 * Useful when you need to create a promise and resolve it from outside its executor.
 * @example
 * const [promise, controller] = SyncPromise.create<string>()
 *
 * // Later, resolve the promise from elsewhere
 * controller.resolve('done')
 *
 * // Or reject it
 * controller.reject(new Error('failed'))
 */
export class SyncPromise<T> {
  private _promise: Promise<T>
  private _resolve!: (value: T) => void
  private _reject!: (reason?: any) => void

  private constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  /**
   * Resolves the promise with the given value.
   * @param value - The value to resolve with
   */
  resolve(value: T) {
    this._resolve(value)
  }

  /**
   * Rejects the promise with the given reason.
   * @param reason - The rejection reason
   */
  reject(reason?: any) {
    this._reject(reason)
  }

  /**
   * Creates a new SyncPromise and returns both the promise and its controller.
   * @returns A tuple of [promise, controller]
   */
  static create<T>(): [Promise<T>, SyncPromise<T>] {
    const syncPromise = new SyncPromise<T>()
    return [syncPromise._promise, syncPromise]
  }
}
