export const sequentialPromises = async <T>(promises: Promise<T>[]): Promise<T[]> => {
  const results: T[] = []
  for (const promise of promises) {
    results.push(await promise)
  }
  return results
}

export type MapPromisesOptions = {
  isSequential: boolean
}
export const mapPromises = async <T, U>(
  elems: T[],
  mapper: (elem: T, i: number) => Promise<U>,
  options: MapPromisesOptions = { isSequential: false }
): Promise<U[]> => {
  return options.isSequential
    ? sequentialPromises(elems.map(mapper))
    : Promise.all(elems.map(mapper))
}

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

  resolve(value: T) {
    this._resolve(value)
  }

  reject(reason?: any) {
    this._reject(reason)
  }

  static create<T>(): [Promise<T>, SyncPromise<T>] {
    const syncPromise = new SyncPromise<T>()
    return [syncPromise._promise, syncPromise]
  }
}
