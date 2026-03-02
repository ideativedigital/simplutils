import { FetchOptions } from './types'

export const buildUrlWithParams = (baseUrl: string, opts?: FetchOptions): string => {
  const sp = opts?.searchParams ? `?${opts.searchParams.toString()}` : ''
  return `${baseUrl}${sp}`
}
