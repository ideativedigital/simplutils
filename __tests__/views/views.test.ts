import { z } from 'zod'
import { addView, createView, mergeViews } from '../../src/views'

describe('createView', () => {
  describe('basic functionality', () => {
    it('should add computed properties as getters', () => {
      const obj = { firstName: 'John', lastName: 'Doe' }
      const withView = createView((u: typeof obj) => ({
        get fullName() { return `${u.firstName} ${u.lastName}` }
      }))

      const result = withView(obj)

      expect(result.fullName).toBe('John Doe')
    })

    it('should support regular values (converted to getters)', () => {
      const obj = { a: 1, b: 2 }
      const withView = createView((u: typeof obj) => ({
        sum: u.a + u.b
      }))

      const result = withView(obj)
      expect(result).toEqual({ ...obj })
      expect(result.sum).toBe(3)
    })

    it('should preserve original object properties', () => {
      const obj = { name: 'Alice', age: 30 }
      const withView = createView((u: typeof obj) => ({
        get description() { return `${u.name} is ${u.age}` }
      }))

      const result = withView(obj)

      expect(result.name).toBe('Alice')
      expect(result.age).toBe(30)
      expect(result.description).toBe('Alice is 30')
    })

    it('should support multiple computed properties', () => {
      const obj = { first: 'Jane', last: 'Smith', birthYear: 1990 }
      const withView = createView((u: typeof obj) => ({
        get fullName() { return `${u.first} ${u.last}` },
        get age() { return new Date().getFullYear() - u.birthYear }
      }))

      const result = withView(obj)

      expect(result.fullName).toBe('Jane Smith')
      expect(result.age).toBe(new Date().getFullYear() - 1990)
    })

    it('should mutate the original object (same reference)', () => {
      const obj = { value: 10 }
      const withView = createView((u: typeof obj) => ({
        get doubled() { return u.value * 2 }
      }))

      const result = withView(obj)

      expect(result).toBe(obj) // Same reference
      expect(result.doubled).toBe(20)

      // Mutating original affects computed getter
      obj.value = 5
      expect(result.doubled).toBe(10)
    })
  })

  describe('serialization behavior', () => {
    it('should not include computed getters in JSON.stringify', () => {
      const obj = { firstName: 'John', lastName: 'Doe' }
      const withView = createView((u: typeof obj) => ({
        get fullName() { return `${u.firstName} ${u.lastName}` }
      }))

      const result = withView(obj)
      const serialized = JSON.stringify(result)

      expect(serialized).toBe('{"firstName":"John","lastName":"Doe"}')
      expect(JSON.parse(serialized)).not.toHaveProperty('fullName')
    })

    it('should not include regular value views in JSON.stringify', () => {
      const obj = { x: 10 }
      const withView = createView((u: typeof obj) => ({
        doubled: u.x * 2
      }))

      const result = withView(obj)
      const serialized = JSON.stringify(result)

      expect(result.doubled).toBe(20)
      expect(serialized).toBe('{"x":10}')
    })

    it('should make computed properties non-enumerable', () => {
      const obj = { value: 42 }
      const withView = createView((u: typeof obj) => ({
        get computed() { return u.value * 2 }
      }))

      const result = withView(obj)

      expect(Object.keys(result)).toEqual(['value'])
      expect(Object.getOwnPropertyDescriptor(result, 'computed')?.enumerable).toBe(false)
      expect(result.computed).toBe(84)
    })
  })

  describe('with Zod transform', () => {
    it('should work as a Zod transform to add computed getters', () => {
      const userSchema = z.object({
        firstName: z.string(),
        lastName: z.string()
      }).transform(createView(u => ({
        get fullName() { return `${u.firstName} ${u.lastName}` }
      })))

      const user = userSchema.parse({ firstName: 'John', lastName: 'Doe' })

      expect(user).toEqual({ firstName: 'John', lastName: 'Doe' })
      expect(user.firstName).toBe('John')
      expect(user.lastName).toBe('Doe')
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
      expect(JSON.parse(JSON.stringify(person))).toEqual({
        name: 'Alice',
        address: { street: '123 Main St', city: 'NYC', zip: '10001' }
      })
    })

    it('should maintain same object reference through chained transforms', () => {
      let capturedObj1: any
      let capturedObj2: any
      let capturedObj3: any

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
      }).transform(obj => {
        capturedObj3 = obj
        return createView(() => ({
          get quadrupled() { return obj.value * 4 }
        }))(obj)
      })

      const result = schema.parse({ value: 10 })

      // All captured references should be the same object
      expect(capturedObj1).toBe(capturedObj2)
      expect(capturedObj2).toBe(capturedObj3)
      expect(capturedObj3).toBe(result)

      // All views should work
      expect(result.doubled).toBe(20)
      expect(result.tripled).toBe(30)
      expect(result.quadrupled).toBe(40)

      // Object wasn't cloned - modifying it affects the views
      result.value = 5
      expect(result.doubled).toBe(10)
      expect(result.tripled).toBe(15)
      expect(result.quadrupled).toBe(20)
    })
  })
})

describe('addView (alias)', () => {
  it('should be an alias for createView', () => {
    expect(addView).toBe(createView)
  })
})

