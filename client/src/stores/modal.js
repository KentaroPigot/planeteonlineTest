import { defineStore } from 'pinia'

export default defineStore('modal', {
  state: () => ({
    isOpen: false,
    tab: 'login',
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'visually-hidden' : ''
    },
    showModal(state) {
      return state.isOpen
    },
    getTabName(state) {
      return state.tab
    },
  },
  actions: {
    toggleModal() {
      this.isOpen = !this.isOpen
    },
    toggleTab(tabName) {
      this.tab = tabName
    },
  },
})
