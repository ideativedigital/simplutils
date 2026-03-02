import { StoreApi } from 'zustand/vanilla'
import { AnyObject } from '../objects'
import { ConsolidatedMethod, FetchOptions, idType, Resource } from '../resource'

export type InferResourceItem<R> = R extends Resource<infer T, any> ? T : never
export type resourceItemType<R> = InferResourceItem<R>

export type InferResourceId<R> = R extends Resource<infer T, infer I> ? idType<T, I> : never
export type resourceIdType<R> = InferResourceId<R>

export type ResourceSliceFor<R> = ResourceSlice<InferResourceItem<R>, InferResourceId<R>>
export type ResourceExtraActions<R> = {
  [K in keyof R as
  R[K] extends ConsolidatedMethod<(...args: any[]) => any, infer C>
  ? K extends keyof Resource<any, any>
  ? never
  : C extends 'none'
  ? never
  : K
  : never
  ]: R[K]
}
export type resourceSlice<R> = ResourceSliceFor<R> & ResourceExtraActions<R>

export type ResourceRemoteAction = 'getAll' | 'getById' | 'create' | 'update' | 'delete'
export type ResourceLocalAction =
  | 'locallySetAll'
  | 'locallySetOne'
  | 'locallyUpsertOne'
  | 'locallyRemoveOne'
  | 'locallyPatchOne'
  | 'locallyConsolidateResult'
  | 'locallySetLoading'
  | 'locallySetError'
  | 'locallyReset'
export type ResourceSliceAction = ResourceRemoteAction | ResourceLocalAction

export type ResourceSliceState<T extends AnyObject> = {
  items: T[]
  loading: boolean
  error: unknown | null
  loadingByAction: Partial<Record<ResourceSliceAction, boolean>>
  errorByAction: Partial<Record<ResourceSliceAction, unknown | null>>
  lastUpdated?: number
}

export type ResourceSliceActions<T extends AnyObject, forceIdType = never> = {
  getAll: (opts?: FetchOptions) => Promise<T[]>
  getById: (id: idType<T, forceIdType>) => Promise<T>
  create: (resource: T, opts?: FetchOptions) => Promise<T>
  update: <U extends Partial<T> = Partial<T>>(
    id: idType<T, forceIdType>,
    resource: U,
    opts?: FetchOptions
  ) => Promise<T>
  delete: (id: idType<T, forceIdType>, opts?: FetchOptions) => Promise<void>
  locallySetAll: (items: T[]) => void
  locallySetOne: (item: T) => void
  locallyUpsertOne: (item: T) => void
  locallyRemoveOne: (id: idType<T, forceIdType>) => void
  locallyPatchOne: (id: idType<T, forceIdType>, patch: Partial<T>) => void
  locallyConsolidateResult: (result: unknown) => boolean
  locallySetLoading: (loading: boolean, action?: ResourceSliceAction) => void
  locallySetError: (error: unknown | null, action?: ResourceSliceAction) => void
  locallyReset: () => void
  selectById: (id: idType<T, forceIdType>) => T | undefined
}

export type ResourceSlice<T extends AnyObject, forceIdType = never> = ResourceSliceState<T> & ResourceSliceActions<T, forceIdType>

export type ResourceSliceOptions<T extends AnyObject, forceIdType = never> = {
  initialItems?: T[]
  getId?: (item: T) => idType<T, forceIdType>
  now?: () => number
}

export type ResourceSliceHelpers<T extends AnyObject, forceIdType = never> = {
  getId: (item: T) => idType<T, forceIdType>
  findById: (id: idType<T, forceIdType>) => T | undefined
}

export type ResourceStoreHelpers<R> = {
  getId: (item: InferResourceItem<R>) => InferResourceId<R>
  findById: (id: InferResourceId<R>) => InferResourceItem<R> | undefined
}

export type ResourceStoreExtenderContext<R, E extends AnyObject = AnyObject> = {
  resource: R & Resource<InferResourceItem<R>, InferResourceId<R>>
  get: StoreApi<resourceSlice<R> & E>['getState']
  set: StoreApi<resourceSlice<R> & E>['setState']
  helpers: ResourceStoreHelpers<R>
}

export type ResourceStoreExtender<R, E extends AnyObject = AnyObject> = (
  context: ResourceStoreExtenderContext<R, E>
) => E

export type ResourceSliceCreator<T extends AnyObject, forceIdType = never, E extends AnyObject = AnyObject> = (
  set: StoreApi<ResourceSlice<T, forceIdType> & E>['setState'],
  get: StoreApi<ResourceSlice<T, forceIdType> & E>['getState'],
  store: StoreApi<ResourceSlice<T, forceIdType> & E>
) => ResourceSlice<T, forceIdType> & E
