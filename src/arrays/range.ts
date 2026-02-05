export type ArrayRange = {
  (stop: number): number[]
  (start: number, count: number): number[]
  (start: number, count: number, step: number): number[]
}

export const arrayRange: ArrayRange = (param: number, count?: number, step: number = 1) => {
  if (step === 0) throw new Error('No 0 step allowed')
  const length = count ? count - param : param
  const start = count ? param : 0
  return Array.from({ length: length / Math.abs(step) }, (value, index) => start + index * step)
}
