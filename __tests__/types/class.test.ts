import { isClass, TypeHolder, withType } from '../../src/types/class'

describe('isClass', () => {
  it('should return true for ES6 classes', () => {
    class MyClass { }
    expect(isClass(MyClass)).toBe(true)
  })

  it('should return false for built-in classes (native code)', () => {
    // Built-in classes have different toString representation
    // isClass checks if toString starts with 'class', which doesn't work for native code
    expect(isClass(Date)).toBe(false)
    expect(isClass(Map)).toBe(false)
  })

  it('should return false for regular functions', () => {
    function regularFn() { }
    expect(isClass(regularFn)).toBe(false)
  })

  it('should return false for arrow functions', () => {
    const arrowFn = () => { }
    expect(isClass(arrowFn)).toBe(false)
  })

  it('should handle non-functions', () => {
    expect(isClass({})).toBe(false)
    expect(isClass('class')).toBe(false)
  })
})

describe('TypeHolder', () => {
  it('should hold a type for inference', () => {
    const holder = new TypeHolder<{ name: string; age: number }>()
    // TypeHolder is used at compile time for type inference
    // At runtime it's just an empty object
    expect(holder).toBeInstanceOf(TypeHolder)
  })
})

describe('withType', () => {
  it('should return holder with inferred type', () => {
    const holder = withType<number>()
    expect(holder).toBeInstanceOf(TypeHolder)
  })
})
