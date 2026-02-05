import dayjs from 'dayjs'
import { AnyObject, isInstanceOfAnyClass } from './object-utils'

export type FieldChange = {
  field: string
  oldValue: any
  newValue: any
}

const dateToString = (date: any): string => {
  return date instanceof Date ? date.toISOString() : dayjs.isDayjs(date) ? date.toISOString() : date
}

export const computeDiff = (lhs: any, rhs: any, prefix: string = ''): FieldChange[] => {
  if (lhs === rhs) return []
  if (typeof lhs === 'undefined' && typeof rhs === 'undefined') return []
  if (lhs === null && rhs === null) return []
  if (rhs === null || typeof rhs === 'undefined' || lhs === null || typeof lhs === 'undefined')
    return [{ field: prefix, oldValue: lhs, newValue: rhs }]
  if (typeof lhs !== typeof rhs) return [{ field: prefix, oldValue: lhs, newValue: rhs }]
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    let changes: FieldChange[] = []
    for (let i = 0; i < Math.max(lhs.length, rhs.length); i++) {
      changes = [...changes, ...computeDiff(lhs[i], rhs[i], prefix ? `${prefix}[${i}]` : `[${i}]`)]
    }
    return changes
  }
  if (dayjs.isDayjs(lhs) || dayjs.isDayjs(rhs) || lhs instanceof Date || rhs instanceof Date) {
    return dayjs(lhs).isSame(rhs)
      ? []
      : [{ field: prefix, oldValue: dateToString(lhs), newValue: dateToString(rhs) }]
  }

  if (isInstanceOfAnyClass(lhs) && isInstanceOfAnyClass(rhs)) {
    if (lhs.constructor !== rhs.constructor) {
      return [{ field: prefix, oldValue: lhs, newValue: rhs }]
    } else {
      if ((lhs.equals && lhs.equals(rhs)) || lhs.toString() === rhs.toString()) {
        return []
      } else {
        return [{ field: prefix, oldValue: lhs, newValue: rhs }]
      }
    }
  }
  if (typeof lhs === 'object' && typeof rhs === 'object') {
    let changes: FieldChange[] = []
    for (const key of Object.keys({ ...lhs, ...rhs })) {
      changes = [...changes, ...computeDiff(lhs[key], rhs[key], prefix ? `${prefix}.${key}` : key)]
    }
    return changes
  }
  return [{ field: prefix, oldValue: lhs, newValue: rhs }]
}

export const setElementInArray = (arr: any[], idx: number, value: any): any[] => {
  if (idx >= arr.length && typeof value !== 'undefined') {
    return [...arr, value]
  } else if (value === undefined) {
    return arr.flatMap((v, i) => (i === idx ? [] : [v]))
  } else {
    return arr.map((v, i) => (i === idx ? value : v))
  }
}

export const rewindDiffs = <T extends AnyObject>(obj: T, diff: FieldChange[]): T => {
  const lhs = { ...obj }
  return diff.reduce((acc, change) => {
    const keys = change.field.split('.')
    let obj = acc
    for (let i = 0; i < keys.length - 1; i++) {
      if (!keys[i]) {
        throw new Error('Invalid key')
      }
      if (keys[i]!.endsWith(']')) {
        const [key, index] = keys[i]!.split('[')
        const idx = parseInt(index!.slice(0, -1))
        obj = obj[key!]
        obj = obj[idx]
      } else {
        obj = obj[keys[i]!]
      }
    }
    const lastKey = keys[keys.length - 1]
    if (lastKey!.endsWith(']')) {
      const [key, index] = lastKey!.split('[')
      const idx = parseInt(index!.slice(0, -1))
      console.log(`obj[${key!}][${idx}] = ${change.oldValue}`)
      console.log('obj', obj)
        ; (obj[key!] as any) = setElementInArray(obj[key!], idx, change.oldValue)
    } else {
      console.log(`setting obj[${lastKey}!] = ${change.oldValue}`)
        ; (obj[lastKey!] as any) = change.oldValue
    }

    return acc
  }, lhs)
}

export const applyDiffs = <T extends AnyObject>(obj: T, diff: FieldChange[]): T => {
  const lhs = { ...obj }
  return diff.reduce((acc, change) => {
    const keys = change.field.split('.')
    let obj = acc
    for (let i = 0; i < keys.length - 1; i++) {
      if (!keys[i]) {
        throw new Error('Invalid key')
      }
      if (keys[i]!.endsWith(']')) {
        const [key, index] = keys[i]!.split('[')
        const idx = parseInt(index!.slice(0, -1))
        obj = obj[key!]
        obj = obj[idx]
      } else {
        obj = obj[keys[i]!]
      }
    }
    const lastKey = keys[keys.length - 1]
    if (lastKey!.endsWith(']')) {
      const [key, index] = lastKey!.split('[')
      const idx = parseInt(index!.slice(0, -1))
        ; (obj[key!] as any) = setElementInArray(obj[key!], idx, change.newValue)
    } else {
      ; (obj[lastKey!] as any) = change.newValue
    }

    return acc
  }, lhs)
}
