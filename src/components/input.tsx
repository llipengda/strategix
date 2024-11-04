'use client'

import React, { type InputHTMLAttributes } from 'react'

export default function Input(params: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...params}
      className={`w-full px-3 py-2 mt-1 border outline-none border-input-bd rounded-md shadow-sm bg-input-bg ring ring-transparent focus:ring-input-ring focus:border-transparent ${params.disabled ? 'cursor-not-allowed text-gray-400 dark:text-gray-500' : 'text-input-txt'} ${params.className}`}
    />
  )
}
