<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 mb-0">Créer une nouvelle tâche</h2>
      </div>
      <div class="card-body">
        <Form :validation-schema="newTaskSchema" @submit="addTask">
          <!-- Libellé -->
          <div class="mb-3">
            <label for="libelle" class="form-label">Libelle</label>
            <Field
              id="libelle"
              name="libelle"
              type="text"
              class="form-control"
              placeholder="Entrez un libellé"
            />
            <ErrorMessage name="libelle" class="text-danger mt-1" />
          </div>
          <!-- Heure de début -->
          <div class="mb-3">
            <label for="startTime" class="form-label">Heure de début</label>
            <Field id="startTime" name="startTime" type="time" class="form-control" />
            <ErrorMessage name="startTime" class="text-danger mt-1" />
          </div>
          <!-- Heure de fin -->
          <div class="mb-3">
            <label for="endTime" class="form-label">Heure de fin</label>
            <Field id="endTime" name="endTime" type="time" class="form-control" />
            <ErrorMessage name="endTime" class="text-danger mt-1" />
          </div>

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">Enregistrer</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import newTaskSchema from '@/schemas/newTaskSchema'
import useTaskStore from '@/stores/tasks'
import useToastStore from '@/stores/toast'
import { computed } from 'vue'

export default {
  name: 'CreateTaskForm',
  components: { Form, Field, ErrorMessage },
  setup() {
    const taskStore = useTaskStore()
    const toastStore = useToastStore()

    const loading = computed(() => taskStore.loading)
    const error = computed(() => taskStore.error)
    const successMessage = computed(() => taskStore.successMessage)

    const addTask = async (values, { resetForm }) => {
      try {
        await taskStore.addTask(values)
        toastStore.showToast(successMessage.value, 'success')
        resetForm()
      } catch (_err) {
        toastStore.showToast(error?.value?.message, 'warning')
      }
    }

    return { loading, newTaskSchema, successMessage, addTask }
  },
}
</script>
