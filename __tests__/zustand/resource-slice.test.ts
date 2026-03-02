jest.mock('zod-ky', () => {
  type User = { id: string; name: string }
  let users: User[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
  ]

  const makeResponse = (payload: any) => {
    const p: any = Promise.resolve({
      json: async () => payload
    })
    p.json = async () => payload
    p.parseJson = async () => payload
    return p
  }

  const makeError = (message: string) => {
    const p: any = Promise.reject(new Error(message))
    p.json = async () => {
      throw new Error(message)
    }
    p.parseJson = async () => {
      throw new Error(message)
    }
    return p
  }

  const parse = (url: string) => new URL(url, 'http://localhost')

  return {
    ky: {
      get: (url: string) => {
        const { pathname, searchParams } = parse(url)
        if (pathname === '/api/users') {
          const q = searchParams.get('q')
          if (!q) return makeResponse([...users])
          return makeResponse(users.filter(u => u.name.toLowerCase().includes(q.toLowerCase())))
        }
        if (pathname.startsWith('/api/users/')) {
          const id = pathname.split('/').at(-1)!
          if (id === 'error') return makeError('forced error')
          const user = users.find(u => u.id === id)
          return user ? makeResponse(user) : makeError('not found')
        }
        return makeResponse([])
      },
      post: (_url: string, opts: { json: User }) => {
        users = [...users, opts.json]
        return makeResponse(opts.json)
      },
      put: (url: string, opts: { json: Partial<User> }) => {
        const { pathname } = parse(url)
        const id = pathname.split('/').at(-1)!
        const existing = users.find(u => u.id === id)
        if (!existing) return makeError('not found')
        const updated = { ...existing, ...opts.json }
        users = users.map(u => u.id === id ? updated : u)
        return makeResponse(updated)
      },
      delete: (url: string) => {
        const { pathname } = parse(url)
        const id = pathname.split('/').at(-1)!
        users = users.filter(u => u.id !== id)
        return makeResponse({})
      }
    }
  }
})
jest.mock('react', () => ({
  useDebugValue: () => undefined
}), { virtual: true })
jest.mock('use-sync-external-store/shim/with-selector', () => ({
  useSyncExternalStoreWithSelector: (_subscribe: any, getState: any, _getInitialState: any, selector: any) => selector(getState())
}), { virtual: true })

import { createWithEqualityFn } from 'zustand/traditional';
import { resource, withConsolidation } from '../../src/resource';
import {
  createResourceSelectors,
  createResourceSlice,
  createResourceStore,
  InferResourceId,
  InferResourceItem,
  resourceSlice,
  ResourceSliceFor
} from '../../src/zustand';

type User = { id: string; name: string }

