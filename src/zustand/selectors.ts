import { Resource } from '../resource'
import { defaultGetId } from './helpers'
import { InferResourceId, InferResourceItem, ResourceSliceFor } from './types'

export const selectResourceSlice = <R>(state: ResourceSliceFor<R>) => state

export const createResourceSelectors = <R>(
  _resource: R & Resource<InferResourceItem<R>, InferResourceId<R>>,
  options?: { getId?: (item: InferResourceItem<R>) => InferResourceId<R> }
) => {
  const getId = options?.getId ?? defaultGetId<InferResourceItem<R>, InferResourceId<R>>
  return {
    selectItems: (state: ResourceSliceFor<R>) => state.items,
    selectById: (id: InferResourceId<R>) => (state: ResourceSliceFor<R>) =>
      state.items.find(item => getId(item) === id),
    selectStatus: (state: ResourceSliceFor<R>) => ({
      loading: state.loading,
      error: state.error,
      lastUpdated: state.lastUpdated
    })
  }
}
