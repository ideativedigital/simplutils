/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * Useful for adding delays in async functions.
 * @param ms - The number of milliseconds to wait
 * @returns A promise that resolves after the specified delay
 * @example
 * await delay(1000) // Wait 1 second
 * console.log('1 second has passed')
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
