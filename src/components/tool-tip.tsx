'use client'

import React, { useState } from 'react'

interface TooltipProps {
  message: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  children,
  className,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className={`relative inline-block w-fit ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {!disabled && isVisible && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg shadow-lg w-max max-w-full'>
          {message}
        </div>
      )}
    </div>
  )
}

export default Tooltip
