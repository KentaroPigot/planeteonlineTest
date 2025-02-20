import { defineStore } from 'pinia'

export default defineStore('toastStore', {
  state: () => ({
    message: '',
    code: 'primary',
    visible: false,
  }),

  actions: {
    showToast(newMessage, newCode = 'primary') {
      this.message = newMessage
      this.code = newCode
      this.visible = true
    },

    hideToast() {
      this.visible = false
    },
  },
})
