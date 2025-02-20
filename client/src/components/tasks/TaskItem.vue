<template>
  <tr
    class="table-row align-middle"
    @click="handleRowClick"
    :class="{ assigned: isAssigned, 'loading-state': loading }"
  >
    <td>{{ task.libelle }}</td>
    <td class="text-center">{{ task.startTime }}</td>
    <td class="text-center">{{ task.endTime }}</td>
    <td class="text-center">{{ task?.assignedUser?.firstname || 'Non assigné' }}</td>
    <td v-if="showActions" class="text-center">
      <button
        v-if="isAuthenticated"
        class="btn-action text-danger"
        @click.stop="actionClick"
        :disabled="loading"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </td>
  </tr>
</template>

<script>
import useUserStore from '@/stores/user'
import useTaskStore from '@/stores/tasks'
import useAuthStore from '@/stores/auth'
import useToastStore from '@/stores/toast'
import { computed } from 'vue'

export default {
  name: 'TaskItem',
  props: {
    task: { type: Object, required: true },
    showActions: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const taskStore = useTaskStore()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const toastStore = useToastStore()

    const isAssigned = computed(() => userStore.selectedUserId === props.task.assignedUser?.id)

    const modifyTaskAssignment = taskStore.modifyTaskAssignment

    const loading = computed(() => taskStore.loading)
    const error = computed(() => taskStore.error)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    const handleRowClick = async () => {
      if (props.readOnly || loading.value) return
      try {
        await taskStore.modifyTaskAssignment(props.task.id)
      } catch (_err) {
        console.log(_err)
        toastStore.showToast(error.value.message, 'danger')
      }
    }

    const actionClick = () => {
      emit('action-click', props.task.id)
    }

    return {
      loading,
      isAssigned,
      isAuthenticated,
      handleRowClick,
      actionClick,
      modifyTaskAssignment,
    }
  },
}
</script>

<style scoped>
.table-row {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.table-row:hover {
  background-color: #f1f3f5;
  transform: translateY(-2px);
}

.table-row td {
  padding: 12px;
  font-size: 0.85rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-row td:first-child {
  font-weight: 600;
}

.btn-action {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-action:hover {
  background-color: #f8d7da;
  color: #dc3545;
}

.text-danger {
  color: #dc3545;
}

.text-danger:hover {
  color: #b02a37;
}

.table-row.assigned td {
  background-color: #007bff !important;
  color: white !important;
}

.loading-state {
  pointer-events: none;
}
</style>
