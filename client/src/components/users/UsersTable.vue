<template>
  <users-table
    :items="users"
    :columns="columns"
    :style="{
      '--user-col-width': '40%',
      '--duration-col-width': '30%',
      '--tasks-col-width': '30%',
    }"
  >
    <template #rows="{ items }">
      <user-item v-for="user in items" :key="user.id" :user="user" :onClick="selectEmployee" />
    </template>
  </users-table>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import useTaskStore from '@/stores/tasks'
import useUserStore from '@/stores/user'
import UserItem from './UserItem.vue'
import UsersTable from '../shared/Table.vue'

export default {
  name: 'UsersTableComponent',
  components: { UsersTable, UserItem },
  setup() {
    const taskStore = useTaskStore()
    const userStore = useUserStore()

    const columns = ref([
      { key: 'user', label: 'User', sortable: false },
      { key: 'durée', label: 'Durée', sortable: false },
      { key: 'nb', label: 'Nb', sortable: false },
    ])

    const users = computed(() => userStore.users)
    const tasks = computed(() => taskStore.tasks)

    const selectEmployee = (id) => {
      userStore.selectUser(id)
    }

    onMounted(() => {
      if (users.value.length === 0) {
        userStore.loadUsers()
      }
    })

    onBeforeUnmount(() => {
      userStore.selectUser(null)
    })

    return {
      columns,
      users,
      tasks,
      selectEmployee,
    }
  },
}
</script>

<style scoped>
/* Définition des largeurs de colonnes */
th:nth-child(1) {
  width: var(--user-col-width) !important;
}
th:nth-child(2) {
  width: var(--duration-col-width) !important;
}
th:nth-child(3) {
  width: var(--tasks-col-width) !important;
}
</style>
