import Input from '@/components/input'
import Select from '@/components/select'
import SelectArrow from '@/components/select-arrow'
import SubmitButton from '@/components/submit-button'
import { addTeamAction, getUsersWithoutTeam } from '@/lib/actions/team'

const AddTeamForm = async () => {
  const users = await getUsersWithoutTeam()

  const disabled = users.length === 0

  return (
    <form className='space-y-4 mt-5' action={addTeamAction}>
      <div className='flex flex-row gap-2 w-auto max-lg:flex-col items-center'>
        <label
          htmlFor='teamName'
          className='hidden text-sm font-medium text-label'
        >
          团队名称
        </label>
        <Input
          className='!w-64 max-lg:!w-full'
          id='teamName'
          name='teamName'
          placeholder='团队名称'
          disabled={disabled}
          required
        />
        <div className='relative inline-block w-64 max-lg:w-full'>
          <label htmlFor='user' className='hidden'>
            选择成员作为负责人
          </label>
          <Select id='user' name='user' disabled={disabled}>
            <option value=''>请选择负责人</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </Select>
          <SelectArrow />
        </div>
        <SubmitButton
          disabled={disabled}
          className='w-fit px-8 max-lg:w-full'
          text='创建团队'
        />
        {disabled && (
          <div className='text-gray-400 italic md:ml-2 max-md:text-center'>
            没有可用于创建团队的成员
          </div>
        )}
      </div>
    </form>
  )
}

export default AddTeamForm
