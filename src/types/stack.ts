import { take } from '../arrays'

/**
 * Abstract base class for stack implementations with a fixed maximum size.
 * @template T - The type of elements in the stack
 */
export abstract class Stack<T> {
  protected stack: T[] = []

  /**
   * Creates a new stack with the specified maximum size.
   * @param size - Maximum number of elements (default: 20)
   */
  constructor(protected size: number = 20) { }

  /**
   * Adds an item to the stack. Implementation varies by stack type.
   * @param item - The item to add
   */
  abstract push(item: T): void

  /**
   * Removes and returns the first item from the stack.
   * @returns The removed item, or undefined if empty
   */
  pop() {
    const [head, ...tail] = this.stack
    this.stack = tail
    return head
  }

  /**
   * Removes all items from the stack and returns them.
   * @returns Array of all items that were in the stack
   */
  dumpIntoArray() {
    const result = this.stack
    this.stack = []
    return result
  }

  /**
   * Returns a copy of all items in the stack without modifying it.
   * @returns Array of all items in the stack
   */
  toArray() {
    return [...this.stack]
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack has no items
   */
  isEmpty() {
    return this.stack.length === 0
  }
}

/**
 * First-In-First-Out (FIFO) stack implementation (queue-like behavior).
 * When full, the oldest item is removed to make room for new items.
 * @template T - The type of elements in the stack
 * @example
 * const stack = new FIFOStack<number>(3)
 * stack.push(1) // [1]
 * stack.push(2) // [1, 2]
 * stack.push(3) // [1, 2, 3]
 * stack.push(4) // [2, 3, 4] (1 is removed)
 */
export class FIFOStack<T> extends Stack<T> {
  push(item: T) {
    if (this.stack.length === this.size) {
      this.stack = [...this.stack.slice(1), item]
    } else {
      this.stack = [...this.stack, item]
    }
  }
}

/**
 * Last-In-First-Out (LIFO) stack implementation.
 * New items are added to the front. When full, oldest items are dropped.
 * @template T - The type of elements in the stack
 * @example
 * const stack = new LIFOStack<number>(3)
 * stack.push(1) // [1]
 * stack.push(2) // [2, 1]
 * stack.push(3) // [3, 2, 1]
 * stack.push(4) // [4, 3, 2] (1 is dropped)
 */
export class LIFOStack<T> extends Stack<T> {
  push(item: T) {
    this.stack = [item, ...take(this.stack, this.size - 1)]
  }
}
