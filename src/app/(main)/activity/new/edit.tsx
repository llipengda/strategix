'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'

import dynamic from 'next/dynamic'

import { type MDXEditorMethods } from '@mdxeditor/editor'

import { KeyContext } from '@/app/(main)/activity/new/key-context'
import ErrorMessage from '@/components/error-message'
import MdEditorFallback from '@/components/md-editor-fallback'
import {
  addOrUpdateSectionAction,
  deleteSectionAction
} from '@/lib/actions/activity'
import { localDate, localFormat } from '@/lib/time'
import {
  Section,
  predefinedSections,
  sectionMap
} from '@/types/activity/activity'

const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <MdEditorFallback />
})

interface EditProps {
  id: string
  name: string
  type: string
  preValue?: string
  onDelete: (id: string) => void
}

const Edit: React.FC<EditProps> = ({
  id,
  type: _type,
  name,
  preValue = '',
  onDelete
}) => {
  const { key } = use(KeyContext)

  const [type, setType] = useState(_type)
  const [customName, setCustomName] = useState(name)

  const [value, setValue] = useState(preValue)
  const [saveTime, setSaveTime] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [error, setError] = useState<string>('')

  const isCustomTitle = type === 'custom'

  useEffect(() => {
    const timer = setInterval(async () => {
      await saveRef.current()
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const typeRef = useRef(type)
  const customNameRef = useRef(customName)
  const valueRef = useRef(value)

  const save = useCallback(async () => {
    if (!key) return

    if (
      typeRef.current === type &&
      customNameRef.current === customName &&
      valueRef.current === value
    ) {
      return
    }

    typeRef.current = type
    customNameRef.current = customName
    valueRef.current = value

    setError('')

    if (isCustomTitle && !customName) {
      setError('请输入标题')
      return
    }

    await addOrUpdateSectionAction(
      key,
      id,
      Section.parse({
        id,
        type,
        name: isCustomTitle ? customName : sectionMap.get(type),
        value
      })
    )
  }, [key, id, type, isCustomTitle, customName, value])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await save()
    setIsSaving(false)
    setSaveTime(localDate())
  }, [save])

  const saveRef = useRef(handleSave)

  useEffect(() => {
    saveRef.current = handleSave
  }, [handleSave])

  const editorRef = useRef<MDXEditorMethods>(null)

  const handleMarkdownChange = (markdown: string) => {
    editorRef.current?.setMarkdown(markdown)
    setValue(markdown)
  }

  const handleDelete = async () => {
    if (!key) return
    if (isDeleting) return
    setIsDeleting(true)
    await deleteSectionAction(key, id)
    onDelete(id)
    setIsDeleting(false)
  }

  return (
    <div
      className={`relative space-y-2 rounded-lg p-4 bg-white border-2 border-gray-300
        ${!!saveTime ? '' : 'border-dashed'}
        ${isDeleting ? 'opacity-50' : ''}`}
    >
      <button
        className='absolute top-4 right-4 bg-red-500 text-white rounded-lg text-xl p-1 disabled:bg-gray-300'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <MdDelete />
      </button>
      <div className='flex items-center gap-2'>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className='text-2xl font-bold bg-transparent p-1 border shadow-sm w-fit rounded-md border-gray-30 outline-none'
        >
          {predefinedSections.map(t => (
            <option key={t.type} value={t.type}>
              {t.name}
            </option>
          ))}
        </select>
        {isCustomTitle && (
          <input
            type='text'
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className='text-2xl font-bold border-b-2 pb-0.5 border-gray-300 focus:border-blue-500 outline-none ml-2'
            placeholder='输入标题...'
          />
        )}
      </div>
      <MarkdownEditor
        markdown={value}
        onChange={handleMarkdownChange}
        editorRef={editorRef}
      />
      <ErrorMessage errorMessage={error} defaultHeight={false} />
      <div className='flex justify-between items-center !mt-4'>
        <div>
          <button
            className={`text-white px-2 py-1 rounded-md text-sm ${isSaving ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
          <span className='text-gray-400 text-sm italic ml-2'>
            每30秒将进行一次自动保存
          </span>
        </div>
        {saveTime && (
          <span className='text-gray-500 text-sm'>
            保存于{localFormat(saveTime, 'HH:mm:ss')}
          </span>
        )}
      </div>
    </div>
  )
}

export default Edit
