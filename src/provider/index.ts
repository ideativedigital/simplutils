import { isPromise, TypeHolder } from '../types'

export type ProvidedMap = { [k: string]: any }

/**
 * CacheContext for the provider
 * refreshInterval -1 = never refresh
 */
export type CacheContext =
  | { noCache: true }
  | {
      noCache: false
      refreshInterval: number
    }

export type providersUnion<P1 extends Provider<any>, P2 extends Provider<any>> = Provider<
  P1['Type'] & P2['Type']
>

export const defaultCacheContext: CacheContext = {
  noCache: false,
  refreshInterval: 10000 // 10 seconds
}
/**
 * Provider to provide factories / services to handlers
 * @template T extends ProvidedMap the type of the map that's provided
 */
export class Provider<T extends ProvidedMap> {
  protected __isProvider = true
  readonly Type!: T
  private context: CacheContext
  public loaded?: T
  private refreshDate = new Date().getTime()
  constructor(
    private fn: (get: () => T) => Promise<T> | T,
    context: CacheContext = defaultCacheContext
  ) {
    this.context = context
  }

  public withContext(context: CacheContext) {
    this.context = context
    return this
  }

  /**
   * @returns the provided map
   */
  async provide(): Promise<T> {
    if (
      !this.loaded ||
      this.context.noCache ||
      (this.context.refreshInterval > -1 && this.refreshDate < new Date().getTime())
    ) {
      this.loaded = await this.fn(() => this.loaded!)
      if (!this.context.noCache && this.context.refreshInterval > -1) {
        this.refreshDate = new Date().getTime() + this.context.refreshInterval
      }
    }
    return this.loaded
  }

  resetCache() {
    this.refreshDate = new Date().getTime()
  }

  /**
   * compose another provider
   * @param other the other provider
   * @returns new provider providing both the elements of this one and the other one's
   */
  and<U extends ProvidedMap>(
    other: Provider<U> | ((t: T) => Provider<U>),
    context?: CacheContext
  ): Provider<T & U> {
    return new Provider(
      async get => {
        const { otherProvider, provided } = await (Provider.isProvider(other)
          ? { otherProvider: other }
          : (async () => {
              const provided = await this.provide()
              return { otherProvider: (other as (t: T) => Provider<U>)(provided), provided }
            })())
        const res = await Promise.all([provided ?? this.fn(get), otherProvider.provide()])
        return { ...res[0], ...res[1] }
      },
      context ?? { noCache: true }
    )
  }

  pick<S extends keyof T>(...keys: S[]): Provider<Pick<T, S>> {
    return new Provider<Pick<T, S>>(async () => {
      const provided = await this.provide() // TODO have to wait anyway... how could it be enhanced ?
      return Object.entries(provided).reduce(
        (acc, [k, v]) => {
          if (keys.includes(k as S)) {
            return { ...acc, [k as S]: v }
          } else return acc
        },
        {} as Pick<T, S>
      )
    })
  }

  static isProvider(p: any): p is Provider<any> {
    return p.__isProvider
  }
}

/**
 * Creates a new provider with all the providers passed (up to 5 because why not)
 * @param fn first provider
 * @param fn2 second provider
 * @param fn3 third provider
 * @param fn4 fourth provider
 * @param fn5 fifth provider
 * @returns Provider composed of all the provided elements in the providers
 */
export const provided = <
  T extends ProvidedMap,
  U extends ProvidedMap = {},
  V extends ProvidedMap = {},
  W extends ProvidedMap = {},
  X extends ProvidedMap = {}
>(
  p: Provider<T>,
  p2?: Provider<U>,
  p3?: Provider<V>,
  p4?: Provider<W>,
  p5?: Provider<X>
) => {
  return [p2, p3, p4, p5].reduce<Provider<T & U & V & W & X>>(
    (acc, e) => (!!e ? acc.and(e as unknown as Provider<ProvidedMap>) : acc),
    p as unknown as Provider<T & U & V & W & X>
  )
}

export const createProvider = <T extends ProvidedMap>(
  fn: (get: () => T) => Promise<T> | T,
  context?: CacheContext
) => {
  return new Provider(fn, context)
}

export const chainProvider =
  <T extends ProvidedMap, R extends Provider<any>>(
    _: TypeHolder<R>,
    fn: (r: R['Type']) => Provider<T> | Promise<T> | T,
    context?: CacheContext
  ) =>
  (r: R['Type']) => {
    const result = fn(r)
    if (Provider.isProvider(result)) {
      return context ? result.withContext(context) : result
    } else {
      const wrapped = () => Promise.resolve(result)
      return new Provider(wrapped, context)
    }
  }

type ProviderFunctor<P> = (get: () => P) => P | Promise<P>
export const inferProvided = <P>(pf: ProviderFunctor<P>) => pf
export const singleElementProvider =
  <K extends string>(key: K, context?: CacheContext) =>
  <P>(elem: ProviderFunctor<P>) => {
    return createProvider<{ [k in K]: P }>(get => {
      const result = elem(() => get()[key])
      return (
        isPromise(result) ? result.then(r => ({ [key]: r })) : Promise.resolve({ [key]: result })
      ) as Promise<{ [k in K]: P }>
    }, context)
  }

export const emptyProvider = new Provider(async () => ({}))

export type providedType<M extends Provider<any>, K extends keyof M['Type']> = M['Type'][K]
