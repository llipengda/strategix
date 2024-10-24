'use client'

import React, { type InputHTMLAttributes } from 'react'

export default function Input(params: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...params}
      className={`w-full px-3 py-2 mt-1 border outline-none focus:ring border-input-bd rounded-md shadow-sm bg-input-bg text-input-txt focus:ring-input-ring focus:border-none ${params.className}`}
    />
  )
}
