import { Class, isClass } from './class'
import { Validator } from './type-utils'

export type Unapply<T> = Class<T> | Validator<T>

export const unapply = <T>(unapply: Unapply<T>): ((obj: any) => obj is T) =>
  (isClass(unapply) ? (obj: any): obj is T => obj instanceof unapply : unapply) as (
    obj: any
  ) => obj is T

type VoidOr<R, T> = void extends R ? T | undefined : void extends T ? R | undefined : R | T


class SwitchCase<T, R = void> {
  private Output!: R
  private value: T
  private cases: Map<Validator<any>, (value: any) => R> = new Map()
  private defaultCase: ((value: T) => R) | null = null

  constructor(value: T) {
    this.value = value
  }

  case<U extends T, V>(type: Unapply<U>, handler: (value: U) => V): SwitchCase<T, VoidOr<R, V>> {
    this.cases.set(unapply(type), handler as (value: any) => any)
    return this as unknown as SwitchCase<T, VoidOr<R, V>>
  }

  default<V>(handler: (value: T) => V): SwitchCase<T, VoidOr<R, V>> {
    this.defaultCase = handler as (value: any) => any
    return this as unknown as SwitchCase<T, VoidOr<R, V>>
  }

  execute(): R | undefined {
    for (const [validator, handler] of this.cases) {
      if (validator(this.value)) {
        return handler(this.value)
      }
    }
    if (this.defaultCase) {
      return this.defaultCase(this.value)
    }
    return undefined
  }
}

export const fswitch = <T>(t: T) => new SwitchCase(t)
