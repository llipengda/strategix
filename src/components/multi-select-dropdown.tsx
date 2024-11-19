'use client'

import React, { useState } from 'react'

interface MultiSelectDropdownProps {
  options: string[]
  value: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择...',
  multiple = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(prev => !prev)
    }
  }

  const handleOptionClick = (option: string) => {
    if (disabled) return

    if (multiple) {
      const newValue = value.includes(option)
        ? value.filter(item => item !== option)
        : [...value, option]
      onChange(newValue)
    } else {
      onChange([option])
      setIsOpen(false)
    }
  }

  const isSelected = (option: string) => value.includes(option)

  return (
    <div className='relative max-w-52'>
      {/* Dropdown Button */}
      <button
        className={`w-full px-4 py-2 border rounded-md text-left flex justify-between items-center ${
          disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 cursor-pointer'
        }`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span>{value.length > 0 ? value.join(', ') : placeholder}</span>
        <svg
          className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className='absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto'>
          <ul>
            {options.map(option => (
              <li
                key={option}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                  isSelected(option)
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
                {isSelected(option) && (
                  <svg
                    className='w-4 h-4 ml-2'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
