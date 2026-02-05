import { fswitch, unapply } from '../../src/types/unapply'

describe('unapply', () => {
  it('should create type guard from class', () => {
    class MyError {
      constructor(public message: string) { }
    }

    const isMyError = unapply(MyError)
    const error = new MyError('test')

    expect(isMyError(error)).toBe(true)
    expect(isMyError(new Error('test'))).toBe(false)
  })

  it('should return validator as-is for functions', () => {
    const isString = (v: unknown): v is string => typeof v === 'string'
    const validator = unapply(isString)

    expect(validator('hello')).toBe(true)
    expect(validator(42)).toBe(false)
  })
})

describe('fswitch', () => {
  class Cat {
    speak() { return 'meow' }
  }

  class Dog {
    speak() { return 'woof' }
  }

  it('should match and execute correct case', () => {
    const sound = fswitch(new Cat())
      .case(Cat, (cat) => cat.speak())
      .case(Dog, (dog) => dog.speak())
      .execute()

    expect(sound).toBe('meow')
  })

  it('should return undefined for no match', () => {
    const sound = fswitch(new Dog())
      .case(Cat, () => 'meow')
      .execute()

    expect(sound).toBeUndefined()
  })

  it('should work with validator functions', () => {
    const isString = (v: unknown): v is string => typeof v === 'string'
    const isNumber = (v: unknown): v is number => typeof v === 'number'

    const result1 = fswitch('hello' as unknown)
      .case(isString, (s) => `String: ${s}`)
      .case(isNumber, (n) => `Number: ${n}`)
      .execute()

    const result2 = fswitch(42 as unknown)
      .case(isString, (s) => `String: ${s}`)
      .case(isNumber, (n) => `Number: ${n}`)
      .execute()

    expect(result1).toBe('String: hello')
    expect(result2).toBe('Number: 42')
  })

  it('should use default case when no match', () => {
    const result = fswitch(true as unknown)
      .case(Cat, () => 'cat')
      .default(() => 'unknown')
      .execute()

    expect(result).toBe('unknown')
  })
})
