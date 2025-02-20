<template>
  <main class="container bg-light py-4 h-100">
    <tasks-table :actionCol="removeTask" :readOnly="true" />
  </main>
</template>

<script>
import TasksTable from '@/components/tasks/TasksTable.vue'
import useTaskStore from '@/stores/tasks'
import useToastStore from '@/stores/toast'

export default {
  name: 'HomePage',
  components: { TasksTable },

  setup() {
    const taskStore = useTaskStore()
    const toastStore = useToastStore()

    const removeTask = (id) => {
      taskStore.removeTask(id)
      toastStore.showToast('Tâche supprimée avec succès', 'success')
    }

    return { removeTask }
  },
}
</script>

<style>
@media (max-width: 992px) {
  .container {
    padding: 0px !important;
  }
}
</style>
