export type GeneratedGroup<T> = {
  index: number
  content: T
  end: boolean
}

type BriefGroupContent = {
  name: string
  time?: string
  timeRange?: readonly [string, string]
}

type SectionGroupContent = {
  section: {
    type: string
    name: string
    value: string
  }
}

export type GeneratedActivityGroup = GeneratedGroup<
  BriefGroupContent | SectionGroupContent
>

export const checkGroup = {
  isBrief: (
    content: BriefGroupContent | SectionGroupContent
  ): content is BriefGroupContent => 'name' in content,
  isSection: (
    content: BriefGroupContent | SectionGroupContent
  ): content is SectionGroupContent => 'section' in content
}
