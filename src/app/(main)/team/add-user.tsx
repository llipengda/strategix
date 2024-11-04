import Select from '@/components/select'
import SelectArrow from '@/components/select-arrow'
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
      <div className='relative inline-block max-w-64 max-md:w-full max-md:max-w-full'>
        <label className='hidden' htmlFor='user'>
          选择用户
        </label>
        <Select id='user' name='user' disabled={disabled}>
          <option value=''>请选择</option>
          {usersToAdd.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}({user.email})
            </option>
          ))}
        </Select>
        <SelectArrow />
      </div>
      <div className='relative inline-block max-w-32 max-md:w-full max-md:max-w-full'>
        <label className='hidden' htmlFor='role'>
          选择角色
        </label>
        <Select id='role' name='role' disabled={disabled}>
          <option value='user'>普通成员</option>
          <option value='manager'>管理员</option>
        </Select>
        <SelectArrow />
      </div>
      <SubmitButton
        className='px-8 w-auto md:w-fit'
        text='添加成员'
        disabled={disabled}
      />
      {disabled && (
        <div className='text-gray-400 italic md:ml-2 max-md:text-center'>
          没有可添加的成员
        </div>
      )}
    </form>
  )
}

export default AddUser
