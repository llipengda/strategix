'use client'

import { use, useRef, useState } from 'react'

import { v4 } from 'uuid'

import Assignments from '@/app/(main)/activity/new/assignments'
import EditNameAndTime from '@/app/(main)/activity/new/edit-name-and-time'
import Edits from '@/app/(main)/activity/new/edits'
import { KeyContext } from '@/app/(main)/activity/new/key-context'
import Publish from '@/app/(main)/activity/new/publish'
import AiDialog from '@/components/ai-dialog'
import { updateActivityAction } from '@/lib/actions/activity'
import { continueGenerateActivity, generateActivity } from '@/lib/actions/ai'
import sleep from '@/lib/sleep'
import { Activity } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'
import { type GeneratedActivityGroup, checkGroup } from '@/types/ai'
import type { Team } from '@/types/team'

interface ContentProps {
  activity: Activity | null
  team: Team
  tasks: Task[]
  assignments: Assignment[]
}

const Content: React.FC<ContentProps> = ({
  activity: _activity,
  team,
  tasks,
  assignments
}) => {
  const [aiError, setAiError] = useState<string | undefined>()

  const [activity, setActivity] = useState<Partial<Activity> | null>(_activity)

  const { key } = use(KeyContext)

  const [generating, setGenerating] = useState(false)

  const activityRef = useRef<Partial<Activity> | null>(null)

  const handleAiGenerate = async (additionalInfo: string) => {
    setAiError(undefined)

    if (!activity?.name) {
      setAiError('请先保存活动名称')
      return
    }

    activityRef.current = activity

    try {
      setGenerating(true)

      let _res: string
      let res: GeneratedActivityGroup
      _res = await generateActivity(activity, additionalInfo)

      res = JSON.parse(_res) as GeneratedActivityGroup

      if (checkGroup.isBrief(res.content)) {
        setActivity(activity => ({
          ...activity,
          ...res.content
        }))
      }

      while (!res.end) {
        _res = await continueGenerateActivity()
        res = JSON.parse(_res) as GeneratedActivityGroup

        setGenerating(false)

        const content = res.content

        if (checkGroup.isSection(content)) {
          const newSection = { id: v4(), ...content.section }
          setActivity(activity => {
            return {
              ...activity,
              sections: [...(activity?.sections || []), newSection]
            }
          })

          setTimeout(async () => {
            if (document !== undefined) {
              const added = document.getElementById(newSection.id)
              if (added) {
                added.scrollIntoView({
                  behavior: 'smooth'
                })

                for (let i = 0; i < 3; i++) {
                  await sleep(100)
                  added.style.backgroundColor = '#fefce8'
                  await sleep(300)
                  added.style.backgroundColor = ''
                  await sleep(200)
                }
              }
            }
          }, 200)
        }
      }
    } catch (error) {
      console.error(error)
      setAiError('AI生成失败')
    } finally {
      setGenerating(false)
    }
  }

  const handleAiConfirm = async () => {
    setAiError(undefined)

    const toUpdate = Object.fromEntries(
      Object.entries(activity!).filter(
        ([k, v]) => k !== 'id' && k !== 'sk' && v !== undefined
      )
    )

    await updateActivityAction(key!, toUpdate)
  }

  const handleAiRevert = () => {
    setAiError(undefined)

    if (activityRef.current) {
      setActivity(activityRef.current)
    }
  }

  return (
    <>
      <EditNameAndTime
        preValues={
          activity
            ? [activity.name!, (activity.time || activity.timeRange)!]
            : undefined
        }
      />
      <Edits sections={activity?.sections || []} />
      <Assignments
        team={team}
        totalUsers={activity?.totalUsers}
        assignType={activity?.assignType}
        tasks={tasks}
        assignments={assignments}
      />
      <Publish stage={activity?.stage || 'draft'} />
      <AiDialog
        generating={generating}
        aiError={aiError}
        onAiGenerate={handleAiGenerate}
        onConfirm={handleAiConfirm}
        onRevert={handleAiRevert}
      />
    </>
  )
}

export default Content
