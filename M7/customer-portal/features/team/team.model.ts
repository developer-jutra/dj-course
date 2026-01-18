import type { User, UserRole, Permission } from '~/features/auth/signin/signin.model'

export interface TeamMember extends User {
  // Additional team-specific properties can be added here
}

export interface InviteTeamMemberForm {
  email: string
  role: string
  permissions: string[]
}

export interface EditTeamMemberForm {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  permissions: string[]
  isActive: boolean
}

export interface AvailablePermission {
  value: string
  name: string
}

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  pendingInvites: number
}

export interface RemoveTeamMemberData {
  id: string
  name: string
  email: string
} 