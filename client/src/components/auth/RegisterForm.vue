<template>
  <div
    v-if="reg_show_alert"
    class="alert text-center font-weight-bold mb-4"
    :class="reg_alert_variant"
    role="alert"
  >
    {{ reg_alert_msg }}
  </div>

  <Form :validation-schema="registerSchema" @submit="signup">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <Field id="name" type="text" name="name" class="form-control" placeholder="Enter your name" />
      <ErrorMessage name="name" class="form-text text-danger" />
    </div>

    <div class="mb-3">
      <label for="firstname" class="form-label">Firstname</label>
      <Field
        id="firstname"
        type="text"
        name="firstname"
        class="form-control"
        placeholder="Enter your firstname"
      />
      <ErrorMessage name="firstname" class="form-text text-danger" />
    </div>

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
      <label for="age" class="form-label">Age</label>
      <Field id="age" type="number" name="age" class="form-control" placeholder="Enter your age" />
      <ErrorMessage name="age" class="form-text text-danger" />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <Field type="password" name="password" :bails="false" v-slot="{ field, errors }">
        <input
          id="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
          v-bind="field"
        />
        <div class="form-text text-danger" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </Field>
    </div>

    <div class="mb-3">
      <label for="passwordConfirm" class="form-label">Confirm Password</label>
      <Field
        id="passwordConfirm"
        type="password"
        name="passwordConfirm"
        class="form-control"
        placeholder="Confirm your password"
      />
      <ErrorMessage name="passwordConfirm" class="form-text text-danger" />
    </div>

    <div class="form-check mb-3">
      <Field type="checkbox" name="tos" value="1" class="form-check-input" id="tos" />
      <label for="tos" class="form-check-label">Accept terms of service</label>
      <ErrorMessage name="tos" class="form-text text-danger" />
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="loading">Submit</button>
  </Form>
</template>

<script>
import registerSchema from '@/schemas/registerSchema'
import useAuthStore from '@/stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { computed, onMounted } from 'vue'

export default {
  name: 'RegisterForm',
  components: { Form, Field, ErrorMessage },
  setup() {
    const authStore = useAuthStore()

    const signup = authStore.signup

    const loading = computed(() => authStore.loading)
    const error = computed(() => authStore.error)

    const reg_show_alert = computed(() => loading.value || error.value)
    const reg_alert_variant = computed(() =>
      error.value ? 'alert-danger' : loading.value ? 'alert-primary' : 'alert-success',
    )
    const reg_alert_msg = computed(() => {
      if (loading.value) return 'Patience, on vous créer un compte!'
      if (error.value)
        return error.value.message || 'Une erreur inconnu est servenue. Réessayez plus tard.'
      return 'Bienvenue !'
    })

    onMounted(() => {
      authStore.queryStateCleaning()
    })

    return {
      loading,
      signup,
      registerSchema,
      reg_alert_msg,
      reg_alert_variant,
      reg_show_alert,
    }
  },
}
</script>
