import type { JSX } from 'react'

const Select = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select
      className={`className='block appearance-none w-full bg-white dark:bg-gray-900 border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline ${props.className}`}
      {...props}
    >
      {props.children}
    </select>
  )
}

export default Select
