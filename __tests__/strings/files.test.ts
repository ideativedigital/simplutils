import { getFileExtension, splitFilenameAndExtension } from '../../src/strings/files'

describe('splitFilenameAndExtension', () => {
  it('should split filename and extension', () => {
    expect(splitFilenameAndExtension('document.pdf')).toEqual(['document', 'pdf'])
  })

  it('should handle files with multiple dots', () => {
    expect(splitFilenameAndExtension('archive.tar.gz')).toEqual(['archive.tar', 'gz'])
  })

  it('should handle no extension', () => {
    expect(splitFilenameAndExtension('README')).toEqual(['README', ''])
  })

  it('should handle trailing dot', () => {
    expect(splitFilenameAndExtension('file.')).toEqual(['file', ''])
  })

  it('should handle dotfiles', () => {
    expect(splitFilenameAndExtension('.gitignore')).toEqual(['.gitignore', ''])
  })
})

describe('getFileExtension', () => {
  it('should get extension', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf')
  })

  it('should return last extension for multiple dots', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz')
  })

  it('should return empty string for no extension', () => {
    expect(getFileExtension('README')).toBe('')
  })

  it('should return empty string for dotfiles', () => {
    expect(getFileExtension('.gitignore')).toBe('')
  })
})
