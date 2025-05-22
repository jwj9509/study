import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'

import './assets/common.css'

const app = createApp(App)
app.config.globalProperties.$axios = axios;  //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
app.config.globalProperties.$serverUrl = '//localhost:8081' //api server
app.use(router).mount('#app')