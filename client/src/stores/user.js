import { fetchAllUsers } from '@/api/user'
import { defineStore } from 'pinia'
import useTaskStore from './tasks'

export default defineStore('userStore', {
  state: () => ({
    users: [],
    selectedUserId: null,
    loading: false,
    error: null,
    sortKey: 'name',
    sortOrder: 'asc',
  }),

  getters: {
    tasksByUserId: () => (userId) => {
      const taskStore = useTaskStore()
      return taskStore.tasks.filter((task) => task.assignedUser?.id === userId)
    },

    userTasks(state) {
      if (!state.selectedUserId) return []
      return this.tasksByUserId(state.selectedUserId)
    },
    sortedUsers() {
      return [...this.users].sort((a, b) => {
        const key = this.sort.key
        return a[key].localeCompare(b[key]) * (this.sort.order === 'asc' ? 1 : -1)
      })
    },
    selectedUser() {
      return this.users.find((user) => user.id === this.selectedUserId)
    },
  },

  actions: {
    selectUser(userId) {
      if (this.selectedUserId === userId) {
        this.selectedUserId = null
      } else {
        this.selectedUserId = userId
      }
      this.error = this.selectedUserId ? null : 'Aucun utilisateur sélectionné.'
    },

    setSort(key, order) {
      this.sortKey = key
      this.sortOrder = order
      this.loadUsers()
    },

    async loadUsers() {
      this.loading = true
      try {
        const response = await fetchAllUsers()
        this.users = response.data
      } catch (error) {
        // console.log(error)
        this.error = 'Erreur lors du chargement des utilisateurs.'
      } finally {
        this.loading = false
      }
    },
  },
})
