'use client'

import React, { useState } from 'react'

type SingleToggleButtonGroupProps = {
  options: string[]
  value?: string
  onChange: (value: string) => void
  multiple?: false
}

type MultipleToggleButtonGroupProps = {
  options: string[]
  value?: string[]
  onChange: (value: string[]) => void
  multiple: true
}

type ToggleButtonGroupProps =
  | SingleToggleButtonGroupProps
  | MultipleToggleButtonGroupProps

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  value = [],
  onChange,
  multiple = false
}) => {
  const [selected, setSelected] = useState<string | string[]>(value)

  const handleToggle = (option: string) => {
    if (multiple) {
      const currentSelected = Array.isArray(selected) ? selected : []
      const newSelected = currentSelected.includes(option)
        ? currentSelected.filter(item => item !== option)
        : [...currentSelected, option]
      setSelected(newSelected)
      const change = onChange as MultipleToggleButtonGroupProps['onChange']
      change(newSelected)
    } else {
      setSelected(option)
      const change = onChange as SingleToggleButtonGroupProps['onChange']
      change(option)
    }
  }

  const isSelected = (option: string) =>
    multiple
      ? Array.isArray(selected) && selected.includes(option)
      : selected === option

  return (
    <div className='inline-flex rounded-md shadow-sm'>
      {options.map(option => (
        <button
          key={option}
          type='button'
          className={`px-4 py-2 text-sm font-medium border border-gray-300 transition-colors ${
            isSelected(option)
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } first:rounded-l-md last:rounded-r-md -ml-px focus:outline-none`}
          onClick={() => handleToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default ToggleButtonGroup
