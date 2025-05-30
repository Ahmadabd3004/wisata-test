import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
const app = createApp(App)

app.use(router)
app.component('InfiniteLoading', InfiniteLoading)
app.mount('#app')
