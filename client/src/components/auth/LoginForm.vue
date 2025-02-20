<template>
  <div>
    <div
      v-if="login_show_alert"
      class="alert text-center font-weight-bold mb-4"
      :class="login_alert_variant"
      role="alert"
    >
      {{ login_alert_msg }}
    </div>

    <Form :validation-schema="loginSchema" @submit="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <Field
          id="email"
          type="email"
          name="email"
          class="form-control"
          placeholder="Enter your email"
        />
        <ErrorMessage name="email" class="form-text text-danger" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <Field
          id="password"
          type="password"
          name="password"
          class="form-control"
          placeholder="Enter your password"
        />
        <ErrorMessage name="password" class="form-text text-danger" />
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">Submit</button>
    </Form>
  </div>
</template>

<script>
import loginSchema from '@/schemas/loginSchema'
import useAuthStore from '@/stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { onMounted } from 'vue'
import { computed } from 'vue'

export default {
  name: 'LoginForm',
  components: { Form, Field, ErrorMessage },

  setup() {
    const authStore = useAuthStore()

    const login = authStore.login
    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)

    // Computed pour les alertes
    const login_show_alert = computed(() => loading.value || error.value)
    const login_alert_variant = computed(() =>
      error.value ? 'alert-danger' : loading.value ? 'alert-primary' : 'alert-success',
    )
    const login_alert_msg = computed(() => {
      if (loading.value) return 'Patience, on vous connecte!'
      if (error.value)
        return error.value.message || 'Une erreur inconnu est servenue. Réessayez plus tard.'
      return 'Super ! Vous êtes connecté !'
    })

    onMounted(() => {
      authStore.queryStateCleaning()
    })

    return {
      loginSchema,
      login,
      loading,
      login_show_alert,
      login_alert_variant,
      login_alert_msg,
    }
  },
}
</script>
