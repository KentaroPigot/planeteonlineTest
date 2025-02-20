<template>
  <app-header />
  <router-view></router-view>
  <Toast />
  <app-auth />
</template>

<script>
import AppHeader from './layouts/Header.vue'
import AppAuth from './components/auth/AuthModal.vue'
import Toast from './components/shared/Toast.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    Toast,
  },
}
</script>
