/**
 * Function signature for arrayRange with multiple overloads.
 */
export type ArrayRange = {
  (stop: number): number[]
  (start: number, count: number): number[]
  (start: number, count: number, step: number): number[]
}

/**
 * Generates an array of numbers in a specified range.
 * @param param - When called with one argument: the stop value (starts at 0).
 *                When called with two+ arguments: the start value.
 * @param count - The end value (exclusive)
 * @param step - The increment between values (default: 1). Cannot be 0.
 * @returns An array of numbers from start to count (exclusive), incrementing by step
 * @throws Error if step is 0
 * @example
 * arrayRange(5)        // => [0, 1, 2, 3, 4]
 * arrayRange(2, 6)     // => [2, 3, 4, 5]
 * arrayRange(0, 10, 2) // => [0, 2, 4, 6, 8]
 */
export const arrayRange: ArrayRange = (param: number, count?: number, step: number = 1) => {
  if (step === 0) throw new Error('No 0 step allowed')
  const length = count ? count - param : param
  const start = count ? param : 0
  return Array.from({ length: length / Math.abs(step) }, (value, index) => start + index * step)
}
