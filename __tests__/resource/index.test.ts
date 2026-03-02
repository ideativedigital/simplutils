jest.mock('zod-ky', () => {
  const makeResponse = (payload: any) => {
    const p: any = Promise.resolve({
      json: async () => payload
    })
    p.json = async () => payload
    p.parseJson = async () => payload
    return p
  }

  return {
    ky: {
      get: () => makeResponse([]),
      post: () => makeResponse({}),
      put: () => makeResponse({}),
      delete: () => makeResponse({})
    }
  }
})

const resourceModule = require('../../src/resource') as typeof import('../../src/resource')
const { buildUrlWithParams, createResource, resource } = resourceModule
const { ky } = require('zod-ky') as { ky: any }
type ResourceTypeAlias<R extends import('../../src/resource').Resource<any, any>> = import('../../src/resource').resourceType<R>
type ResourceIdTypeAlias<R extends import('../../src/resource').Resource<any, any>> = import('../../src/resource').resourceIdType<R>

describe('buildUrlWithParams', () => {
  it('should append query params', () => {
    const sp = new URLSearchParams({ q: 'alice', page: '2' })
    expect(buildUrlWithParams('/users', { searchParams: sp } as any)).toBe('/users?q=alice&page=2')
  })

  it('should return base url when no params are provided', () => {
    expect(buildUrlWithParams('/users')).toBe('/users')
  })

  it('should handle empty query params', () => {
    expect(buildUrlWithParams('/users', { searchParams: new URLSearchParams() } as any)).toBe('/users?')
  })
})

describe('resource factories', () => {
  it('should expose CRUD methods on resource instances', () => {
    const r = resource<{ id: string; name: string }>('/api/users')
    expect(r.urlPrefix).toBe('/api/users')
    expect(typeof r.getAll).toBe('function')
    expect(typeof r.getById).toBe('function')
    expect(typeof r.create).toBe('function')
    expect(typeof r.update).toBe('function')
    expect(typeof r.delete).toBe('function')
    expect(typeof r.addListener).toBe('function')
  })

  it('createResource should be an alias of resource', () => {
    expect(createResource).toBe(resource)
  })

  it('should unsubscribe listeners returned by addListener', async () => {
    const beforeCall = jest.fn()
    const r = resource<{ id: string; name: string }, string>('/api/users')

    const unsubscribe = r.addListener({ beforeCall })
    await r.getById('1')
    expect(beforeCall).toHaveBeenCalledTimes(1)

    unsubscribe()
    await r.getById('2')
    expect(beforeCall).toHaveBeenCalledTimes(1)
  })

  it('should allow extending a resource with custom methods', async () => {
    const users = resource<{ id: string; name: string }, string>('/api/users').extend(r => ({
      search: async (q: string) => {
        const searchParams = new URLSearchParams({ q })
        const url = buildUrlWithParams(`${r.urlPrefix}/search`, { searchParams } as any)
        return r.call('search', url, ky.get(url), true, () => ({}))
      }
    }))

    expect(users.urlPrefix).toBe('/api/users')
    expect(typeof users.search).toBe('function')

    await expect(users.search('alice')).resolves.toEqual([])
  })

  it('should allow fluent extend and chaining', async () => {
    const users = resource<{ id: string; name: string }, string>('/api/users')
      .extend(r => ({
        search: async (q: string) => {
          const searchParams = new URLSearchParams({ q })
          const url = buildUrlWithParams(`${r.urlPrefix}/search`, { searchParams } as any)
          return r.call('search', url, ky.get(url), true, () => ({ elem: { q } as any }))
        }
      }))
      .extend(r => ({
        searchByName: (name: string) => r.search(name)
      }))

    await expect(users.searchByName('alice')).resolves.toEqual([])
  })

  it('should throw when extension collides with existing keys', () => {
    expect(() =>
      resource<{ id: string; name: string }, string>('/api/users').extend(() => ({
        getAll: async () => []
      }))
    ).toThrow('Resource extension collision on key "getAll"')
  })

  it('should allow overriding base function when allowOverride is true', async () => {
    const users = resource<{ id: string; name: string }, string>('/api/users').extend(
      () => ({
        getAll: async () => ({ items: [{ id: '1', name: 'Alice' }] })
      }),
      { allowOverride: true }
    )

    const result = await users.getAll()
    expect(result.items[0].name).toBe('Alice')
  })

  it('should notify listeners for custom extension call keys', async () => {
    const beforeCall = jest.fn()
    const afterCall = jest.fn()
    const users = resource<{ id: string; name: string }, string>('/api/users').extend(r => ({
      search: async (q: string) => {
        const searchParams = new URLSearchParams({ q })
        const url = buildUrlWithParams(`${r.urlPrefix}/search`, { searchParams } as any)
        return r.call('search', url, ky.get(url), true, () => ({ elem: { q } as any }))
      }
    }))

    users.addListener({ beforeCall, afterCall })
    await users.search('alice')
    expect(beforeCall).toHaveBeenCalledWith('search', '/api/users/search?q=alice', expect.any(Function))
    expect(afterCall).toHaveBeenCalledWith('search', '/api/users/search?q=alice', expect.anything(), expect.any(Function))
  })

  it('should expose resourceType and resourceIdType inference aliases', () => {
    const users = resource<{ id: string; name: string }, string>('/api/users')
    type TUser = ResourceTypeAlias<typeof users>
    type TUserId = ResourceIdTypeAlias<typeof users>

    const sampleUser: TUser = { id: '1', name: 'Alice' }
    const sampleId: TUserId = '1'
    expect(sampleUser.id).toBe(sampleId)
  })
})
