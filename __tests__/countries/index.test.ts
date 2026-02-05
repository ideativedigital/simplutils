import { countriesIso2, getFlag, isCountry, isSupportedCountriesLang, translateCountry } from '../../src/countries'

describe('getFlag', () => {
  it('should return flag emoji for country code', () => {
    expect(getFlag('us')).toBe('🇺🇸')
    expect(getFlag('fr')).toBe('🇫🇷')
    expect(getFlag('jp')).toBe('🇯🇵')
  })
})

describe('translateCountry', () => {
  it('should translate country code to English name', () => {
    expect(translateCountry('us', 'en')).toBe('United States')
    expect(translateCountry('fr', 'en')).toBe('France')
  })

  it('should translate country code to French name', () => {
    expect(translateCountry('us', 'fr')).toBe('États-Unis')
    expect(translateCountry('fr', 'fr')).toBe('France')
  })

  it('should return the code for invalid code (with console error)', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    expect(translateCountry('xx' as any, 'en')).toBe('xx')
    consoleSpy.mockRestore()
  })

  it('should include flag when option set', () => {
    expect(translateCountry('de', 'en', { includeFlag: true })).toBe('🇩🇪 Germany')
  })
})

describe('isCountry', () => {
  it('should return true for valid country codes (lowercase)', () => {
    expect(isCountry('us')).toBe(true)
    expect(isCountry('fr')).toBe(true)
    expect(isCountry('jp')).toBe(true)
  })

  it('should return false for invalid codes', () => {
    expect(isCountry('xx')).toBe(false)
    expect(isCountry('USA')).toBe(false) // Must be lowercase
    expect(isCountry('US')).toBe(false) // Must be lowercase
    expect(isCountry('')).toBe(false)
  })
})

describe('isSupportedCountriesLang', () => {
  it('should return true for supported languages', () => {
    expect(isSupportedCountriesLang('en')).toBe(true)
    expect(isSupportedCountriesLang('fr')).toBe(true)
    expect(isSupportedCountriesLang('de')).toBe(true)
  })

  it('should return false for unsupported languages', () => {
    expect(isSupportedCountriesLang('xx')).toBe(false)
  })
})

describe('countriesIso2', () => {
  it('should be an array of lowercase ISO2 codes', () => {
    expect(Array.isArray(countriesIso2)).toBe(true)
    expect(countriesIso2).toContain('us')
    expect(countriesIso2).toContain('fr')
    expect(countriesIso2.length).toBeGreaterThan(100)
  })
})
