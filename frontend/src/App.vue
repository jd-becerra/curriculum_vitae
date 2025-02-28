<script setup lang="ts">
import ThreeScene from "@/components/ThreeScene.vue";
import TheWelcome from "./components/TheWelcome.vue";
</script>

<template>
  <v-app>
    <ThreeScene />
    <TheWelcome />
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
  top: 10%;
  left: 10%;
  z-index: 1;
}
</style>
