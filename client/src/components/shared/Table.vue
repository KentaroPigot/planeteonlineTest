<template>
  <div class="table-responsive h-100 shadow">
    <table class="table mb-0" style="table-layout: fixed">
      <thead class="sticky-top table-header">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width || 'auto' }"
            class="text-center align-middle fs-6 fs-md-5 p-2 p-md-3"
          >
            <div class="d-flex align-items-center justify-content-center">
              {{ column.label }}
              <button
                v-if="column.sortable"
                @click="$emit('sort', column.key)"
                class="btn btn-link btn-sm"
              >
                <i :class="getSortIcon(column.key)"></i>
              </button>
            </div>
          </th>
          <th v-if="hasActions" class="text-center align-middle">Actions</th>
        </tr>
      </thead>
      <tbody>
        <slot name="rows" :items="items"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    items: { type: Array, required: true },
    columns: { type: Array, required: true },
    sortKey: { type: String, default: null },
    sortOrder: { type: String, default: 'asc' },
    hasActions: { type: Boolean, default: false },
  },
  setup(props) {
    const getSortIcon = (key) => {
      if (props.sortKey === key) {
        return props.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
      }
      return 'fas fa-sort'
    }

    return { getSortIcon }
  },
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placeholder {
  min-height: 24px;
  display: inline-block;
}
</style>
