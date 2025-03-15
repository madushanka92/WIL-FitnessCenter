<template>
  <div>
    <div class="d-flex mb-4">
      <v-text-field v-model="searchQuery" label="Search Users" class="mr-4" />
      <v-select
        v-model="selectedRole"
        :items="roleOptions"
        label="Filter by Role"
        class="role-filter"
      />
    </div>

    <v-data-table :headers="headers" :items="filteredUsers">
      <template v-slot:item.actions="{ item }">
        <v-icon @click="$emit('reset', item)" class="mr-2">mdi-lock-reset</v-icon>
        <v-icon @click="$emit('delete', item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['delete', 'reset'])

const searchQuery = ref('')
const selectedRole = ref('All')

const roleOptions = ['All', 'Member', 'Trainer']

const headers = [
  { title: 'First Name', key: 'first_name' },
  { title: 'Last Name', key: 'last_name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone_number' },
  { title: 'Role', key: 'role_name' },
  { title: 'Actions', key: 'actions', align: 'end' as 'end', sortable: false },
]

const filteredUsers = computed(() => {
  return props.users.filter((user: any) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesRole =
      selectedRole.value === 'All' ||
      user.role_name.toLowerCase() === selectedRole.value.toLowerCase()

    return matchesSearch && matchesRole
  })
})
</script>
