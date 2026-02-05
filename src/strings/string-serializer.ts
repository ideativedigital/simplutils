export type StringSerializer<V> = {
  toString: (s?: V) => string | undefined
  fromString: (str?: string) => V | undefined
}

export const StringSerializers = {
  number: {
    fromString: str => (typeof str === 'undefined' ? undefined : parseInt(str)),
    toString: v => (typeof v === 'undefined' ? v : v + '')
  } as StringSerializer<number>,
  string: { fromString: str => str, toString: v => v } as StringSerializer<string>
}
