import { take } from '../arrays'

export type ReadFileOptions = { strict: boolean }

export const splitFilenameAndExtension = (fileName: string): [string, string] => {
    const parts = fileName.split('.')
    if (parts.length === 1 || (parts.length === 2 && fileName.startsWith('.'))) return [parts[0]!, '']
    return [take(parts, parts.length - 2).join('.'), parts[parts.length - 1]!]
}

export const getFileExtension = (fileName: string) => {
    const [_, extension] = splitFilenameAndExtension(fileName)
    return extension
}

export const lookForFile = (
    files: File[],
    fileName: string,
    options: ReadFileOptions = { strict: true }
) => {
    const [name, extension] = splitFilenameAndExtension(fileName)
    return files.find(f => {
        if (options?.strict) return f.name === fileName
        if (!f.name.endsWith(extension)) return false
        return f.name.includes(name)
    })
}
