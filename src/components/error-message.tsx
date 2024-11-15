import { MdError } from 'react-icons/md'

export default function ErrorMessage({
  errorMessage,
  defaultHeight = true
}: {
  errorMessage?: string
  defaultHeight?: boolean
}) {
  if (!errorMessage) {
    return defaultHeight ? <div className='h-3' /> : null
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
