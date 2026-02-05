import { z, ZodType } from 'zod'
import { AugmentedResponsePromise, ky, Options } from 'zod-ky'
import { AnyObject } from '../objects'
import { defaultThrottleOptions, smartThrottle, ThrottledOptions } from '../throttle'



export type FetchOptions = Options & {
  searchParams?: URLSearchParams
  silent?: boolean
}

export type idType<T extends AnyObject, forceType = never> = forceType extends never ? T['id'] extends z.ZodType<infer I> ? I : string : T['_id'] extends z.ZodType<infer I> ? I : forceType

export interface Resource<T extends AnyObject, forceIdType = never> {
  Type: T
  urlPrefix: string

  getAll: (opts: FetchOptions) => Promise<T[]>
  getById: (id: idType<T, forceIdType>) => Promise<T>
  create: (resource: T, opts: FetchOptions) => Promise<T>
  update: <U extends Partial<T> = Partial<T>>(id: idType<T, forceIdType>, resource: U, opts: FetchOptions) => Promise<T>
  delete: (id: idType<T, forceIdType>, opts: FetchOptions) => Promise<void>
  addListener(listener: ResourceListener<T>): () => void
}

export type ResourceMethod = Exclude<
  keyof Resource<any> & {},
  'addListener' | 'Type' | 'urlPrefix'
>

export type GetParamsResult<T extends AnyObject, forceIdType = never> = { id?: idType<T, forceIdType>; elem?: any }
export interface ResourceListener<T extends AnyObject, forceIdType = never> {
  beforeCall?: (key: ResourceMethod, url: string, getParams: () => GetParamsResult<T, forceIdType>) => void
  afterCall?: (
    key: ResourceMethod,
    url: string,
    result: any,
    getParams: () => GetParamsResult<T, forceIdType>
  ) => void
  wrapCall?: (
    key: ResourceMethod,
    fn: () => Promise<any>,
    getParams: () => GetParamsResult<T, forceIdType>
  ) => Promise<any>
}

export const buildUrlWithParams = (url: string, options?: FetchOptions) => {
  const sp = options?.searchParams ? `?${options.searchParams.toString()}` : ''
  return `${url}${sp}`
}

class ResourceClass<T extends AnyObject, forceIdType = never>
  implements Resource<T, forceIdType> {
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
    public readonly parser?: ZodType<T>,
    opts?: ThrottledOptions
  ) {
    this.throttleOptions = { ...defaultThrottleOptions, ...opts }

    this.getAll = smartThrottle((opts?: FetchOptions): Promise<T[]> => {
      const url = buildUrlWithParams(this.urlPrefix, opts)
      return this.call(
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
      return this.call('getById', url, ky.get(url), opts?.silent !== true, () => ({ id: id as any }), this.parser)
    }, this.throttleOptions)

    this.create = smartThrottle(
      (resource: T, opts?: FetchOptions): Promise<T> => {
        const url = buildUrlWithParams(this.urlPrefix, opts)
        return this.call(
          'create',
          url,
          ky.post(url, { json: resource }),
          opts?.silent !== true,
          () => ({ elem: resource }),
          this.parser
        )
      },
      this.throttleOptions
    )

    this.update = smartThrottle(
      <U extends Partial<T> = Partial<T>>(id: idType<T, forceIdType>, resource: U, opts?: FetchOptions): Promise<T> => {
        const url = buildUrlWithParams(`${this.urlPrefix}/${id}`, opts)
        return this.call(
          'update',
          url,
          ky.put(url, { json: resource }),
          opts?.silent !== true,
          () => ({
            id,
            elem: resource as any
          })
        )
      },
      this.throttleOptions
    )

    this.delete = smartThrottle(
      async (id: idType<T, forceIdType>, opts?: FetchOptions): Promise<void> => {
        const url = buildUrlWithParams(`${this.urlPrefix}/${id}`, opts)
        await this.call('delete', url, ky.delete(url, opts), opts?.silent !== true, () => ({
          id: id as any,
        }))
      },
      this.throttleOptions
    )
  }

  private async call<R>(
    key: ResourceMethod,
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
    return () => this.listeners.filter(l => l !== listener)
  }
}

export const resource = <T extends AnyObject, forceIdType = never>(
  urlPrefix: string,
  options?: ThrottledOptions & {
    silent?: boolean,
    parser?: ZodType<T>,
  }
): Resource<T, forceIdType> =>
  new ResourceClass(urlPrefix, options?.parser, options) as Resource<T, forceIdType>

export const createResource = resource
