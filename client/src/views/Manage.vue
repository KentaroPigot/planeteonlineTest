<template>
  <main class="container-fluid vh-100 d-flex flex-column flex-lg-row gap-3 p-3 bg-light">
    <div class="flex-lg-shrink-0 h-100" style="width: 300px; min-height: 300px">
      <users-table />
    </div>
    <div class="flex-grow-1 h-100 d-flex flex-column gap-3">
      <div class="flex-grow-0 bg-white rounded-3" style="min-height: 300px; max-height: 315px">
        <tasks-table />
      </div>
      <div class="flex-grow-1 bg-white rounded-3 position-relative">
        <user-calendar />
      </div>
    </div>
  </main>
</template>

<script>
import UsersTable from '@/components/users/UsersTable.vue'
import TasksTable from '@/components/tasks/TasksTable.vue'
import UserCalendar from '@/components/users/UserCalendar.vue'

export default {
  name: 'ManagePage',
  components: { TasksTable, UsersTable, UserCalendar },
}
</script>

<style scoped>
@media (max-width: 992px) {
  main {
    height: auto !important;
    min-height: 100vh;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .flex-lg-shrink-0 {
    width: 100% !important;
    height: auto !important;
  }
}
</style>
