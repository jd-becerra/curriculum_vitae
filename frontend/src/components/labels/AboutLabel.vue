<template>
  <v-container class="about_me">
    <v-btn @click="closeAboutMe">X</v-btn>

    <h1>{{ $t('about.title') }}</h1>
    <p v-html="$t('about.description')"></p>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useMainStore } from '../store';
const mainStore = useMainStore();

const closeAboutMe = () => {
  console.log('close');

  // @ts-ignore
  document.querySelector('.label-renderer').style.pointerEvents = "auto";
  // @ts-ignore
  document.querySelector('.inspect-view').style.pointerEvents = "none";
  // @ts-ignore
  document.querySelector('.menu-container').style.display = 'block';

  mainStore.hideAbout();
  mainStore.enableMouseEvents();
};
</script>

<style scoped>
.about_me {
  background-color: white;
  padding: 2rem;
  margin: 2rem;
  text-align: justify;
  font-family: Arial, sans-serif;
  width: 90%;
  height: 80%;
  overflow: scroll;
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
