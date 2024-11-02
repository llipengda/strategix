import AddUser from '@/app/(main)/team/add-user'
import DeleteUser from '@/app/(main)/team/delete-user'
import { auth } from '@/auth'
import { getTeam } from '@/lib/actions/team'
import { role } from '@/types/user'

const Page = async () => {
  const user = (await auth())?.user

  if (!user) {
    return
  }

  const team = await getTeam()

  if (!team) {
    return <div>您不在任何团队中</div>
  }

  return (
    <div>
      <h1 className='text-2xl'>
        所在团队：<b>{team.teamName}</b>
      </h1>
      <ul className='mt-5 w-full'>
        {team.members.map(member => (
          <li
            key={member.id}
            className='flex items-center border-b p-2 justify-between relative min-h-14'
          >
            <span>{member.name}</span>
            {role.manager(member) && (
              <span
                className={`px-3 py-1 text-white rounded-full mr-8 ${
                  member.role === 'admin'
                    ? 'bg-red-500 dark:bg-red-600'
                    : 'bg-blue-500 dark:bg-blue-600'
                }`}
              >
                {member.role === 'admin' ? '负责人' : '管理员'}
              </span>
            )}
            {member?.role !== 'admin' && role.admin(user) && (
              <DeleteUser userId={member.id} />
            )}
          </li>
        ))}
      </ul>
      {user?.role === 'admin' && <AddUser teamName={team.teamName} />}
    </div>
  )
}

export default Page
