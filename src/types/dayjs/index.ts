import dayjs, { Dayjs } from 'dayjs'
import { z } from 'zod'

/**
 * A Zod codec for Dayjs objects.
 * Accepts Date objects (or coercible values) and transforms them to Dayjs instances.
 * When encoding (e.g., for JSON), converts back to Date objects.
 * @example
 * const schema = z.object({ createdAt: zDayjs })
 * const result = schema.parse({ createdAt: new Date() })
 * // result.createdAt is a Dayjs instance
 *
 * const encoded = schema.serialize(result)
 * // encoded.createdAt is a Date object
 */
export const zDayjs = z.codec(
    z.coerce.date(),
    z.instanceof(Dayjs),
    {
        decode: (value) => dayjs(value),
        encode: (value) => value.toDate()
    }
)