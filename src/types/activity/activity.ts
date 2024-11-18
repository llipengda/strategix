import { v4 } from 'uuid'
import { z } from 'zod'

import { localDate } from '@/lib/time'

const SectionBase = z.object({
  id: z.string().uuid().default(v4),
  type: z.string(),
  name: z.string(),
  value: z.unknown()
})

const Description = SectionBase.extend({
  type: z.literal('description'),
  name: z.literal('活动简介'),
  value: z.string()
})

const Purpose = SectionBase.extend({
  type: z.literal('purpose'),
  name: z.literal('活动目的'),
  value: z.string()
})

const Note = SectionBase.extend({
  type: z.literal('note'),
  name: z.literal('注意事项'),
  value: z.string()
})

export const predefinedSections = [
  { type: 'description', name: '活动简介' },
  { type: 'purpose', name: '活动目的' },
  { type: 'note', name: '注意事项' },
  { type: 'custom', name: '自定义' }
]

export const sectionMap = new Map(predefinedSections.map(s => [s.type, s.name]))

export const Section = z.union([Description, Purpose, Note, SectionBase])

type Description = z.infer<typeof Description>
type Purpose = z.infer<typeof Purpose>
export type Section = z.infer<typeof Section>

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
    totalUsers: z.number(),
    sections: z.array(Section),
    time: z
      .date()
      .transform(v => v.toISOString())
      .optional(),
    timeRange: z
      .tuple([z.date(), z.date()])
      .transform(v => [v[0].toISOString(), v[1].toISOString()] as const)
      .optional(),
    createdAt: z.string().datetime().default(localDate().toISOString()),
    stage: z
      .enum(['draft', 'inProgress', 'completed', 'archived'])
      .default('draft'),
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
