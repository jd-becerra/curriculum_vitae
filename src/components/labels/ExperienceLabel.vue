<template>
  <v-container class="experience-label">
    <v-btn @click="closeView">X</v-btn>

    <h1>{{ $t('experience.title') }}</h1>
    <h2>{{ $t('experience.education') }}</h2>
    <p>{{ $t('experience.education-description') }}</p>
    <h2>{{ $t('experience.exchange') }}</h2>
    <p>{{ $t('experience.exchange-description') }}</p>
    <h2>{{ $t('experience.social-service') }}</h2>
    <p>{{ $t('experience.social-service-description') }}</p>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useMainStore } from '../store';
const mainStore = useMainStore();

const closeView = () => {
  (document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = "auto";
  (document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = "none";
  (document.querySelector('.menu-container') as HTMLElement).style.display = 'block';

  mainStore.hideExperience();
  mainStore.enableMouseEvents();

}
</script>

<style scoped>
.experience-label {
  width: 80%;
  height: 80%;
  background-color: rgba(255, 255, 255, 0.9);
  overflow-y: scroll;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

</style>
