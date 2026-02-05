

/**
 * 
 * @param str 
 * @returns 
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function parseJson(str: string, defaultValue: any): any {
  try {
    return JSON.parse(str)
  } catch (e) {
    return defaultValue
  }
}
