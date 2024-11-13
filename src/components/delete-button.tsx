import { MdDeleteForever } from "react-icons/md"

export const DeleteButton = () => {
    return (
        <button type='submit'
            className='flex items-center absolute bottom-0 right-0 px-2 py-1 rounded-tl-lg rounded-br-lg bg-red-500 text-white cursor-pointer hover:bg-red-600 text-sm' >
            <MdDeleteForever className='text-xl' />
            删除
        </button>
    )
}