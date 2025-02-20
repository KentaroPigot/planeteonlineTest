<template>
  <task-table
    :items="tasks"
    :columns="columns"
    :sortKey="sortKey"
    :sortOrder="sortOrder"
    :hasActions="!!actionCol && isAuthenticated"
    @sort="sortBy"
  >
    <template #rows="{ items }">
      <task-item
        v-for="task in items"
        :key="task.id"
        :task="task"
        :show-actions="!!actionCol && isAuthenticated"
        :read-only="readOnly"
        @action-click="actionCol"
      />
    </template>
  </task-table>
</template>

<script>
import TaskTable from '@/components/shared/Table.vue'
import TaskItem from '@/components/tasks/TaskItem.vue'
import useTaskStore from '@/stores/tasks'
import useAuthStore from '@/stores/auth'
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'TasksTableComponent',
  components: {
    TaskTable,
    TaskItem,
  },
  props: {
    actionCol: { type: Function, default: null },
    readOnly: { type: Boolean, default: false },
  },

  setup() {
    const taskStore = useTaskStore()
    const authStore = useAuthStore()

    const columns = ref([
      { key: 'libelle', label: 'Libelle', sortable: true },
      { key: 'startTime', label: 'Début', sortable: true },
      { key: 'endTime', label: 'Fin', sortable: true },
      { key: 'assignedTo', label: 'User', sortable: true },
    ])

    const tasks = computed(() => taskStore.tasks)
    const sortKey = computed(() => taskStore.sortKey)
    const sortOrder = computed(() => taskStore.sortOrder)
    const loading = computed(() => taskStore.loading)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    const tableSpan = computed(() =>
      isAuthenticated.value ? columns.value.length + 1 : columns.value.length,
    )

    const sortBy = (key) => {
      const newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'
      taskStore.setSort(key, newOrder)
    }

    onMounted(() => {
      taskStore.loadTasks()
    })

    return {
      columns,
      tasks,
      sortKey,
      sortOrder,
      loading,
      isAuthenticated,
      tableSpan,
      sortBy,
    }
  },
}
</script>

<style scoped>
th:nth-child(1) {
  width: var(--libelle-col-width) !important;
}
th:nth-child(2),
th:nth-child(3) {
  width: var(--time-col-width) !important;
}
th:nth-child(4) {
  width: var(--user-col-width) !important;
}
</style>
