export type tryDefaultValue<T> = T extends Promise<infer U> ? U | T : T

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

export type tryOrNullResult<T> = T extends Promise<infer U> ? Promise<U | null> : T | null

export const tryOrNull = <T>(fn: () => T): tryOrNullResult<T> => {
  return tryOr(fn, null) as tryOrNullResult<T>
}

export const fireAndForget = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn()
  } catch (e) {
    console.warn('An errored occured in a fireAndForget: ', e)
  }
}

export type Success<T> = { isSuccess: true; value: T; error: null }
export type Failure = { isSuccess: false; value: null; error: any }
export type Try<T> = Success<T> | Failure

export const wrapTry = <T>(fn: () => T, fin?: () => void): Try<T> => {
  try {
    return { isSuccess: true, value: fn(), error: null }
  } catch (error) {
    return { isSuccess: false, value: null, error }
  } finally {
    fin?.()
  }
}
