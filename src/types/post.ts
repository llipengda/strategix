import { v4 } from 'uuid'
import { z } from 'zod'

import { localDate } from '@/lib/time'

export const Post = z
  .object({
    id: z.string().uuid().default(v4),
    title: z.string(),
    team: z.string().min(1, { message: '团队不能为空' }),
    publishDate: z.date().transform(value => value.toISOString()),
    isFrontPage: z.boolean().default(false),
    previewUrl: z.string().optional(),
    createdAt: z
      .date()
      .default(localDate())
      .transform(value => value.toISOString()),
    type: z.literal('post').optional().default('post'),
    sk: z.string().optional()
  })
  .transform(data => ({
    ...data,
    sk: `${data.publishDate}#${data.isFrontPage ? '0' : '1'}#${data.createdAt}`
  }))

export type Post = z.infer<typeof Post>
