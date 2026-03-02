import { ZodType } from 'zod'
import { AugmentedResponsePromise, ky } from 'zod-ky'
import { AnyObject } from '../objects'
import { defaultThrottleOptions, smartThrottle, ThrottledOptions } from '../throttle'
import { buildUrlWithParams } from './build-url'
import {
  FetchOptions,
  GetParamsResult,
  idType,
  Override,
  Resource,
  ResourceCallKey,
  ResourceExtender,
  ResourceExtenderContext,
  ResourceListener,
  ResourceOptions
} from './types'

export class ResourceClass<T extends AnyObject, forceIdType = never> implements Resource<T, forceIdType> {
  Type!: T

  protected listeners: ResourceListener<T, forceIdType>[] = []
  protected readonly throttleOptions: ThrottledOptions = {}
  public getAll: Resource<T, forceIdType>['getAll']
  public getById: Resource<T, forceIdType>['getById']
  public create: Resource<T, forceIdType>['create']
  public update: Resource<T, forceIdType>['update']
  public delete: Resource<T, forceIdType>['delete']

  constructor(
    public readonly urlPrefix: string,
    public readonly parser?: ResourceOptions<T>['parser'],
    opts?: ThrottledOptions
  ) {
    this.urlPrefix = urlPrefix
    this.throttleOptions = { ...defaultThrottleOptions, ...opts }

    this.getAll = smartThrottle((opts?: FetchOptions): Promise<T[]> => {
      const url = buildUrlWithParams(this.urlPrefix, opts)
      return this.callInternal(
        'getAll',
        url,
        ky.get(url),
        opts?.silent !== true,
        () => ({}),
        this.parser?.array()
      )
    }, this.throttleOptions)

    this.getById = smartThrottle((id: idType<T, forceIdType>, opts?: FetchOptions): Promise<T> => {
      const url = buildUrlWithParams(`${this.urlPrefix}/${id}`, opts)
      return this.callInternal(
        'getById',
        url,
        ky.get(url),
        opts?.silent !== true,
        () => ({ id: id as any }),
        this.parser
      )
    }, this.throttleOptions)

    this.create = smartThrottle((resource: T, opts?: FetchOptions): Promise<T> => {
      const url = buildUrlWithParams(this.urlPrefix, opts)
      return this.callInternal(
        'create',
        url,
        ky.post(url, { json: resource }),
        opts?.silent !== true,
        () => ({ elem: resource }),
        this.parser
      )
    }, this.throttleOptions)

    this.update = smartThrottle(<U extends Partial<T> = Partial<T>>(
      id: idType<T, forceIdType>,
      resource: U,
      opts?: FetchOptions
    ): Promise<T> => {
      const url = buildUrlWithParams(`${this.urlPrefix}/${id}`, opts)
      return this.callInternal(
        'update',
        url,
        ky.put(url, { json: resource }),
        opts?.silent !== true,
        () => ({ id, elem: resource as any })
      )
    }, this.throttleOptions)

    this.delete = smartThrottle(async (id: idType<T, forceIdType>, opts?: FetchOptions): Promise<void> => {
      const url = buildUrlWithParams(`${this.urlPrefix}/${id}`, opts)
      await this.callInternal('delete', url, ky.delete(url, opts), opts?.silent !== true, () => ({ id: id as any }))
    }, this.throttleOptions)
  }

  public getExtenderContext(): ResourceExtenderContext<T, forceIdType> {
    const self = this as AnyObject
    const customMethods = Object.fromEntries(
      Object.keys(self)
        .filter(key => !['Type', 'urlPrefix', 'getAll', 'getById', 'create', 'update', 'delete', 'listeners', 'throttleOptions'].includes(key))
        .filter(key => typeof self[key] === 'function')
        .map(key => [key, self[key]] as const)
    )
    return {
      Type: this.Type,
      urlPrefix: this.urlPrefix,
      getAll: this.getAll,
      getById: this.getById,
      create: this.create,
      update: this.update,
      delete: this.delete,
      addListener: this.addListener.bind(this),
      extend: this.extend.bind(this),
      ...customMethods,
      call: this.callInternal.bind(this)
    } as unknown as ResourceExtenderContext<T, forceIdType>
  }

  private async callInternal<R>(
    key: ResourceCallKey,
    url: string,
    p: AugmentedResponsePromise,
    shouldWrap: boolean,
    getParams: () => GetParamsResult<T, forceIdType>,
    parser?: ZodType<R>,
  ): Promise<R> {
    if (!shouldWrap) {
      if (parser) {
        return p.parseJson(parser)
      }
      return p.json()
    }
    this.listeners.forEach(l => l.beforeCall?.(key, url, getParams))
    this.listeners.forEach(l => l.wrapCall?.(key, () => p, getParams))
    const result = await p
    this.listeners.forEach(l => l.afterCall?.(key, url, result, getParams))
    if (parser) {
      return parser.parse(result)
    }
    return result.json()
  }

  addListener(listener: ResourceListener<T, forceIdType>) {
    this.listeners = [...this.listeners.filter(l => l !== listener), listener]
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  extend<This extends Resource<T, forceIdType>, E extends AnyObject>(
    this: This,
    extender: ResourceExtender<T, forceIdType, E, This>,
    options?: { allowOverride?: boolean }
  ): Override<This, E> {
    const next = extender((this as any).getExtenderContext() as ResourceExtenderContext<T, forceIdType> & This)
    for (const key of Object.keys(next as AnyObject)) {
      if (key in (this as AnyObject)) {
        if (!options?.allowOverride) {
          throw new Error(`Resource extension collision on key "${key}"`)
        }
        const existing = (this as AnyObject)[key]
        if (typeof existing !== 'function') {
          throw new Error(`Resource extension can only override function key "${key}"`)
        }
      }
    }
    Object.assign(this as AnyObject, next)
    return this as unknown as Override<This, E>
  }
}
