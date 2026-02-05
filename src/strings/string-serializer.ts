/**
 * Interface for bidirectional string serialization.
 * Allows converting values to strings and back.
 * @template V - The type of value being serialized
 */
export type StringSerializer<V> = {
  /** Converts a value to its string representation */
  toString: (s?: V) => string | undefined
  /** Parses a string back into its original value type */
  fromString: (str?: string) => V | undefined
}

/**
 * Built-in string serializers for common types.
 * @example
 * StringSerializers.number.toString(42)      // => '42'
 * StringSerializers.number.fromString('42')  // => 42
 *
 * StringSerializers.string.toString('hello') // => 'hello'
 * StringSerializers.string.fromString('hi')  // => 'hi'
 */
export const StringSerializers = {
  /** Serializer for number values (uses parseInt for parsing) */
  number: {
    fromString: str => (typeof str === 'undefined' ? undefined : parseInt(str)),
    toString: v => (typeof v === 'undefined' ? v : v + '')
  } as StringSerializer<number>,
  /** Serializer for string values (identity function) */
  string: { fromString: str => str, toString: v => v } as StringSerializer<string>
}
