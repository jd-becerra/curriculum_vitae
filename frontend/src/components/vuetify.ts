import { createVuetify } from 'vuetify';

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
  VProgressCircular,
  VCarousel,
  VCarouselItem,
  VDivider
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
    VProgressCircular,
    VCarousel,
    VCarouselItem,
    VDivider
  },
  directives: {
    Ripple,
    Intersect,
    Scroll,
    Touch
  }
});


export default vuetify;
