import AddUser from '@/app/(main)/team/add-user'
import DeleteUser from '@/app/(main)/team/delete-user'
import { auth } from '@/auth'
import type { Team as TTeam } from '@/types/team'
import { role } from '@/types/user'

export default async function Team({ team }: { team: TTeam }) {
  const user = (await auth())?.user

  const superAdmin = role.superAdmin(user)

  return (
    <div>
      <h1 className='text-2xl'>
        {!superAdmin && '所在'}团队：<b>{team.teamName}</b>
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
            {role.admin(user) && (
              <DeleteUser
                userId={member.id}
                canNotDel={!role.superAdmin(user) && role.admin(member)}
              />
            )}
          </li>
        ))}
      </ul>
      {role.admin(user) && <AddUser teamName={team.teamName} />}
    </div>
  )
}
