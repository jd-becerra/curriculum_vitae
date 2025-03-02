<script setup lang="ts">
  import { ref, onMounted, defineExpose } from 'vue';

  const mainContainer = ref<HTMLDivElement | null>(null);
  const sceneContainer = ref<HTMLDivElement | null>(null);
  const labelsContainer = ref<HTMLDivElement | null>(null);

  // Expose the scene container to the parent component
  const getContainer = () => {
    return sceneContainer.value as HTMLDivElement;
  }
  defineExpose({
    getContainer,
  })

</script>

<template>
  <div ref="mainContainer" class="main-container">
    <div ref="sceneContainer" class="three-scene">
      <!-- Three.js renderer will mount here -->
    </div>
    <div ref="labelsContainer" class="three-labels">
      <!-- Labels, if any -->
    </div>
  </div>
</template>

<style scoped>
.main-container {
  position: fixed;  /* makes this the origin of its children */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.three-scene {
  width: 100%;
  height: 100%;
  display: block;
}

.three-labels {
  position: absolute;  /* let us position ourself inside the container */
  left: 0;             /* make our position the top left of the container */
  top: 0;
  color: white;
  z-index: 10;
}

.label {
  position: absolute;  /* let us position them inside the container */
  left: 0;             /* make their default position the top left of the container */
  top: 0;
  cursor: pointer;     /* change the cursor to a hand when over us */
  font-size: large;
  user-select: none;   /* don't let the text get selected */
  text-shadow:         /* create a black outline */
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
  color: black;
}
.three-labels>div:hover {
  color: red;
}
* {
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

</style>
