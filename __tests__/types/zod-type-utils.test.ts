import { z } from 'zod'
import { createView, mergeViews } from '../../src/views'
// Test backwards-compatible re-exports from zod-type-utils





describe('views with Zod transform()', () => {
  it('should work as a Zod transform to add computed getters', () => {
    const userSchema = z.object({
      firstName: z.string(),
      lastName: z.string()
    }).transform(createView(u => ({
      get fullName() { return `${u.firstName} ${u.lastName}` }
    })))

    const user = userSchema.parse({ firstName: 'John', lastName: 'Doe' })

    expect(user).toEqual({ firstName: 'John', lastName: 'Doe' })
    expect(user.fullName).toBe('John Doe')
  })

  it('should not serialize computed properties when using Zod', () => {
    const productSchema = z.object({
      price: z.number(),
      quantity: z.number()
    }).transform(createView(p => ({
      get total() { return p.price * p.quantity }
    })))

    const product = productSchema.parse({ price: 10, quantity: 3 })

    expect(product.total).toBe(30)
    expect(JSON.stringify(product)).toBe('{"price":10,"quantity":3}')
  })

  it('should work with nested Zod schemas', () => {
    const addressSchema = z.object({
      street: z.string(),
      city: z.string(),
      zip: z.string()
    })

    const personSchema = z.object({
      name: z.string(),
      address: addressSchema
    }).transform(createView(p => ({
      get formattedAddress() {
        return `${p.address.street}, ${p.address.city} ${p.address.zip}`
      }
    })))

    const person = personSchema.parse({
      name: 'Alice',
      address: { street: '123 Main St', city: 'NYC', zip: '10001' }
    })

    expect(person.formattedAddress).toBe('123 Main St, NYC 10001')
  })

  it('should maintain same object reference through chained transforms', () => {
    let capturedObj1: any
    let capturedObj2: any

    const schema = z.object({
      value: z.number()
    }).transform(obj => {
      capturedObj1 = obj
      return createView(() => ({
        get doubled() { return obj.value * 2 }
      }))(obj)
    }).transform(obj => {
      capturedObj2 = obj
      return createView(() => ({
        get tripled() { return obj.value * 3 }
      }))(obj)
    })

    const result = schema.parse({ value: 10 })

    expect(capturedObj1).toBe(capturedObj2)
    expect(capturedObj2).toBe(result)
    expect(result.doubled).toBe(20)
    expect(result.tripled).toBe(30)
  })

  it('should work with mergeViews as a Zod transform', () => {
    type User = { firstName: string; lastName: string; birthday: Date }

    const fullNameView = createView((u: User) => ({
      get fullName() { return `${u.firstName} ${u.lastName}` }
    }))

    const ageView = createView((u: User) => ({
      get age() { return new Date().getFullYear() - u.birthday.getFullYear() }
    }))

    const userSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      birthday: z.coerce.date()
    }).transform(mergeViews(fullNameView, ageView))

    const user = userSchema.parse({
      firstName: 'Zod',
      lastName: 'User',
      birthday: '1995-03-20'
    })

    expect(user.fullName).toBe('Zod User')
    expect(user.age).toBe(new Date().getFullYear() - 1995)
    expect(JSON.stringify(user)).not.toContain('fullName')
  })

  it('should preserve Zod validation errors', () => {
    const userSchema = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1)
    }).transform(createView(u => ({
      get fullName() { return `${u.firstName} ${u.lastName}` }
    })))

    expect(() => userSchema.parse({
      firstName: '',
      lastName: 'Test'
    })).toThrow()
  })
})
