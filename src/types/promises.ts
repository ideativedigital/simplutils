import { AnyObject } from '../objects'

export type MaybePromise<T> = T | Promise<T>

export const toPromise = <T>(mbPromise: MaybePromise<T>): Promise<T> => Promise.resolve(mbPromise)

export const isPromise = <T>(value: MaybePromise<T>): value is Promise<T> =>
  value && (value instanceof Promise || (typeof value === 'object' && 'then' in value))

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
