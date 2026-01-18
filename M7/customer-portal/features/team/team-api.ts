import { ref, readonly, onMounted } from 'vue'
import type { User } from '~/features/auth/signin/signin.model'
import type { InviteTeamMemberForm, EditTeamMemberForm, AvailablePermission } from './team.model'
import { mockTeamMembers, mockAvailablePermissions } from './team.mocks'

export async function getTeamMembers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockTeamMembers
}

export async function getAvailablePermissions(): Promise<AvailablePermission[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockAvailablePermissions
}

export async function inviteTeamMember(inviteData: InviteTeamMemberForm): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Sending invitation to:', inviteData.email)
  return {
    success: true,
    message: 'Invitation sent successfully!'
  }
}

export async function updateTeamMember(memberData: EditTeamMemberForm): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  console.log('Updating team member:', memberData)
  return {
    success: true,
    message: 'Team member updated successfully!'
  }
}

export async function removeTeamMember(memberId: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  console.log('Removing team member:', memberId)
  return {
    success: true,
    message: 'Team member removed successfully!'
  }
}

// Team composables
export function useTeamManagement() {
  const teamMembersData = ref<User[]>([])
  const availablePermissionsData = ref<AvailablePermission[]>([])
  const isLoading = ref(false)
  const isError = ref(false)

  const fetchTeamMembers = async () => {
    try {
      teamMembersData.value = await getTeamMembers()
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchAvailablePermissions = async () => {
    try {
      availablePermissionsData.value = await getAvailablePermissions()
    } catch (error) {
      console.error('Error fetching available permissions:', error)
    }
  }

  const fetchAll = async () => {
    isLoading.value = true
    isError.value = false
    try {
      await Promise.all([
        fetchTeamMembers(),
        fetchAvailablePermissions()
      ])
    } catch (error) {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchAll()
  })

  const inviteTeamMemberAction = async (inviteData: any) => {
    try {
      await inviteTeamMember(inviteData)
      await fetchTeamMembers() // Refresh the list
    } catch (error) {
      console.error('Error inviting team member:', error)
    }
  }

  const removeTeamMemberAction = async (memberId: string) => {
    try {
      await removeTeamMember(memberId)
      await fetchTeamMembers() // Refresh the list
    } catch (error) {
      console.error('Error removing team member:', error)
    }
  }

  return {
    teamMembersQuery: {
      data: readonly(teamMembersData),
      isLoading: readonly(isLoading),
      isError: readonly(isError),
      refetch: fetchTeamMembers
    },
    availablePermissionsQuery: {
      data: readonly(availablePermissionsData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    inviteTeamMemberMutation: {
      mutateAsync: inviteTeamMemberAction,
      isPending: readonly(isLoading)
    },
    removeTeamMemberMutation: {
      mutate: removeTeamMemberAction,
      isPending: readonly(isLoading)
    }
  }
}

export async function getTeamMember(memberId: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockTeamMembers.find(member => member.id === memberId) || null
} 