import { enumKeys, enumObject, enumValues } from '../../src/enums'

enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

enum NumericStatus {
  Pending = 0,
  Active = 1,
  Completed = 2
}

describe('enumObject', () => {
  it('should return object mapping for string enum', () => {
    expect(enumObject(Color)).toEqual({
      Red: 'RED',
      Green: 'GREEN',
      Blue: 'BLUE'
    })
  })

  it('should return object mapping for numeric enum', () => {
    expect(enumObject(NumericStatus)).toEqual({
      Pending: 0,
      Active: 1,
      Completed: 2
    })
  })
})

describe('enumKeys', () => {
  it('should return keys for string enum', () => {
    expect(enumKeys(Color)).toEqual(['Red', 'Green', 'Blue'])
  })

  it('should return keys for numeric enum', () => {
    expect(enumKeys(NumericStatus)).toEqual(['Pending', 'Active', 'Completed'])
  })
})

describe('enumValues', () => {
  it('should return values for string enum', () => {
    expect(enumValues(Color)).toEqual(['RED', 'GREEN', 'BLUE'])
  })

  it('should return values for numeric enum', () => {
    expect(enumValues(NumericStatus)).toEqual([0, 1, 2])
  })
})
