import { FIFOStack, LIFOStack } from '../../src/types/stack'

describe('FIFOStack', () => {
  it('should push and pop in FIFO order', () => {
    const stack = new FIFOStack<number>(3)
    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack.pop()).toBe(1)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(3)
  })

  it('should evict oldest when full', () => {
    const stack = new FIFOStack<number>(2)
    stack.push(1)
    stack.push(2)
    stack.push(3) // Evicts 1

    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(3)
  })

  it('should return undefined when empty', () => {
    const stack = new FIFOStack<number>(3)
    expect(stack.pop()).toBeUndefined()
  })

  it('should indicate empty status', () => {
    const stack = new FIFOStack<number>(3)
    expect(stack.isEmpty()).toBe(true)

    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
  })

  it('should return items with toArray', () => {
    const stack = new FIFOStack<number>(3)
    stack.push(1)
    stack.push(2)

    expect(stack.toArray()).toEqual([1, 2])
  })

  it('should dump and clear with dumpIntoArray', () => {
    const stack = new FIFOStack<number>(3)
    stack.push(1)
    stack.push(2)

    const items = stack.dumpIntoArray()
    expect(items).toEqual([1, 2])
    expect(stack.isEmpty()).toBe(true)
  })
})

describe('LIFOStack', () => {
  it('should push and pop in LIFO order', () => {
    const stack = new LIFOStack<number>(3)
    stack.push(1)
    stack.push(2)
    stack.push(3)

    // LIFO: items are added to front, pop removes from front
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(1)
  })

  it('should evict oldest when full', () => {
    const stack = new LIFOStack<number>(2)
    stack.push(1)
    stack.push(2)
    stack.push(3) // Evicts 1

    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
  })

  it('should indicate empty status', () => {
    const stack = new LIFOStack<number>(3)
    expect(stack.isEmpty()).toBe(true)

    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
  })

  it('should return items with toArray', () => {
    const stack = new LIFOStack<number>(3)
    stack.push(1)
    stack.push(2)

    // LIFO: newest items are at the front
    expect(stack.toArray()).toEqual([2, 1])
  })
})
