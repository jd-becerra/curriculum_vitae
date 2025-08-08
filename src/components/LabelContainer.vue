<template>
  <div class="label-wrapper">
    <div class="label-container">
      <slot></slot>
    </div>

    <div class="close-container">
      <CloseButton @click="onClose" />
    </div>

    <div class="background"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import CloseButton from './CloseButton.vue'
import '../assets/base.css';

defineProps<{
  onClose: () => void
}>()
</script>

<style scoped>
.label-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.label-container {
  background-color: white;
  padding: 2rem;
  margin: 2rem;
  border-radius: var(--border-radius);
  text-align: justify;
  font-family: Arial, sans-serif;
  width: 80%;
  height: 80%;
  overflow: scroll;
}
.close-container {
  height: 80%;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: -1;
}
</style>