describe('zustand resource slice', () => {
  it('should initialize with array-first state and locallyReset', () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource, {
      initialItems: [{ id: '0', name: 'Initial' }],
      now: () => 111
    })

    expect(store.getState().items).toEqual([{ id: '0', name: 'Initial' }])
    expect(store.getState().lastUpdated).toBe(111)

    store.getState().locallySetAll([{ id: '1', name: 'Alice' }])
    expect(store.getState().items).toEqual([{ id: '1', name: 'Alice' }])

    store.getState().locallyReset()
    expect(store.getState().items).toEqual([{ id: '0', name: 'Initial' }])
    expect(store.getState().loading).toBe(false)
    expect(store.getState().error).toBeNull()
  })

  it('should expose all locally* actions and sync item updates', () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource)

    store.getState().locallySetAll([{ id: '1', name: 'Alice' }])
    store.getState().locallySetOne({ id: '2', name: 'Bob' })
    store.getState().locallyUpsertOne({ id: '2', name: 'Bobby' })
    store.getState().locallyPatchOne('1', { name: 'Alicia' })
    store.getState().locallyRemoveOne('2')
    store.getState().locallySetLoading(true, 'locallySetLoading')
    store.getState().locallySetError(new Error('local'), 'locallySetError')

    expect(store.getState().items).toEqual([{ id: '1', name: 'Alicia' }])
    expect(store.getState().loadingByAction.locallySetLoading).toBe(true)
    expect(store.getState().errorByAction.locallySetError).toBeInstanceOf(Error)
    expect(store.getState().selectById('1')?.name).toBe('Alicia')
  })

  it('should wire async resource methods to store state', async () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource)

    await store.getState().getAll()
    expect(store.getState().items.length).toBeGreaterThanOrEqual(2)

    const one = await store.getState().getById('1')
    expect(one.name).toBe('Alice')

    await store.getState().create({ id: '3', name: 'Carol' })
    expect(store.getState().selectById('3')?.name).toBe('Carol')

    await store.getState().update('3', { name: 'Caroline' })
    expect(store.getState().selectById('3')?.name).toBe('Caroline')

    await store.getState().delete('3')
    expect(store.getState().selectById('3')).toBeUndefined()
  })

  it('should capture async loading and error states', async () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource)

    await expect(store.getState().getById('error')).rejects.toThrow('forced error')
    expect(store.getState().loadingByAction.getById).toBe(false)
    expect(store.getState().errorByAction.getById).toBeInstanceOf(Error)
  })

  it('should allow extending store API with typed helpers', async () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource, undefined, ({ helpers, get }) => ({
      findNameById: (id: string) => helpers.findById(id)?.name,
      allNames: () => get().items.map(i => i.name)
    }))

    await store.getState().getAll()
    expect(store.getState().findNameById('1')).toBe('Alice')
    expect(store.getState().allNames()).toContain('Bob')
  })

  it('should auto-forward custom resource methods to store', async () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        search: withConsolidation(
          (q: string) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any),
          'reconcile'
        )
      })
    )
    const store = createResourceStore(usersResource)

    const result = await store.getState().search('ali')
    expect(result).toEqual([{ id: '1', name: 'Alice' }])
    expect(store.getState().items).toEqual([{ id: '1', name: 'Alice' }])
  })

  it('should provide typed selectors relative to resource', () => {
    const usersResource = resource<User, string>('/api/users')
    const selectors = createResourceSelectors(usersResource)
    const store = createResourceStore(usersResource)
    const state = store.getState()

    expect(selectors.selectItems(state).length).toBe(0)
    expect(selectors.selectById('1')(state)).toBeUndefined()
  })

  it('should preserve inferable resource-linked slice types', () => {
    const usersResource = resource<User, string>('/api/users')
    type LinkedItem = InferResourceItem<typeof usersResource>
    type LinkedId = InferResourceId<typeof usersResource>
    type LinkedSlice = ResourceSliceFor<typeof usersResource>

    const sampleItem: LinkedItem = { id: 'x', name: 'X' }
    const sampleId: LinkedId = 'x'
    const sampleSlice = {
      items: [sampleItem],
      loading: false,
      error: null,
      loadingByAction: {},
      errorByAction: {}
    } as LinkedSlice

    expect(sampleSlice.items[0].id).toBe(sampleId)
  })

  it('should work with createWithEqualityFn and slice extension', async () => {
    const usersResource = resource<User, string>('/api/users')
    type UsersStoreState = resourceSlice<typeof usersResource> & {
      selectedId?: string
      setSelectedId: (id?: string) => void
      selectedUser: () => User | undefined
    }
    const useUsersStore = createWithEqualityFn<UsersStoreState>(
      (set, get, store) => ({
        ...createResourceSlice(usersResource)(set, get, store),
        selectedId: undefined as string | undefined,
        setSelectedId: (id?: string) => set({ selectedId: id }),
        selectedUser: () => {
          const id = get().selectedId
          return id ? get().selectById(id) : undefined
        }
      }),
      Object.is
    )

    await useUsersStore.getState().getAll()
    useUsersStore.getState().setSelectedId('1')
    expect(useUsersStore.getState().selectedUser()?.name).toBe('Alice')
  })

  it('should support extended resource and extended store together', async () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        search: withConsolidation(
          (q: string) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any),
          'reconcile'
        )
      })
    )

    const store = createResourceStore(usersResource)

    const result = await store.getState().search('ali')
    expect(result).toEqual([{ id: '1', name: 'Alice' }])
    expect(store.getState().items).toEqual([{ id: '1', name: 'Alice' }])
  })

  it('should type extender resource as concrete extended resource', () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        search: withConsolidation(
          (q: string) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any),
          'reconcile'
        )
      })
    )

    const store = createResourceStore(usersResource, undefined, ({ resource }) => ({
      searchViaResource: (q: string) => resource.search(q)
    }))

    expect(typeof store.getState().searchViaResource).toBe('function')
  })

  it('should not auto-forward non-consolidated custom methods', () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        search: (q: string) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any)
      })
    )
    const store = createResourceStore(usersResource)
    expect((store.getState() as any).search).toBeUndefined()
  })

  it('should not forward methods marked with none consolidation', async () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        searchNoSync: withConsolidation(
          (q: string) => r.getAll({ searchParams: new URLSearchParams({ q }) } as any),
          'none'
        )
      })
    )
    const store = createResourceStore(usersResource)
    expect((store.getState() as any).searchNoSync).toBeUndefined()
  })

  it('should apply explicit upsertOne consolidation for custom methods', async () => {
    const usersResource = resource<User, string>('/api/users').extend(
      r => ({
        me: withConsolidation(() => r.getById('1'), 'upsertOne')
      })
    )
    const store = createResourceStore(usersResource)
    store.getState().locallySetAll([{ id: '2', name: 'Bob' }])

    const me = await store.getState().me()
    expect(me).toEqual({ id: '1', name: 'Alice' })
    expect(store.getState().items).toEqual([
      { id: '2', name: 'Bob' },
      { id: '1', name: 'Alice' }
    ])
  })

  it('should consolidate custom result payloads manually', () => {
    const usersResource = resource<User, string>('/api/users')
    const store = createResourceStore(usersResource)

    expect(store.getState().locallyConsolidateResult({ id: '9', name: 'Nina' })).toBe(true)
    expect(store.getState().selectById('9')?.name).toBe('Nina')

    expect(
      store.getState().locallyConsolidateResult({
        items: [{ id: '10', name: 'Tina' }]
      })
    ).toBe(true)
    expect(store.getState().items).toEqual([{ id: '10', name: 'Tina' }])

    expect(store.getState().locallyConsolidateResult({ count: 1 })).toBe(false)
  })

  it('should reconcile list consolidation by merging and pruning', () => {
    type LocalUser = User & { localTag?: string }
    const usersResource = resource<LocalUser, string>('/api/users')
    const store = createResourceStore(usersResource)

    store.getState().locallySetAll([
      { id: '1', name: 'Alice', localTag: 'keep' },
      { id: '2', name: 'Bob', localTag: 'drop' }
    ])

    expect(
      store.getState().locallyConsolidateResult([
        { id: '1', name: 'Alicia' },
        { id: '3', name: 'Carol' }
      ])
    ).toBe(true)

    expect(store.getState().items).toEqual([
      { id: '1', name: 'Alicia', localTag: 'keep' },
      { id: '3', name: 'Carol' }
    ])
  })
})
