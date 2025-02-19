'use client'

import { use, useRef, useState } from 'react'

import { v4 } from 'uuid'

import Assignments from '@/app/(main)/activity/new/assignments'
import EditNameAndTime from '@/app/(main)/activity/new/edit-name-and-time'
import Edits from '@/app/(main)/activity/new/edits'
import { KeyContext } from '@/app/(main)/activity/new/key-context'
import Publish from '@/app/(main)/activity/new/publish'
import AiDialog from '@/components/ai-dialog'
import {
  addTask,
  deleteTask,
  updateActivityAction
} from '@/lib/actions/activity'
import {
  continueGenerateActivity,
  continueGenerateAssignment,
  continueGenerateTask,
  generateActivity,
  generateAssignment,
  generateTask
} from '@/lib/actions/ai'
import sleep from '@/lib/sleep'
import { Activity } from '@/types/activity/activity'
import { Assignment } from '@/types/activity/assignment'
import { Task } from '@/types/activity/task'
import {
  type GTaskAndAssignmentGroup,
  type GeneratedActivityGroup,
  checkGroup
} from '@/types/ai'
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
  tasks: _tasks,
  assignments: _assignments
}) => {
  const [aiError, setAiError] = useState<string | undefined>()

  const [activity, setActivity] = useState<Partial<Activity> | null>(_activity)
  const [tasks, setTasks] = useState<Task[]>(_tasks)
  const [assignments, setAssignments] = useState<Assignment[]>(_assignments)

  const { key } = use(KeyContext)

  const [generating, setGenerating] = useState(false)

  const activityRef = useRef<Partial<Activity> | null>(null)

  const addedTasks = useRef<Task[]>([])

  const handleTaskAndAssignment = async (res2: GTaskAndAssignmentGroup) => {
    if (res2.type === 'modify-task') {
      const content = res2.content as Task
      setTasks(tasks => {
        const taskIndex = tasks.findIndex(t => t.taskId === content.taskId)
        const newTasks = [...tasks]
        newTasks[taskIndex] = content
        return newTasks
      })
    } else if (res2.type === 'generate-task') {
      const task = Task.parse({ ...res2.content, id: activity?.id })
      await addTask(task)
      setTasks(tasks => [...tasks, task])
      addedTasks.current.push(task)

      setTimeout(async () => {
        if (document !== undefined) {
          const added = document.getElementById(task.taskId)
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
    } else if (res2.type === 'generate-assignment') {
      setAssignments(assignments => [
        ...assignments,
        Assignment.parse({ ...res2.content, id: activity?.id })
      ])
    }
  }

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
          const index =
            activity?.sections?.findIndex(
              s =>
                s.type === content.section.type &&
                s.name === content.section.name
            ) ?? -1

          if (index !== -1) {
            const newSections = [...(activity?.sections || [])]
            newSections[index] = newSection
            setActivity(activity => {
              return {
                ...activity,
                sections: newSections
              }
            })
          } else {
            setActivity(activity => {
              return {
                ...activity,
                sections: [...(activity?.sections || []), newSection]
              }
            })
          }

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

      let res2: GTaskAndAssignmentGroup

      _res = await generateTask(activity, tasks, additionalInfo)

      if (document !== undefined) {
        document.getElementById('assignments')?.scrollIntoView({
          behavior: 'smooth'
        })
      }

      res2 = JSON.parse(_res) as GTaskAndAssignmentGroup

      await handleTaskAndAssignment(res2)

      while (!res2.end) {
        _res = await continueGenerateTask()
        res2 = JSON.parse(_res) as GTaskAndAssignmentGroup

        await handleTaskAndAssignment(res2)
      }

      _res = await generateAssignment(
        team,
        [...tasks, ...addedTasks.current],
        assignments,
        additionalInfo
      )
      console.log(_res)
      res2 = JSON.parse(_res) as GTaskAndAssignmentGroup
      await handleTaskAndAssignment(res2)

      while (!res2.end) {
        _res = await continueGenerateAssignment()
        console.log(_res)
        res2 = JSON.parse(_res) as GTaskAndAssignmentGroup

        await handleTaskAndAssignment(res2)
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

    addedTasks.current.forEach(async task => {
      await deleteTask(task)
    })

    addedTasks.current = []
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
