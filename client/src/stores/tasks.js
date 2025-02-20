import { defineStore } from 'pinia'
import { fetchAllTasks, createTask, updateTask, updateTaskAssignment, deleteTask } from '@/api/task'
import { dateToTime, timeToDate } from '@/utils/dateUtils'
import useUserStore from './user'
import qsh from '@/utils/queryStateHandler'

export default defineStore('taskStore', {
  state: () => ({
    tasks: [],
    sortKey: 'libelle',
    sortOrder: 'asc',
    loading: false,
    error: null,
    successMessage: '',
  }),

  actions: {
    clearNotifications() {
      this.error = null
      this.successMessage = null
    },

    async loadTasks() {
      await qsh(this, async () => {
        const response = await fetchAllTasks(this.sortKey, this.sortOrder)

        // Formater les date en HH:mm
        this.tasks = response.data.map((task) => ({
          ...task,
          startTime: dateToTime(new Date(task.startTime)),
          endTime: dateToTime(new Date(task.endTime)),
        }))
      })
    },

    async addTask(taskData) {
      await qsh(this, async () => {
        // Convertie HH:mm en date avat l'envoi
        const formattedTask = {
          ...taskData,
          startTime: timeToDate(taskData.startTime),
          endTime: timeToDate(taskData.endTime),
        }

        const response = await createTask(formattedTask)

        // Formate la réponse pour être affiché
        const newTask = {
          ...response.data,
          startTime: dateToTime(new Date(response.data.startTime)),
          endTime: dateToTime(new Date(response.data.endTime)),
        }

        this.tasks.push(newTask)
        this.successMessage = 'Tâche ajoutée avec succès'
      })
    },

    async modifyTask(id, updates) {
      await qsh(this, async () => {
        // Convertir HH:mm en Date avant la mise à jour
        const formattedUpdates = {
          ...updates,
          startTime: timeToDate(updates.startTime),
          endTime: timeToDate(updates.endTime),
        }

        await updateTask(id, formattedUpdates)

        // Recharger les tâches après mise à jour
        await this.loadTasks()
      })
    },

    async modifyTaskAssignment(taskId) {
      const userStore = useUserStore()
      await qsh(
        this,
        async ({ user, users }) => {
          const { data } = await updateTaskAssignment(user.id, taskId)
          const updatedTask = data.task

          const indexTask = this.tasks.findIndex((t) => t.id === updatedTask.id)
          if (indexTask !== -1) {
            // On recréer la tâche en y assignant le assignedUser manuellement
            const updatedTaskWithUser = {
              ...this.tasks[indexTask],
              assignedUser: updatedTask.assignedTo
                ? { id: user.id, firstname: user.firstname }
                : null, // On assigne ou désassigne le user à la tâche
            }

            // On remplace la tâche dans le tableau
            this.tasks.splice(indexTask, 1, updatedTaskWithUser)
          }

          // Mise à jour locale de l'utilisateur pour éviter le reload de tableUsers
          const indexUser = users.findIndex((u) => u.id === user.id)
          if (indexUser !== -1) {
            const updatedUserWithTask = {
              ...users[indexUser],
              tasks:
                updatedTask.action === 'assign'
                  ? [...users[indexUser].tasks, { id: taskId, duration: updatedTask.duration }]
                  : users[indexUser].tasks.filter((t) => t.id !== taskId),
            }
            users.splice(indexUser, 1, updatedUserWithTask)
          }
        },
        {
          user: () => userStore.selectedUser,
          users: () => userStore.users,
        },
      )
    },

    async removeTask(id) {
      await qsh(this, async () => {
        await deleteTask(id)
        this.tasks = this.tasks?.filter((task) => task.id !== id)
      })
    },

    // Assigne le sorting et reload les taches
    setSort(key, order) {
      this.sortKey = key
      this.sortOrder = order
      this.loadTasks()
    },
  },
})
