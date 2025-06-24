<script setup lang="ts">
import HUDScene from '@/components/HUDScene.vue';
import ThreeScene from '@/components/ThreeScene.vue';
import { onMounted, provide, ref } from 'vue';
// @ts-expect-error world is a js module
import { World } from '@/World/World.js';

const world = ref<World | null>(null);
provide('world', world);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
