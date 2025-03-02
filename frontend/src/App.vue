<script setup lang="ts">
import MainView from './views/MainView.vue';
</script>

<template>
  <v-app>
    <MainView />
  </v-app>
</template>

<style scoped>
/* Set component to fill screen */
html, body, #app, .v-application {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Position TheWelcome component in the top left corner */
.v-main {
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 1;
}
</style>
