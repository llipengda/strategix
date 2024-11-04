import type { JSX } from 'react'

const Select = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select
      {...props}
      className={`block appearance-none w-full bg-input-bg border border-input-bd hover:border-transparent ring ring-transparent hover:ring-input-ring px-4 py-2.5 pr-8 leading-tight focus:outline-none focus:shadow-outline rounded-md ${props.disabled ? 'cursor-not-allowed hover:!ring-transparent hover:!border-input-bd' : ''} ${props.className}`}
    >
      {props.children}
    </select>
  )
}

export default Select
