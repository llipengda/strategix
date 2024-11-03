const SelectArrow = () => {
  return (
    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
      <svg className='fill-current h-4 w-4' viewBox='0 0 20 20'>
        <path d='M7 7l3 3 3-3 1.41 1.41L10 12 5.59 8.41z' />
      </svg>
    </div>
  )
}

export default SelectArrow
