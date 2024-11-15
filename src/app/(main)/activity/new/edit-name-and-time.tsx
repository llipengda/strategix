'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { GoArrowSwitch } from 'react-icons/go'

import { KeyContext } from '@/app/(main)/activity/new/key-context'
import ErrorMessage from '@/components/error-message'
import {
  addNewDraftActivityAction,
  updateActivityAction
} from '@/lib/actions/activity'
import sleep from '@/lib/sleep'
import { local, localDate, localFormat } from '@/lib/time'

interface EditNameAndTimeProps {
  preValues?: readonly [string, string | readonly [string, string]]
}

const EditNameAndTime: React.FC<EditNameAndTimeProps> = ({
  preValues = ['', '']
}) => {
  const preIsTimeRange = Array.isArray(preValues?.[1])
  const preTime = preIsTimeRange
    ? undefined
    : preValues?.[1]
      ? local(preValues[1] as string)
      : undefined
  const preStartTime = preIsTimeRange
    ? local(preValues[1][0] as string)
    : undefined
  const preEndTime = preIsTimeRange
    ? local(preValues[1][1] as string)
    : undefined

  const { key, setKey } = use(KeyContext)

  const [name, setName] = useState(preValues[0])
  const [time, setTime] = useState<Date | undefined>(preTime)
  const [saveTime, setSaveTime] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTimeRange, setIsTimeRange] = useState(preIsTimeRange)
  const [startTime, setStartTime] = useState<Date | undefined>(preStartTime)
  const [endTime, setEndTime] = useState<Date | undefined>(preEndTime)

  const [error, setError] = useState<string | undefined>()

  const dataRef = useRef<{
    name: string
    time: string | undefined
    timeRange: readonly [string, string] | undefined
  } | null>(null)

  const handleTimeRange = () => {
    setIsTimeRange(prev => !prev)
  }

  const save = useCallback(async () => {
    if (key) {
      const data = {
        name,
        time: isTimeRange ? undefined : time?.toISOString(),
        timeRange: isTimeRange
          ? ([startTime!.toISOString(), endTime!.toISOString()] as const)
          : undefined
      }
      if (JSON.stringify(dataRef.current) === JSON.stringify(data)) {
        await sleep(200)
        return
      }
      await updateActivityAction(key, data)
      dataRef.current = data
    } else {
      if (isTimeRange && (!startTime || !endTime)) {
        setError('时间范围不能为空')
        return
      }
      const res = await addNewDraftActivityAction(
        name,
        isTimeRange ? { timeRange: [startTime!, endTime!] } : { time: time }
      )
      if (res?.error) {
        setError(res.error)
      }
      if (res?.key) {
        setKey(res.key)
      }
      dataRef.current = {
        name,
        time: isTimeRange ? undefined : time?.toISOString(),
        timeRange: isTimeRange
          ? ([startTime!.toISOString(), endTime!.toISOString()] as const)
          : undefined
      }
    }
  }, [key, name, isTimeRange, time, startTime, endTime, setKey])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await save()
    setIsSaving(false)
    setSaveTime(localDate())
  }, [save])

  const handleSaveRef = useRef(handleSave)

  useEffect(() => {
    handleSaveRef.current = handleSave
  }, [handleSave])

  useEffect(() => {
    const timer = setInterval(async () => {
      await handleSaveRef.current()
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`space-y-2 rounded-lg p-4 bg-white border-2 border-gray-300 ${
        !!saveTime ? '' : 'border-dashed'
      }`}
    >
      <h2 className='text-2xl font-bold'>
        活动名称
        <span className='text-red-500'> *</span>
      </h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        className='w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8'
        placeholder='输入内容...'
      />
      <hr className='border-gray-300 !my-8' />
      <h2 className='text-2xl font-bold'>
        活动时间
        <span className='text-red-500'> *</span>
      </h2>
      {!isTimeRange ? (
        <input
          type='datetime-local'
          value={time ? localFormat(time, 'yyyy-MM-dd HH:mm') : ''}
          onChange={e => setTime(local(e.target.value))}
          className='border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8 w-min'
        />
      ) : (
        <div className='flex items-center gap-2'>
          <span>自</span>
          <input
            type='datetime-local'
            className='border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8 w-min'
            value={startTime ? localFormat(startTime, 'yyyy-MM-dd HH:mm') : ''}
            onChange={e => setStartTime(local(e.target.value))}
          />
          <span>至</span>
          <input
            type='datetime-local'
            className='border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8 w-min'
            value={endTime ? localFormat(endTime, 'yyyy-MM-dd HH:mm') : ''}
            onChange={e => setEndTime(local(e.target.value))}
          />
        </div>
      )}
      <button
        className='text-gray-500 text-sm flex items-center gap-1 hover:bg-gray-100 rounded-md p-1.5 border border-gray-300 shadow-sm'
        disabled={isSaving}
        onClick={handleTimeRange}
      >
        <GoArrowSwitch />
        {!isTimeRange ? '时间范围' : '时间'}
      </button>
      <hr className='border-gray-300 !mt-8' />
      <ErrorMessage defaultHeight={false} errorMessage={error} />
      <div className='flex justify-between items-center'>
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

export default EditNameAndTime
