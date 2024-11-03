import type { User } from '@/types/user'

export type Team = {
  teamName: string
  members: {
    id: string
    name: string
    role: User['role']
  }[]
}
