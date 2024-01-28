import './assets/main.css'
import 'vue-slider-component/theme/default.css'

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';



import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(vuetify);
app.mount('#app');

