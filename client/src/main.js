import './assets/main.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ErrorMessage, Field, Form } from 'vee-validate'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
