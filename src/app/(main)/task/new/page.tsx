import TaskForm from './task-form'

export default function Page() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold text-gray-800 mb-6'>创建任务</h1>
      <TaskForm />
    </div>
  )
}