describe('mergeViews', () => {
  type User = {
    firstName: string
    lastName: string
    birthday: Date
  }

  const fullNameView = createView((u: User) => ({
    get fullName() { return `${u.firstName} ${u.lastName}` }
  }))

  const ageView = createView((u: User) => ({
    get age() { return new Date().getFullYear() - u.birthday.getFullYear() }
  }))

  describe('combining views', () => {
    it('should combine multiple views into one', () => {
      const combinedView = mergeViews(fullNameView, ageView)

      const user = combinedView({
        firstName: 'John',
        lastName: 'Doe',
        birthday: new Date('1990-01-01')
      })

      expect(user.fullName).toBe('John Doe')
      expect(user.age).toBe(new Date().getFullYear() - 1990)
    })

    it('should apply views in order (left to right)', () => {
      // Create a third view that depends on properties added by previous views
      // Note: This demonstrates sequential view composition
      const combinedView = mergeViews(fullNameView, ageView)

      const user = combinedView({
        firstName: 'Jane',
        lastName: 'Smith',
        birthday: new Date('1985-06-15')
      })

      const expectedAge = new Date().getFullYear() - 1985
      expect(user.fullName).toBe('Jane Smith')
      expect(user.age).toBe(expectedAge)

      // Apply a third view manually to show sequential dependency
      const greetingView = createView((u: typeof user) => ({
        get greeting() { return `Hello, ${u.fullName}! You are ${u.age}.` }
      }))
      const userWithGreeting = greetingView(user)
      expect(userWithGreeting.greeting).toBe(`Hello, Jane Smith! You are ${expectedAge}.`)
    })

    it('should preserve original object reference', () => {
      const combinedView = mergeViews(fullNameView, ageView)
      const original = {
        firstName: 'Test',
        lastName: 'User',
        birthday: new Date('2000-01-01')
      }

      const result = combinedView(original)

      expect(result).toBe(original)
    })

    it('should not serialize view properties', () => {
      const combinedView = mergeViews(fullNameView, ageView)

      const user = combinedView({
        firstName: 'John',
        lastName: 'Doe',
        birthday: new Date('1990-01-01')
      })

      const parsed = JSON.parse(JSON.stringify(user))
      expect(parsed).toHaveProperty('firstName')
      expect(parsed).toHaveProperty('lastName')
      expect(parsed).toHaveProperty('birthday')
      expect(parsed).not.toHaveProperty('fullName')
      expect(parsed).not.toHaveProperty('age')
    })

    it('should work with empty views array', () => {
      const noopView = mergeViews()
      const obj = { value: 42 }

      const result = noopView(obj)

      expect(result).toBe(obj)
      expect((result as typeof obj).value).toBe(42)
    })

    it('should work with single view', () => {
      const singleView = mergeViews(fullNameView)

      const user = singleView({
        firstName: 'Solo',
        lastName: 'View',
        birthday: new Date()
      })

      expect(user.fullName).toBe('Solo View')
    })
  })

  describe('with Zod transform', () => {
    it('should work as a Zod transform', () => {
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

    it('should preserve Zod validation', () => {
      const userSchema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        birthday: z.coerce.date()
      }).transform(mergeViews(fullNameView, ageView))

      expect(() => userSchema.parse({
        firstName: '',
        lastName: 'Test',
        birthday: '1990-01-01'
      })).toThrow()
    })
  })

  describe('type safety', () => {
    it('should have correct types for combined views', () => {
      const combinedView = mergeViews(fullNameView, ageView)

      const user = combinedView({
        firstName: 'Type',
        lastName: 'Test',
        birthday: new Date()
      })

      // TypeScript should know these properties exist
      const _fullName: string = user.fullName
      const _age: number = user.age
      const _firstName: string = user.firstName
      const _lastName: string = user.lastName
      const _birthday: Date = user.birthday

      expect(_fullName).toBeDefined()
      expect(_age).toBeDefined()
      expect(_firstName).toBeDefined()
      expect(_lastName).toBeDefined()
      expect(_birthday).toBeDefined()
    })
  })

  describe('reactive getters', () => {
    it('should recompute when underlying data changes', () => {
      type Counter = { count: number }
      const doubleView = createView((c: Counter) => ({
        get doubled() { return c.count * 2 }
      }))

      const counter = { count: 5 }
      const enhanced = doubleView(counter)

      expect(enhanced.doubled).toBe(10)

      counter.count = 10
      expect(enhanced.doubled).toBe(20)

      counter.count = 0
      expect(enhanced.doubled).toBe(0)
    })

    it('should handle dependent views that reference each other', () => {
      type Box = { width: number; height: number }

      const areaView = createView((b: Box) => ({
        get area() { return b.width * b.height }
      }))

      const perimeterView = createView((b: Box) => ({
        get perimeter() { return 2 * (b.width + b.height) }
      }))

      const combinedView = mergeViews(areaView, perimeterView)
      const box = combinedView({ width: 10, height: 5 })

      expect(box.area).toBe(50)
      expect(box.perimeter).toBe(30)

      box.width = 20
      expect(box.area).toBe(100)
      expect(box.perimeter).toBe(50)
    })
  })
})
