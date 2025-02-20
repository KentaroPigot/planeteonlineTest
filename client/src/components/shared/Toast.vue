<template>
  <Transition>
    <div v-if="toastStore.visible" class="toast" :class="alertClass">
      {{ toastStore.message }}
    </div>
  </Transition>
</template>

<script>
import { computed, watch } from 'vue'
import useToastStore from '@/stores/toast'

export default {
  name: 'Toast',
  setup() {
    const toastStore = useToastStore()

    const alertClass = computed(() => {
      switch (toastStore.code) {
        case 'success':
          return 'alert-success'
        case 'danger':
          return 'alert-warning'
        case 'neutral':
          return 'alert-primary'
        default:
          return 'alert-primary'
      }
    })

    watch(
      () => toastStore.visible,
      (newValue) => {
        if (newValue) {
          setTimeout(() => {
            toastStore.hideToast()
          }, 2000)
        }
      },
    )

    return { toastStore, alertClass }
  },
}
</script>

<style scoped>
.toast {
  width: 400px;
  height: 50px;
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  pointer-events: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.alert-success {
  background-color: green;
  color: white;
}

.alert-warning {
  background-color: red;
  color: white;
}

.alert-primary {
  background-color: white;
}
</style>
