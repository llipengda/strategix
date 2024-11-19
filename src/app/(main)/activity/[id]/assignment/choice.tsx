'use client'

import dynamic from 'next/dynamic'

import PreferenceChoice from '@/app/(main)/activity/[id]/assignment/preference-choice'
import type { TasksByUser } from '@/lib/task-process'

const ChoiceWrapper = dynamic(() => import('./choice-wrapper'), {
  ssr: false
})

interface ChoiceProps {
  isStopped: boolean
  activityId: string
  userId: string
  userName: string
  tasksByUser: TasksByUser
}

const Choice: React.FC<ChoiceProps> = ({
  isStopped,
  activityId,
  tasksByUser,
  userId,
  userName
}) => {
  return (
    <ChoiceWrapper activityId={activityId}>
      <PreferenceChoice
        isStopped={isStopped}
        userId={userId}
        userName={userName}
        activityId={activityId}
        tasksByUser={tasksByUser}
      />
    </ChoiceWrapper>
  )
}

export default Choice
