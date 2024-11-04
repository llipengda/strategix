import { Fragment } from 'react'

import AddTeamForm from '@/app/(main)/team/add-team-form'
import Team from '@/app/(main)/team/team'
import { auth } from '@/auth'
import { getAllTeams, getTeam } from '@/lib/actions/team'
import { role } from '@/lib/role'

const Page = async () => {
  const user = (await auth())?.user

  if (!user) {
    return
  }

  if (role.superAdmin(user)) {
    const allTeams = await getAllTeams()

    return (
      <div className='flex gap-6 flex-auto max-xl:flex-col'>
        <div className='flex flex-col gap-6 xl:w-3/5 w-auto'>
          {allTeams.map(team => (
            <Team key={team.teamName} team={team} />
          ))}
        </div>
        <div className='bg-white dark:bg-black shadow-lg rounded-lg p-6 xl:max-w-fit h-fit'>
          <h2 className='text-title text-2xl font-bold'>创建新团队</h2>
          <AddTeamForm />
        </div>
      </div>
    )
  }

  const team = await getTeam()

  if (!team) {
    return (
      <>
        <div className='text-xl'>您不在任何团队中</div>
        <div className='mt-5'>请联系团队负责人以加入团队</div>
      </>
    )
  }

  return <Team team={team} />
}

export default Page
