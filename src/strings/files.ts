import { take } from '../arrays'

/**
 * Options for file reading/searching operations.
 */
export type ReadFileOptions = {
    /** If true, requires exact filename match. If false, allows partial matches. */
    strict: boolean
}

/**
 * Splits a filename into its name and extension parts.
 * Handles edge cases like dotfiles (.gitignore) and multiple extensions (file.tar.gz).
 * @param fileName - The filename to split
 * @returns A tuple of [name, extension] where extension excludes the dot
 * @example
 * splitFilenameAndExtension('document.pdf')    // => ['document', 'pdf']
 * splitFilenameAndExtension('archive.tar.gz')  // => ['archive.tar', 'gz']
 * splitFilenameAndExtension('.gitignore')      // => ['.gitignore', '']
 */
export const splitFilenameAndExtension = (fileName: string): [string, string] => {
    const parts = fileName.split('.')
    if (parts.length === 1 || (parts.length === 2 && fileName.startsWith('.'))) return [parts[0]!, '']
    return [take(parts, parts.length - 2).join('.'), parts[parts.length - 1]!]
}

/**
 * Gets the extension of a filename.
 * @param fileName - The filename to extract the extension from
 * @returns The file extension without the dot, or empty string if none
 * @example
 * getFileExtension('document.pdf')  // => 'pdf'
 * getFileExtension('README')        // => ''
 */
export const getFileExtension = (fileName: string) => {
    const [_, extension] = splitFilenameAndExtension(fileName)
    return extension
}

/**
 * Searches for a file in an array of File objects by name.
 * @param files - Array of File objects to search
 * @param fileName - The filename to look for
 * @param options - Search options (default: strict matching)
 * @returns The matching File object, or undefined if not found
 * @example
 * // Strict match (exact filename)
 * lookForFile(files, 'document.pdf')
 *
 * // Loose match (partial name, same extension)
 * lookForFile(files, 'doc.pdf', { strict: false })
 */
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
