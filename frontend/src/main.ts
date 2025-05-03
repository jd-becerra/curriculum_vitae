import './assets/main.css';

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import 'vuetify/styles';
import i18n  from './components/i18n.ts';
import vuetify from './components/vuetify.ts';
import { createPinia } from 'pinia';
const pinia = createPinia();

// Create Vue app
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(i18n);

app.mount("#app");
