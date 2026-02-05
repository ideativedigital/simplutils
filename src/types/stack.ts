import { take } from '../arrays'

export abstract class Stack<T> {
  protected stack: T[] = []
  constructor(protected size: number = 20) {}
  abstract push(item: T): void

  pop() {
    const [head, ...tail] = this.stack
    this.stack = tail
    return head
  }

  dumpIntoArray() {
    const result = this.stack
    this.stack = []
    return result
  }

  toArray() {
    return [...this.stack]
  }

  isEmpty() {
    return this.stack.length === 0
  }
}

export class FIFOStack<T> extends Stack<T> {
  push(item: T) {
    if (this.stack.length === this.size) {
      this.stack = [...this.stack.slice(1), item]
    } else {
      this.stack = [...this.stack, item]
    }
  }
}

export class LIFOStack<T> extends Stack<T> {
  push(item: T) {
    this.stack = [item, ...take(this.stack, this.size - 1)]
  }
}
