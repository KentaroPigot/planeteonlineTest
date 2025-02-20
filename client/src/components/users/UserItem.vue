<template>
  <tr :class="{ selected: isSelected }" class="table-row align-middle" @click="onRowClick">
    <td>{{ user.firstname }}</td>
    <td class="text-center">{{ totalDuration }}</td>
    <td class="text-center">{{ userTasks.length }}</td>
  </tr>
</template>

<script>
import { computed } from 'vue'
import useUserStore from '@/stores/user'
import { floatToTime } from '@/utils/dateUtils'

export default {
  name: 'UserItem',
  props: {
    user: { type: Object, required: true },
    onClick: { type: Function, default: null },
  },
  setup(props) {
    const userStore = useUserStore()

    const userTasks = computed(() => userStore.tasksByUserId(props.user.id))
    const totalDuration = computed(() => {
      return floatToTime(userTasks.value.reduce((acc, task) => acc + task.duration, 0))
    })
    const isSelected = computed(() => userStore.selectedUserId === props.user.id)

    const onRowClick = () => {
      if (props.onClick) props.onClick(props.user.id)
    }

    return {
      userTasks,
      totalDuration,
      isSelected,
      onRowClick,
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

.table-row.selected > * {
  background-color: #007bff !important;
  color: white !important;
}
</style>
