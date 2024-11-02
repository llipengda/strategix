import SubmitButton from '@/components/submit-button'
import { addUserToTeamAction, getUsersWithoutTeam } from '@/lib/actions/team'

const AddUser = async ({ teamName }: { teamName: string }) => {
  const usersToAdd = await getUsersWithoutTeam()

  const disabled = usersToAdd.length === 0

  return (
    <form
      className='flex gap-2 md:items-center mt-5 md:flex-row flex-col'
      action={addUserToTeamAction.bind(null, teamName)}
    >
      <div className='relative inline-block w-64 max-md:w-full'>
        <label className='hidden' htmlFor='user'>
          选择用户
        </label>
        <select
          id='user'
          name='user'
          className='block appearance-none w-full bg-white dark:bg-gray-900 border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline'
          disabled={disabled}
        >
          <option value=''>请选择</option>
          {usersToAdd.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}({user.email})
            </option>
          ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
          <svg className='fill-current h-4 w-4' viewBox='0 0 20 20'>
            <path d='M7 7l3 3 3-3 1.41 1.41L10 12 5.59 8.41z' />
          </svg>
        </div>
      </div>
      <div className='relative inline-block w-32 max-md:w-full'>
        <label className='hidden' htmlFor='role'>
          选择角色
        </label>
        <select
          id='role'
          name='role'
          className='block appearance-none w-full bg-white dark:bg-gray-900 border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline'
          disabled={disabled}
        >
          <option value='user'>普通成员</option>
          <option value='manager'>管理员</option>
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
          <svg className='fill-current h-4 w-4' viewBox='0 0 20 20'>
            <path d='M7 7l3 3 3-3 1.41 1.41L10 12 5.59 8.41z' />
          </svg>
        </div>
      </div>
      <SubmitButton className='w-auto' text='添加成员' disabled={disabled} />
      {disabled && (
        <div className='text-gray-400 italic md:ml-2 max-md:text-center'>
          没有可添加的成员
        </div>
      )}
    </form>
  )
}

export default AddUser
