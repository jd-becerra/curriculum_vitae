import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

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
  VListItemSubtitle,
  VListGroup,
  VIcon,
  VSlideXTransition,
  VDialog,
  VProgressCircular,
  VCarousel,
  VCarouselItem,
  VDivider,
  VExpansionPanel,
  VExpansionPanels
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
    VListItemSubtitle,
    VListGroup,
    VIcon,
    VSlideXTransition,
    VDialog,
    VProgressCircular,
    VCarousel,
    VCarouselItem,
    VDivider,
    VExpansionPanel,
    VExpansionPanels,
  },
  directives: {
    Ripple,
    Intersect,
    Scroll,
    Touch
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});


export default vuetify;
