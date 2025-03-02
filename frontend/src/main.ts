import './assets/main.css';

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import i18n  from './components/il8n.ts';

// Vue configuration
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VContainer,
  VImg,
  VBtn,
  VSpacer,
  VMain,
  VCard,
  VCardText,
  VCardTitle,
  VCardActions,
  VNavigationDrawer,
  VList,
  VListItem,
  VListItemTitle,
  VForm,
  VTextarea,
  VTextField,
  VIcon,
  VToolbar,
  VToolbarTitle,
  VSlideXTransition,
  VDialog,
  VProgressCircular
} from 'vuetify/components';
import { Ripple, Intersect, Scroll, Touch } from 'vuetify/directives';
const vuetify = createVuetify({
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VContainer,
    VImg,
    VBtn,
    VSpacer,
    VMain,
    VCard,
    VCardText,
    VCardTitle,
    VCardActions,
    VNavigationDrawer,
    VList,
    VListItem,
    VListItemTitle,
    VForm,
    VTextarea,
    VTextField,
    VIcon,
    VToolbar,
    VToolbarTitle,
    VSlideXTransition,
    VDialog,
    VProgressCircular
  },
  directives: {
    Ripple,
    Intersect,
    Scroll,
    Touch
  }
});

// Create Vue app
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(i18n);

app.mount("#app");
