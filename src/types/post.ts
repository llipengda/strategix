import { v4 } from 'uuid'
import { z } from 'zod'

export const Post = z
  .object({
    id: z.string().default(`post-${v4()}`),
    title: z.string(),
    team: z.string(),
    publishDate: z.date().transform(value => value.toISOString()),
    isFrontPage: z.boolean().default(false),
    previewUrl: z.string().optional(),
    createdAt: z
      .date()
      .default(new Date())
      .transform(value => value.toISOString()),
    type: z.literal('post').optional().default('post'),
    sk: z.string().optional()
  })
  .transform(data => ({
    ...data,
    sk: `${data.publishDate}#${data.isFrontPage ? '0' : '1'}#${data.createdAt}`
  }))

export type Post = z.infer<typeof Post>
