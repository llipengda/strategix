'use client'

import dynamic from 'next/dynamic'

import PreferenceChoice from '@/app/(main)/activity/[id]/assignment/preference-choice'
import type { TasksByUser } from '@/lib/task-process'

const ChoiceWrapper = dynamic(() => import('./choice-wrapper'), {
  ssr: false
})

interface ChoiceProps {
  activityId: string
  userId: string
  tasksByUser: TasksByUser
}

const Choice: React.FC<ChoiceProps> = ({ activityId, tasksByUser, userId }) => {
  return (
    <ChoiceWrapper activityId={activityId}>
      <PreferenceChoice
        userId={userId}
        activityId={activityId}
        tasksByUser={tasksByUser}
      />
    </ChoiceWrapper>
  )
}

export default Choice
