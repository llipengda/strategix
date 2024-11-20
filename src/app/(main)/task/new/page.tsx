import TaskTemplateForm from '@/app/(main)/task/new/task-template-form'
import { getTaskTemplateById } from '@/lib/actions/task'

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams

  const id = searchParams?.id

  const template = id ? await getTaskTemplateById(id) : null

  return (
    <div>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6'>
        创建任务模板
      </h1>
      <TaskTemplateForm template={template} />
    </div>
  )
}
