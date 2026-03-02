import { mergeArraysWithId } from '../arrays/id-arrays'
import { AnyObject } from '../objects'
import { FetchOptions, idType, Resource } from '../resource'
import { defaultGetId, removeById, updateById, upsertById } from './helpers'
import {
  ResourceSlice,
  ResourceSliceAction,
  ResourceSliceCreator,
  ResourceSliceHelpers,
  ResourceSliceOptions,
  ResourceSliceState
} from './types'

export function createResourceSlice<T extends AnyObject, forceIdType = never>(
  resource: Resource<T, forceIdType>,
  options?: ResourceSliceOptions<T, forceIdType>
): ResourceSliceCreator<T, forceIdType, {}> {
  const getId = options?.getId ?? defaultGetId<T, forceIdType>
  const now = options?.now ?? Date.now
  const initialItems = [...(options?.initialItems ?? [])]
  const initialState: ResourceSliceState<T> = {
    items: initialItems,
    loading: false,
    error: null,
    loadingByAction: {},
    errorByAction: {},
    lastUpdated: initialItems.length > 0 ? now() : undefined
  }

  return (set, get) => {
    const helpers: ResourceSliceHelpers<T, forceIdType> = {
      getId,
      findById: (id: idType<T, forceIdType>) => get().items.find(item => getId(item) === id)
    }
    const reconcileCollection = (incoming: T[]) => {
      set(state => ({
        ...state,
        items: mergeArraysWithId(state.items, incoming, {
          getId,
          pruneMissing: true,
          mergeItem: (sourceItem, incomingItem) => ({ ...sourceItem, ...incomingItem })
        }),
        lastUpdated: now()
      }))
    }

    const setActionLoading = (action: ResourceSliceAction, loading: boolean) => {
      set(state => ({
        ...state,
        loading,
        loadingByAction: {
          ...state.loadingByAction,
          [action]: loading
        }
      }))
    }

    const setActionError = (action: ResourceSliceAction, error: unknown | null) => {
      set(state => ({
        ...state,
        error,
        errorByAction: {
          ...state.errorByAction,
          [action]: error
        }
      }))
    }

    return {
      ...initialState,
      async getAll(opts?: FetchOptions) {
        setActionLoading('getAll', true)
        setActionError('getAll', null)
        try {
          const items = await resource.getAll(opts)
          get().locallySetAll(items)
          return items
        } catch (error) {
          setActionError('getAll', error)
          throw error
        } finally {
          setActionLoading('getAll', false)
        }
      },
      async getById(id: idType<T, forceIdType>) {
        setActionLoading('getById', true)
        setActionError('getById', null)
        try {
          const item = await resource.getById(id)
          get().locallyUpsertOne(item)
          return item
        } catch (error) {
          setActionError('getById', error)
          throw error
        } finally {
          setActionLoading('getById', false)
        }
      },
      async create(nextItem: T, opts?: FetchOptions) {
        setActionLoading('create', true)
        setActionError('create', null)
        try {
          const item = await resource.create(nextItem, opts)
          get().locallyUpsertOne(item)
          return item
        } catch (error) {
          setActionError('create', error)
          throw error
        } finally {
          setActionLoading('create', false)
        }
      },
      async update<U extends Partial<T> = Partial<T>>(id: idType<T, forceIdType>, payload: U, opts?: FetchOptions) {
        setActionLoading('update', true)
        setActionError('update', null)
        try {
          const item = await resource.update<U>(id, payload, opts)
          get().locallyUpsertOne(item)
          return item
        } catch (error) {
          setActionError('update', error)
          throw error
        } finally {
          setActionLoading('update', false)
        }
      },
      async delete(id: idType<T, forceIdType>, opts?: FetchOptions) {
        setActionLoading('delete', true)
        setActionError('delete', null)
        try {
          await resource.delete(id, opts)
          get().locallyRemoveOne(id)
        } catch (error) {
          setActionError('delete', error)
          throw error
        } finally {
          setActionLoading('delete', false)
        }
      },
      locallySetAll(nextItems: T[]) {
        set(state => ({
          ...state,
          items: [...nextItems],
          lastUpdated: now()
        }))
      },
      locallySetOne(nextItem: T) {
        set(state => ({
          ...state,
          items: upsertById(state.items, nextItem, getId),
          lastUpdated: now()
        }))
      },
      locallyUpsertOne(nextItem: T) {
        set(state => ({
          ...state,
          items: upsertById(state.items, nextItem, getId),
          lastUpdated: now()
        }))
      },
      locallyRemoveOne(id: idType<T, forceIdType>) {
        set(state => ({
          ...state,
          items: removeById(state.items, id, getId),
          lastUpdated: now()
        }))
      },
      locallyPatchOne(id: idType<T, forceIdType>, patch: Partial<T>) {
        set(state => ({
          ...state,
          items: updateById(state.items, id, getId, item => ({ ...item, ...patch })),
          lastUpdated: now()
        }))
      },
      locallyConsolidateResult(result: unknown) {
        try {
          if (Array.isArray(result)) {
            if (result.length === 0 || result.every(item => {
              try {
                getId(item as T)
                return true
              } catch {
                return false
              }
            })) {
              reconcileCollection(result as T[])
              return true
            }
            return false
          }
          if (result && typeof result === 'object') {
            const maybeObject = result as AnyObject
            if (Array.isArray(maybeObject.items)) {
              return get().locallyConsolidateResult(maybeObject.items)
            }
            try {
              getId(maybeObject as T)
              set(state => ({
                ...state,
                items: mergeArraysWithId(state.items, [maybeObject as T], {
                  getId,
                  mergeItem: (sourceItem, incomingItem) => ({ ...sourceItem, ...incomingItem })
                }),
                lastUpdated: now()
              }))
              return true
            } catch {
              return false
            }
          }
          return false
        } catch {
          return false
        }
      },
      locallySetLoading(loading: boolean, action?: ResourceSliceAction) {
        if (!action) {
          set(state => ({ ...state, loading }))
          return
        }
        setActionLoading(action, loading)
      },
      locallySetError(error: unknown | null, action?: ResourceSliceAction) {
        if (!action) {
          set(state => ({ ...state, error }))
          return
        }
        setActionError(action, error)
      },
      locallyReset() {
        set(state => ({
          ...state,
          ...initialState,
          items: [...initialItems],
          loadingByAction: {},
          errorByAction: {}
        }))
      },
      selectById(id: idType<T, forceIdType>) {
        return helpers.findById(id)
      }
    } satisfies ResourceSlice<T, forceIdType>
  }
}
