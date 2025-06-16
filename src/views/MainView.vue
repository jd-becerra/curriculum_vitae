<script setup lang="ts">
import HUDScene from '@/components/HUDScene.vue';
import ThreeScene from '@/components/ThreeScene.vue';
import { onMounted, provide, ref } from 'vue';
// @ts-ignore
import { World } from '@/World/World.js';

const world = ref<World | null>(null);
provide('world', world);

const threeSceneRef = ref<any>(null);

onMounted(() => {
  if (!threeSceneRef.value) {
    console.error('Three scene not found');
    return;
  }

  const container = threeSceneRef.value.getContainer();
  if (!container) {
    console.error('Scene container not found');
    return;
  }

  world.value = new World(container);
  world.value.start();
});
</script>

<template>
  <ThreeScene ref="threeSceneRef" />
  <HUDScene />
</template>
