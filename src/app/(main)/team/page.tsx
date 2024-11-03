import { Fragment } from 'react'

import AddTeamForm from '@/app/(main)/team/add-team-form'
import Team from '@/app/(main)/team/team'
import { auth } from '@/auth'
import { getAllTeams, getTeam } from '@/lib/actions/team'
import { role } from '@/types/user'

const Page = async () => {
  const user = (await auth())?.user

  if (!user) {
    return
  }

  if (role.superAdmin(user)) {
    const allTeams = await getAllTeams()

    return (
      <>
        <div>
          {allTeams.map(team => (
            <Fragment key={team.teamName}>
              <Team key={team.teamName} team={team} />
              <div
                key={team.teamName}
                className='border-b my-10 border-gray-500'
              />
            </Fragment>
          ))}
        </div>
        <div>
          <h2 className='text-title text-2xl font-bold'>创建新团队</h2>
          <AddTeamForm />
        </div>
      </>
    )
  }

  const team = await getTeam()

  if (!team) {
    return <div>您不在任何团队中</div>
  }

  return <Team team={team} />
}

export default Page
