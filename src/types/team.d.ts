import type { User } from '@/types/role'

export type Team = {
  teamName: string
  members: {
    id: string
    name: string
    role: User['role']
  }[]
}
