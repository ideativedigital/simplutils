import dayjs, { Dayjs } from 'dayjs'
import { z } from 'zod'

export const zDayjs = z.codec(
    z.coerce.date(),
    z.instanceof(Dayjs),
    {
        decode: (value) => dayjs(value),
        encode: (value) => value.toDate()
    }
)