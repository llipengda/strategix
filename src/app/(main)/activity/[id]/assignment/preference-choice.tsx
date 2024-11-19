'use client'

import { useEffect, useState } from 'react'

import { useChannel } from 'ably/react'

import ErrorMessage from '@/components/error-message'
import MultiSelectDropdown from '@/components/multi-select-dropdown'
import {
  addPreferenceAction,
  deleteMyPreferences,
  getGroupedPreferences,
  getMyPreferences
} from '@/lib/actions/activity'
import { type TasksByUser } from '@/lib/task-process'
import { Preference } from '@/types/activity/preference'

interface PreferenceChoiceProps {
  activityId: string
  userId: string
  tasksByUser: TasksByUser
}

const PreferenceChoice = ({
  activityId,
  userId,
  tasksByUser
}: PreferenceChoiceProps) => {
  const { channel } = useChannel(`activity-${activityId}`, message => {
    if (message.name === 'submit-preference') {
      setForceUpdate(prev => prev + 1)
    }
  })

  const _fakeAssignments = Object.entries(tasksByUser).filter(
    ([_, data]) => data.isFake
  )

  const fakeAssignments = _fakeAssignments.reduce(
    (acc, [userName, data]) => {
      acc[userName] = data
      return acc
    },
    {} as Record<string, (typeof _fakeAssignments)[number][1]>
  )

  const choiceLength = Math.min(3, Object.keys(fakeAssignments).length)

  const [canBeSelected, setCanBeSelected] = useState(fakeAssignments)

  const [remaining, setRemaining] = useState(100)

  const [selected, setSelected] = useState<string[]>(
    Array(choiceLength).fill('')
  )
  const [preference, setPreference] = useState<(number | string)[]>(
    Array(choiceLength).fill(0)
  )
  const [haveBeenSelectedCnt, setHaveBeenSelectedCnt] = useState<
    Record<string, number>
  >({})

  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    void getGroupedPreferences(activityId).then(res => {
      setHaveBeenSelectedCnt(res)
    })
    void getMyPreferences(activityId).then(res => {
      let totalPreference = 0
      console.log(res)
      res.forEach((p, index) => {
        totalPreference += p.preference
        setSelected(prev => {
          const newSelected = [...prev]
          newSelected[index] = p.fakeAssignment
          return newSelected
        })
        setPreference(prev => {
          const newPreference = [...prev]
          newPreference[index] = p.preference
          return newPreference
        })
        setCanBeSelected(prev => {
          const newCanBeSelected = { ...prev }
          delete newCanBeSelected[p.fakeAssignment]
          return newCanBeSelected
        })
      })
      setRemaining(100 - totalPreference)
    })
  }, [activityId, forceUpdate])

  const handleSelect = (index: number, value: string) => {
    setSelected(prev => {
      const newSelected = [...prev]
      newSelected[index] = value
      return newSelected
    })
    if (selected[index]) {
      setCanBeSelected(prev => {
        const newCanBeSelected = { ...prev }
        newCanBeSelected[selected[index]] = fakeAssignments[selected[index]]
        return newCanBeSelected
      })
    }
    setCanBeSelected(prev => {
      const newCanBeSelected = { ...prev }
      delete newCanBeSelected[value]
      return newCanBeSelected
    })
  }

  const handlePreference = (index: number, value: number | string) => {
    setError(undefined)
    if (selected[index] === '') {
      setError('请先选择分配再设置意愿值')
      return
    }
    let valueNumber = Number(value)
    let delta = valueNumber - Number(preference[index])
    if (delta > remaining) {
      valueNumber = remaining + Number(preference[index])
      delta = remaining
    }
    setPreference(prev => {
      const newPreference = [...prev]
      newPreference[index] = value === '' ? '' : valueNumber
      return newPreference
    })
    setRemaining(prev => prev - delta)
  }

  const handleReset = (index: number) => {
    setSelected(prev => {
      const newSelected = [...prev]
      newSelected[index] = ''
      return newSelected
    })
    setPreference(prev => {
      const newPreference = [...prev]
      newPreference[index] = 0
      return newPreference
    })
    setRemaining(prev => prev + Number(preference[index]))
    setCanBeSelected(prev => {
      const newCanBeSelected = { ...prev }
      newCanBeSelected[selected[index]] = fakeAssignments[selected[index]]
      return newCanBeSelected
    })
  }

  const handleSubmit = async () => {
    setError(undefined)
    const preferences = selected
      .map((_, index) => ({
        fakeAssignment: selected[index],
        preference: Number(preference[index])
      }))
      .filter(p => !!p.fakeAssignment)

    if (preferences.length < 1) {
      setError('至少选择一个任务')
      return
    }

    const pCount = preferences.reduce((acc, cur) => acc + cur.preference, 0)

    if (pCount > 100) {
      throw new Error('意愿值总和超过100')
    }

    setLoading(true)
    await deleteMyPreferences(activityId)
    await Promise.all(
      preferences.map(p =>
        addPreferenceAction(
          Preference.parse({
            ...p,
            id: activityId,
            userId: userId
          })
        )
      )
    )
    await channel?.publish('submit-preference', {
      userId
    })
    setLoading(false)
  }

  return (
    <div>
      <h2 className='text-xl font-bold mt-8'>选择分配</h2>
      <div className='text-gray-600 mt-2'>
        剩余意愿值：<span className='font-semibold'>{remaining}</span>
      </div>
      <div className='mt-4'>
        <table className='w-full text-left border-collapse rounded-lg'>
          <thead>
            <tr className='bg-blue-100 text-black'>
              <th className='py-4 px-6 font-semibold tracking-wider'>分配</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>任务</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>意愿值</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>已选</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>操作</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {Array.from({ length: choiceLength }).map((_, index) => (
              <tr key={index}>
                <td className='py-4 px-6 w-1/5'>
                  <MultiSelectDropdown
                    placeholder='选择分配...'
                    multiple={false}
                    options={Object.keys(canBeSelected)}
                    value={selected[index] ? [selected[index]] : []}
                    onChange={value => handleSelect(index, value[0])}
                  />
                </td>
                <td className='py-4 px-6 text-gray-600 w-1/5'>
                  {fakeAssignments[selected[index]]?.tasks.join('，') ??
                    '待选择...'}
                </td>
                <td className='py-4 px-6 text-gray-600 w-1/5'>
                  <input
                    type='number'
                    disabled={loading || selected[index] === ''}
                    min={0}
                    max={100}
                    className='w-16 px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500'
                    value={preference[index]}
                    onChange={e => handlePreference(index, e.target.value)}
                  />
                </td>
                <td className='py-4 px-6 w-1/5'>
                  {haveBeenSelectedCnt[selected[index]] ?? 0} / 1
                </td>
                <td className='py-4 px-6 w-1/5'>
                  <button
                    className='bg-red-500 text-white px-2 py-1 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500'
                    disabled={loading}
                    onClick={() => handleReset(index)}
                  >
                    重置
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4'>
        <ErrorMessage errorMessage={error} />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className='mt-4 w-full text-xl font-semibold bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500'
      >
        {loading ? '提交中...' : '提交选择'}
      </button>
    </div>
  )
}

export default PreferenceChoice
