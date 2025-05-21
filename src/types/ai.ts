import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

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
  type: string
  name: string
  value: string
}

export type GeneratedActivityGroup = GeneratedGroup<
  BriefGroupContent | SectionGroupContent
>

export const checkGroup = {
  isBrief: (
    content: BriefGroupContent | SectionGroupContent
  ): content is BriefGroupContent => !('type' in content),
  isSection: (
    content: BriefGroupContent | SectionGroupContent
  ): content is SectionGroupContent => 'type' in content
}

export type GTaskAndAssignmentGroup =
  | {
      type: 'modify-task'
      index: number
      content: Task
      end: boolean
    }
  | {
      type: 'generate-task'
      index: number
      content: Omit<Task, 'id' | 'sk' | 'taskId'>
      end: boolean
    }
  | {
      type: 'generate-assignment'
      index: number
      content: Omit<Assignment, 'id' | 'sk'>
      end: boolean
    }
