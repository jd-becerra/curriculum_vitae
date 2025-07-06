<template>
  <v-container class="credits-label">
    <v-btn @click="closeView">X</v-btn>
    <h1>{{ tm('credits.title') }}</h1>
    <p>{{ tm('credits.description') }}</p>
    <v-list class="credits-list">
      <v-list-item v-for="(model, index) in credits" :key="index">
        <v-list-item-title>{{ model.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ model.author }}</v-list-item-subtitle>
        <v-list-item-subtitle>
          <a :href="model.link" target="_blank">{{ model.link }}</a>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store'

interface Credit {
  name: string
  author: string
  link: string
}

const { tm } = useI18n()
const credits: Credit[] = tm('credits.models')

const mainStore = useMainStore()
const closeView = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideCredits()

  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
}
</script>

<style scoped>
.credits-label {
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
