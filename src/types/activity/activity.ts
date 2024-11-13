import { v4 } from 'uuid'
import { z } from 'zod'

import { localDate } from '@/lib/time'

const sectionBaseSchema = z.object({
  type: z.string(),
  value: z.unknown()
})

const descriptionSchema = sectionBaseSchema.extend({
  type: z.literal('description'),
  value: z.string()
})

const purposeSchema = sectionBaseSchema.extend({
  type: z.literal('purpose'),
  value: z.string()
})

const sectionSchema = z.union([
  descriptionSchema,
  purposeSchema,
  sectionBaseSchema
])

type Description = z.infer<typeof descriptionSchema>
type Purpose = z.infer<typeof purposeSchema>
type Section = z.infer<typeof sectionSchema>

export const section = {
  isDescription: (section: Section): section is Description =>
    section.type === 'description',
  isPurpose: (section: Section): section is Purpose =>
    section.type === 'purpose'
}

export const Activity = z
  .object({
    id: z.string().uuid().default(v4),
    type: z.literal('activity').optional().default('activity'),
    name: z.string(),
    team: z.string(),
    sections: z.array(sectionSchema),
    time: z
      .date()
      .transform(v => v.toISOString())
      .optional(),
    timeRange: z
      .tuple([z.date(), z.date()])
      .transform(v => [v[0].toISOString(), v[1].toISOString()] as const)
      .optional(),
    createdAt: z.string().datetime().default(localDate().toISOString()),
    sk: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.time && data.timeRange) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '只能有一个时间或时间范围'
      })
    }
  })
  .transform(data => {
    let sk = 'activity#'
    if (data.time) sk += `${data.time}#`
    if (data.timeRange) sk += `${data.timeRange[0]}#${data.timeRange[1]}#`
    sk += `${data.createdAt}#`
    return { ...data, sk }
  })

export type Activity = Expand<z.infer<typeof Activity>>
