<script setup lang="ts">
  import { ref, onMounted, defineExpose, computed } from 'vue';
  import HardSkillsLabel from "./labels/HardSkillsLabel.vue"
  import { useMainStore } from './store';

  const mainContainer = ref<HTMLDivElement | null>(null);
  const sceneContainer = ref<HTMLDivElement | null>(null);
  const labelsContainer = ref<HTMLDivElement | null>(null);
  const loading = ref<HTMLDivElement | null>(null);
  const sceneSectionHeaders = ref<HTMLDivElement | null>(null);

  // Store state variables
  const store = useMainStore();
  const showHardSkills = computed(() => store.showHardSkills);

  // Expose the scene container to the parent component
  const getContainer = () => {
    return sceneContainer.value as HTMLDivElement;
  }
  defineExpose({
    getContainer
  })
</script>

<template>
  <div ref="mainContainer" class="main-container">
    <div ref="loading" class="loading">
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
      </div>
      <p class="loading-description" >{{ $t( 'scene-renderer.loading-text' ) }}</p>
    </div>

    <div ref="sceneSectionHeaders" class="scene-section-headers"></div>

    <div ref="inspectView" class="inspect-view">
      <HardSkillsLabel v-show="showHardSkills" />
    </div>

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
  overflow: hidden;
}

.three-labels {
  position: absolute;  /* let us position ourself inside the container */
  left: 0;             /* make our position the top left of the container */
  top: 0;
  color: white;
  z-index: 10;
}

.loading {
  position: fixed;     /* make it fixed to always cover the screen */
  left: 0;             /* start at the top-left corner */
  top: 0;
  width: 100%;         /* cover the entire width of the screen */
  height: 100%;        /* cover the entire height of the screen */
  background-color: #555555;
  z-index: 9999;       /* ensure it is above all other elements */
  display: flex;
  flex-direction: column; /* stack elements vertically */
  justify-content: center;
  align-items: center;
  pointer-events: none;
  opacity: 0.1; /* for debugging */
}

.loading-bar-container {
  width: 50%;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
}

.loading-bar {
  height: 100%;
  width: 0%;
  background: #888109;
  transition: width 0.3s ease;
}

.loading-description {
  color: white;
  margin-top: 10px;
}

.three-labels>div:hover {
  color: red;
}

.scene-section-headers {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* allow interaction with the scene */
  z-index: 11; /* ensure it is above all other elements */

  display: none; /* hide by default */
}

.inspect-view {
  display: flex;
  align-items: center; /* vertical center */
  justify-content: center; /* horizontal center */
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none; /* optional if you want mouse clicks to pass through */
  z-index: 12;
}

* {
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

</style>
