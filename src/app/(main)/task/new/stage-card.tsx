'use client'

import { useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import type { MDXEditorMethods } from '@mdxeditor/editor'

import MdEditorFallback from '@/components/md-editor-fallback'
import ToggleButtonGroup from '@/components/toggle-button-group'

const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <MdEditorFallback />
})

export type Stage = {
  id: string
  name: string
  approval: 'none' | 'manager' | 'admin' | 'super-admin'
  content: string
}

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

export default function StageCard({
  stage,
  onUpdate,
  onDelete
}: {
  stage: Stage
  onUpdate: (stage: Stage) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState(stage.name)
  const [content, setContent] = useState(stage.content)
  const [approval, setApproval] = useState(stage.approval)

  const editorRef = useRef<MDXEditorMethods>(null)

  const handleSave = () => {
    onUpdate({ ...stage, name, approval })
  }

  const handleContentChange = (markdown: string) => {
    setContent(markdown)
    editorRef.current?.setMarkdown(markdown)
  }

  return (
    <div className='border rounded-lg p-4 shadow-sm bg-gray-100'>
      <div className='space-y-4'>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className='w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8'
          placeholder='输入标题...'
        />

        <MarkdownEditor
          markdown={content}
          onChange={handleContentChange}
          editorRef={editorRef}
        />
        <ToggleButtonGroup
          options={approvalOptions}
          value={approvalMap[approval]}
          onChange={v => setApproval(approvalMapReverse[v])}
        />
      </div>
      <div className='mt-4 flex gap-2'>
        <button
          type='button'
          onClick={handleSave}
          className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700'
        >
          保存
        </button>
        <button
          type='button'
          onClick={() => onDelete(stage.id)}
          className='px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md shadow hover:bg-red-700'
        >
          删除
        </button>
      </div>
    </div>
  )
}
