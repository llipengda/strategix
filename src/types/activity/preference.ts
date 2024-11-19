import { z } from 'zod'

export const Preference = z
  .object({
    id: z.string().uuid(),
    sk: z.string().optional(),
    userId: z.string(),
    userName: z.string(),
    fakeAssignment: z.string(),
    preference: z.number().min(0).max(100),
    type: z.literal('preference').default('preference')
  })
  .transform(data => ({
    ...data,
    sk: `preference#${data.userId}#${data.fakeAssignment}`
  }))

export type Preference = z.infer<typeof Preference>
