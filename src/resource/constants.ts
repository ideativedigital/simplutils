import { ResourceMethodConsolidation } from './types'

export const resourceMethodConsolidationKey = Symbol('@ideative/simplutils/resource/method-consolidation')

export type ConsolidatedMethod<
  F extends (...args: any[]) => any,
  C extends ResourceMethodConsolidation = ResourceMethodConsolidation
> = F & {
  [resourceMethodConsolidationKey]: C
}

export const withConsolidation = <F extends (...args: any[]) => any, C extends ResourceMethodConsolidation>(
  fn: F,
  consolidation: C
): ConsolidatedMethod<F, C> => {
  ;(fn as any)[resourceMethodConsolidationKey] = consolidation
  return fn as ConsolidatedMethod<F, C>
}
