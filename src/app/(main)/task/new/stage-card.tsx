'use client'

import { useRef } from 'react'
import { MdClose } from 'react-icons/md'

import dynamic from 'next/dynamic'

import type { MDXEditorMethods } from '@mdxeditor/editor'

import MdEditorFallback from '@/components/md-editor-fallback'
import ToggleButtonGroup from '@/components/toggle-button-group'
import type { Stage, TaskTemplateStage } from '@/types/activity/task'

const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <MdEditorFallback />
})

const approvalOptions = [
  '不需要审核',
  '需要管理员审核',
  '需要管理员和负责人审核',
  '需要管理员、负责人和超级管理员审核'
]

const approvalMap = {
  none: '不需要审核',
  manager: '需要管理员审核',
  admin: '需要管理员和负责人审核',
  'super-admin': '需要管理员、负责人和超级管理员审核'
}

const approvalMapReverse = Object.fromEntries(
  Object.entries(approvalMap).map(([key, value]) => [value, key])
) as Record<string, 'none' | 'manager' | 'admin' | 'super-admin'>
type StageCardProps =
  | {
      isTaskTemplate: false
      stage: Stage
      requiredPeople: number
      onUpdate: (stage: Stage) => void
      onDelete: (id: string) => void
    }
  | {
      isTaskTemplate: true
      requiredPeople: number
      stage: TaskTemplateStage
      onUpdate: (stage: TaskTemplateStage) => void
      onDelete: (id: string) => void
    }

export default function StageCard({
  stage,
  requiredPeople,
  onUpdate: onUpdate,
  onDelete
}: StageCardProps) {
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleContentChange = (markdown: string) => {
    editorRef.current?.setMarkdown(markdown)
    onUpdate({
      completed: false,
      ...stage,
      content: markdown
    })
  }

  return (
    <div className='border relative rounded-lg p-4 shadow-sm bg-gray-100 dark:bg-slate-800'>
      <button
        type='button'
        onClick={() => onDelete(stage.id)}
        className='absolute top-4 right-4 text-gray-500 hover:text-red-600'
      >
        <MdClose className='w-6 h-6' />
      </button>
      <div className='space-y-4'>
        <input
          value={stage.name}
          onChange={e =>
            onUpdate({ completed: false, ...stage, name: e.target.value })
          }
          className='w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8'
          placeholder='输入标题...'
        />

        <MarkdownEditor
          markdown={stage.content}
          onChange={handleContentChange}
          editorRef={editorRef}
        />
        <ToggleButtonGroup
          options={approvalOptions}
          value={approvalMap[stage.approval]}
          onChange={v =>
            onUpdate({
              completed: false,
              ...stage,
              approval: approvalMapReverse[v]
            })
          }
        />
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-500 dark:text-white'>分配给</span>
          <ToggleButtonGroup
            multiple
            options={Array.from({ length: requiredPeople }, (_, i) =>
              String.fromCharCode(65 + i)
            )}
            value={stage.assignedTo.map(i => String.fromCharCode(65 + i))}
            onChange={v =>
              onUpdate({
                completed: false,
                ...stage,
                assignedTo: v.map(c => c.charCodeAt(0) - 65)
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
