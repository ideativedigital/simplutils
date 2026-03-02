import { createStore, StoreApi } from 'zustand/vanilla'
import { AnyObject } from '../objects'
import { idType, Resource, ResourceMethodConsolidation } from '../resource'
import { createResourceSlice } from './slice'
import { defaultGetId, getMethodConsolidation } from './helpers'
import {
  InferResourceId,
  InferResourceItem,
  ResourceExtraActions,
  ResourceSliceFor,
  ResourceSliceOptions,
  ResourceStoreHelpers,
  ResourceStoreExtender,
  resourceSlice
} from './types'

export function createResourceStore<R>(
  resource: R & Resource<InferResourceItem<R>, InferResourceId<R>>,
  options?: ResourceSliceOptions<InferResourceItem<R>, InferResourceId<R>>
): StoreApi<resourceSlice<R>>
export function createResourceStore<R, E extends AnyObject = AnyObject>(
  resource: R & Resource<InferResourceItem<R>, InferResourceId<R>>,
  options: ResourceSliceOptions<InferResourceItem<R>, InferResourceId<R>> | undefined,
  extender: ResourceStoreExtender<R, E>
): StoreApi<resourceSlice<R> & E>
export function createResourceStore<R, E extends AnyObject = AnyObject>(
  resource: R & Resource<InferResourceItem<R>, InferResourceId<R>>,
  options?: ResourceSliceOptions<InferResourceItem<R>, InferResourceId<R>>,
  extender?: ResourceStoreExtender<R, E>
): StoreApi<resourceSlice<R> & E> {
  const baseCreator = createResourceSlice(resource, options)
  return createStore<resourceSlice<R> & E>((set, get, store) => {
    const applyMethodConsolidation = (
      consolidation: ResourceMethodConsolidation | undefined,
      result: unknown
    ) => {
      const actions = get() as ResourceSliceFor<R>
      const mode = consolidation ?? 'heuristic'
      if (mode === 'none') return
      if (mode === 'heuristic' || mode === 'reconcile') {
        actions.locallyConsolidateResult(result)
        return
      }
      if (mode === 'setAll') {
        if (Array.isArray(result)) {
          actions.locallySetAll(result as InferResourceItem<R>[])
          return
        }
        const maybeObject = result as AnyObject
        if (maybeObject && Array.isArray(maybeObject.items)) {
          actions.locallySetAll(maybeObject.items as InferResourceItem<R>[])
        }
        return
      }
      if (mode === 'upsertOne' && result && typeof result === 'object' && !Array.isArray(result)) {
        actions.locallyUpsertOne(result as InferResourceItem<R>)
      }
    }

    const baseSlice = baseCreator(set as any, get as any, store as any) as ResourceSliceFor<R>
    const baseResourceKeys = new Set<keyof Resource<any, any>>([
      'Type',
      'urlPrefix',
      'getAll',
      'getById',
      'create',
      'update',
      'delete',
      'addListener'
    ])
    const forwardedEntries = Object.keys(resource as AnyObject)
      .filter(key => !baseResourceKeys.has(key as keyof Resource<any, any>))
      .filter(key => typeof (resource as AnyObject)[key] === 'function')
      .filter(key => {
        const method = (resource as AnyObject)[key]
        const consolidation = getMethodConsolidation(method)
        return consolidation !== undefined && consolidation !== 'none'
      })
      .map(key => [key, (...args: any[]) => {
        const method = (resource as AnyObject)[key]
        const consolidation = getMethodConsolidation(method)
        const output = method(...args)
        if (output && typeof output.then === 'function') {
          return output.then((resolved: unknown) => {
            applyMethodConsolidation(consolidation, resolved)
            return resolved
          })
        }
        applyMethodConsolidation(consolidation, output)
        return output
      }] as const)
    const forwarded = Object.fromEntries(forwardedEntries) as ResourceExtraActions<R>
    const withForwarded = Object.assign(baseSlice, forwarded)
    if (!extender) return withForwarded as resourceSlice<R> & E
    const resolvedGetId = (options?.getId ?? defaultGetId<InferResourceItem<R>, InferResourceId<R>>) as (
      item: InferResourceItem<R>
    ) => idType<InferResourceItem<R>, InferResourceId<R>>
    const extra = extender({
      resource,
      get: get as StoreApi<resourceSlice<R> & E>['getState'],
      set: set as StoreApi<resourceSlice<R> & E>['setState'],
      helpers: {
        getId: resolvedGetId,
        findById: (id: InferResourceId<R>) =>
          (get() as ResourceSliceFor<R>).items.find(item => resolvedGetId(item) === id)
      } as ResourceStoreHelpers<R>
    })
    return Object.assign(withForwarded, extra)
  })
}
