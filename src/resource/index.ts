import { AnyObject } from '../objects'
import { ResourceClass } from './class'
import { Resource, ResourceOptions } from './types'

export * from './types'
export * from './constants'
export * from './build-url'

export function resource<T extends AnyObject, forceIdType = never>(
  urlPrefix: string,
  options?: ResourceOptions<T, forceIdType>
): Resource<T, forceIdType> {
  return new ResourceClass<T, forceIdType>(urlPrefix, options?.parser, options)
}

export const createResource = resource
