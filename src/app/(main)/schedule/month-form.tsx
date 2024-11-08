'use client'

import { useState } from 'react'

import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'

const MonthForm = ({ year, month }: { year: number; month: number }) => {
  const [_year, setYear] = useState(year)
  const [_month, setMonth] = useState(month)
  return (
    <form method='get' className='flex gap-2 *:max-w-28'>
      <Input
        type='number'
        name='year'
        value={_year}
        onChange={e => setYear(Math.max(1970, parseInt(e.target.value)))}
      />
      <label className='flex items-center h-full text-xl' htmlFor='year'>
        年
      </label>
      <Input
        type='number'
        name='month'
        value={_month}
        onChange={e =>
          setMonth(Math.min(Math.max(1, parseInt(e.target.value)), 12))
        }
      />
      <label className='flex items-center h-full text-xl' htmlFor='month'>
        月
      </label>
      <SubmitButton text='切换' className='w-fit' />
    </form>
  )
}
export default MonthForm
