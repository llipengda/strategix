import { v4 } from 'uuid'
import { z } from 'zod'

import { localDate } from '@/lib/time'

const _Announcement = z
  .object({
    id: z.string().uuid().default(v4),
    publisherId: z.string().optional(),
    publisherName: z.string(),
    content: z.string(),
    createdAt: z
      .date()
      .transform(value => value.toISOString())
      .default(localDate()),
    pin: z.boolean().default(false),
    publishTo: z.string().optional(),
    type: z.literal('announcement').optional().default('announcement'),
    sk: z.string().optional()
  })
  .transform(data => ({
    ...data,
    sk: `${data.pin ? '1' : '0'}#${data.createdAt}`
  }))

export const Announcement = _Announcement.transform(
  data =>
    Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as Announcement
)

export type Announcement = z.infer<typeof _Announcement>
