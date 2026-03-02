import { ZodType } from 'zod'
import { AugmentedResponsePromise, Options } from 'zod-ky'
import { AnyObject } from '../objects'
import { ThrottledOptions } from '../throttle'

export type ResourceMethodConsolidation = 'heuristic' | 'setAll' | 'reconcile' | 'upsertOne' | 'none'
export type Override<T, U> = Omit<T, keyof U> & U

export type FetchOptions = Options & {
  searchParams?: URLSearchParams
  silent?: boolean
}

export type idType<T extends AnyObject, forceType = never> =
  never extends forceType ? T extends { id: infer I } ? I :
  T extends { _id: infer I } ? I : string
  : forceType

export interface Resource<T extends AnyObject, forceIdType = never> {
  Type: T
  urlPrefix: string

  getAll: (opts?: FetchOptions) => Promise<T[]>
  getById: (id: idType<T, forceIdType>) => Promise<T>
  create: (resource: T, opts?: FetchOptions) => Promise<T>
  update: <U extends Partial<T> = Partial<T>>(id: idType<T, forceIdType>, resource: U, opts?: FetchOptions) => Promise<T>
  delete: (id: idType<T, forceIdType>, opts?: FetchOptions) => Promise<void>
  addListener(listener: ResourceListener<T, forceIdType>): () => void
  extend<This extends this, E extends AnyObject>(
    this: This,
    extender: ResourceExtender<T, forceIdType, E, This>,
    options?: { allowOverride?: boolean }
  ): Override<This, E>
}

export type resourceType<R extends Resource<any, any>> = R extends Resource<infer T, any> ? T : never
export type resourceIdType<R extends Resource<any, any>> = R extends Resource<infer T, infer I> ? idType<T, I> : never

export type ResourceMethod = Exclude<
  keyof Resource<any> & {},
  'addListener' | 'Type' | 'urlPrefix' | 'extend'
>
export type ResourceCallKey = ResourceMethod | (string & {})

export type ResourceExtenderContext<T extends AnyObject, forceIdType = never> = Resource<T, forceIdType> & {
  call: <R>(
    key: ResourceCallKey,
    url: string,
    p: AugmentedResponsePromise,
    shouldWrap: boolean,
    getParams: () => GetParamsResult<T, forceIdType>,
    parser?: ZodType<R>
  ) => Promise<R>
}

export type GetParamsResult<T extends AnyObject, forceIdType = never> = { id?: idType<T, forceIdType>; elem?: any }

export interface ResourceListener<T extends AnyObject, forceIdType = never> {
  beforeCall?: (key: ResourceCallKey, url: string, getParams: () => GetParamsResult<T, forceIdType>) => void
  afterCall?: (
    key: ResourceCallKey,
    url: string,
    result: any,
    getParams: () => GetParamsResult<T, forceIdType>
  ) => void
  wrapCall?: (
    key: ResourceCallKey,
    fn: () => Promise<any>,
    getParams: () => GetParamsResult<T, forceIdType>
  ) => Promise<any>
}

export type ResourceOptions<
  T extends AnyObject,
  forceIdType = never
> = ThrottledOptions & {
  silent?: boolean
  parser?: ZodType<T>
}

export type ResourceExtender<
  T extends AnyObject,
  forceIdType = never,
  E extends AnyObject = AnyObject,
  Existing extends AnyObject = {}
> = (
  resource: ResourceExtenderContext<T, forceIdType> & Existing
) => E
