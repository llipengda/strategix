import { MdAdd } from 'react-icons/md'

interface AddProps {
  onClick: () => void
}

const Add: React.FC<AddProps> = ({ onClick }) => {
  return (
    <div
      className='space-y-2 rounded-lg p-4 bg-white border-dashed border-2 border-gray-300 flex justify-center items-center text-gray-400 text-4xl hover:text-blue-500 hover:border-blue-500 transition-colors duration-200 cursor-pointer'
      onClick={onClick}
    >
      <MdAdd />
    </div>
  )
}

export default Add
