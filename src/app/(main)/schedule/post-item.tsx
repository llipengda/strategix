
const PostItem = ({
  title,
  teamName,
  color = 'bg-blue-500'
}:{
  title: string,
  teamName: string | undefined,
  color?: string
}) => {
  return (
    <div className={`flex justify-between p-2 ${color}`} >
      <div>{title}</div>
      <div className='bg-gray-300 p-0.5 rounded-md text-sm'>{teamName==undefined?'unknown':teamName}</div>
    </div>
  )
}

export default PostItem
