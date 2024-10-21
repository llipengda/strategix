import { MdError } from 'react-icons/md'

export default function ErrorMessage({
  errorMessage
}: {
  errorMessage?: string
}) {
  if (!errorMessage) {
    return <div className='h-3' />
  }

  return (
    <div className='text-sm text-white bg-red-600 p-2 rounded-md flex items-center font-bold'>
      <div className='text-xl'>
        <MdError />
      </div>
      &nbsp;{errorMessage}
    </div>
  )
}
