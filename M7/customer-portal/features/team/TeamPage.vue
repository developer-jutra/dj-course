<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your company team members and their permissions
        </p>
      </div>
      <button
        @click="showInviteModal = true"
        class="btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Invite Member
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading team members...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Team
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        There was a problem loading your team members.
      </p>
      <button 
        @click="loadTeamData" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>

    <!-- Team Members List -->
    <TeamMembersList
      v-else
      :team-members="teamMembers"
      @edit="handleEditMember"
      @remove="handleRemoveMember"
    />

    <!-- Invite Member Modal -->
    <InviteTeamMember
      :show="showInviteModal"
      :available-permissions="availablePermissions"
      :loading="inviteLoading"
      @close="showInviteModal = false"
      @invite="handleInviteMember"
    />

    <!-- Edit Member Modal -->
    <EditTeamMember
      :show="showEditModal"
      :member="memberToEdit"
      :available-permissions="availablePermissions"
      :loading="updateLoading"
      @close="handleCloseEditModal"
      @update="handleUpdateMember"
    />

    <!-- Remove Confirmation Modal -->
    <ConfirmationModal
      :show="showRemoveModal"
      title="Remove Team Member"
      :message="`Are you sure you want to remove ${memberToRemove?.firstName} ${memberToRemove?.lastName} from the team? This action cannot be undone.`"
      confirm-text="Remove"
      confirm-button-style="danger"
      @close="showRemoveModal = false"
      @confirm="handleConfirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import TeamMembersList from './TeamMembersList.vue'
import InviteTeamMember from './InviteTeamMember.vue'
import EditTeamMember from './EditTeamMember.vue'
import ConfirmationModal from '~/components/ui-library/modals/ConfirmationModal.vue'
import { 
  getTeamMembers, 
  getAvailablePermissions, 
  inviteTeamMember, 
  updateTeamMember, 
  removeTeamMember 
} from './team-api'
import type { User } from '~/model/user'
import type { InviteTeamMemberForm, EditTeamMemberForm, AvailablePermission } from './team.model'

// State management
const teamMembers = ref<User[]>([])
const availablePermissions = ref<AvailablePermission[]>([])
const isLoading = ref(false)
const isError = ref(false)

// Modal states
const showInviteModal = ref(false)
const showEditModal = ref(false)
const showRemoveModal = ref(false)

// Loading states
const inviteLoading = ref(false)
const updateLoading = ref(false)

// Selected data
const memberToEdit = ref<User | null>(null)
const memberToRemove = ref<User | null>(null)

// Load team data
const loadTeamData = async () => {
  isLoading.value = true
  isError.value = false
  
  try {
    const results = await Promise.all([
      getTeamMembers(),
      getAvailablePermissions()
    ])
    
    teamMembers.value = results[0]
    availablePermissions.value = results[1]
  } catch (error) {
    isError.value = true
    console.error('Error fetching team data:', error)
  } finally {
    isLoading.value = false
  }
}

// Event handlers
const handleInviteMember = async (inviteData: InviteTeamMemberForm) => {
  inviteLoading.value = true
  
  try {
    await inviteTeamMember(inviteData)
    showInviteModal.value = false
    await loadTeamData() // Reload team data
  } catch (error) {
    console.error('Failed to send invitation:', error)
  } finally {
    inviteLoading.value = false
  }
}

const handleEditMember = (member: User) => {
  memberToEdit.value = member
  showEditModal.value = true
}

const handleCloseEditModal = () => {
  showEditModal.value = false
  memberToEdit.value = null
}

const handleUpdateMember = async (memberData: EditTeamMemberForm) => {
  updateLoading.value = true
  
  try {
    await updateTeamMember(memberData)
    showEditModal.value = false
    memberToEdit.value = null
    await loadTeamData() // Reload team data
  } catch (error) {
    console.error('Failed to update team member:', error)
  } finally {
    updateLoading.value = false
  }
}

const handleRemoveMember = (member: User) => {
  memberToRemove.value = member
  showRemoveModal.value = true
}

const handleConfirmRemove = async () => {
  if (!memberToRemove.value) return
  
  try {
    await removeTeamMember(memberToRemove.value.id)
    showRemoveModal.value = false
    memberToRemove.value = null
    await loadTeamData() // Reload team data
  } catch (error) {
    console.error('Failed to remove team member:', error)
  }
}

// Initialize data on component mount
onMounted(() => {
  loadTeamData()
})
</script>
