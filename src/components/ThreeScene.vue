<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue'
import { useMainStore } from './store'

// Controllable containers
import HardSkillsLabel from './labels/HardSkillsLabel.vue'
import SoftSkillsLabel from './labels/SoftSkillsLabel.vue'
import AboutLabel from './labels/AboutLabel.vue'
import CertificatesLabel from './labels/CertificatesLabel.vue'
import ExperienceLabel from './labels/ExperienceLabel.vue'
import CreditsLabel from './labels/CreditsLabel.vue'
import ProjectsLabelFull from './labels/ProjectsLabelFull.vue'

const mainContainer = ref<HTMLDivElement | null>(null)
const sceneContainer = ref<HTMLDivElement | null>(null)
const labelsContainer = ref<HTMLDivElement | null>(null)
const loading = ref<HTMLDivElement | null>(null)
const sceneSectionHeaders = ref<HTMLDivElement | null>(null)

// Store state variables
const store = useMainStore()
const showHardSkills = computed(() => store.showHardSkills)
const showSoftSkills = computed(() => store.showSoftSkills)
const showAbout = computed(() => store.showAbout)
const showCertificates = computed(() => store.showCertificates)
const showExperience = computed(() => store.showExperience)
const showCredits = computed(() => store.showCredits)
const showProjects = computed(() => store.showProjects)
const showCursorCircle = computed(() => store.cursorCircleVisible)

// Add circle over the mouse cursor
const addCircleOverCursor = (event: MouseEvent) => {
  const cursor = document.querySelector('.cursor') as HTMLElement
  if (cursor) {
    const offset = 20
    cursor.style.transform = `translate(${event.clientX - offset}px, ${event.clientY - offset}px)`
  }
}

// Expose the scene container to the parent component
const getContainer = () => {
  return sceneContainer.value as HTMLDivElement
}
defineExpose({
  getContainer,
})
</script>

<template>
  <div ref="mainContainer" class="main-container" @mousemove="addCircleOverCursor">
    <div ref="loading" class="loading">
      <div class="loading-bar-container">
        <div class="loading-bar"></div>
      </div>
      <p class="loading-description">{{ $t('scene-renderer.loading-text') }}</p>
    </div>

    <div ref="sceneSectionHeaders" class="scene-section-headers"></div>

    <div ref="inspectView" class="inspect-view">
      <HardSkillsLabel v-show="showHardSkills" />
      <SoftSkillsLabel v-show="showSoftSkills" />
      <AboutLabel v-show="showAbout" />
      <CertificatesLabel v-show="showCertificates" />
      <ExperienceLabel v-show="showExperience" />
      <CreditsLabel v-show="showCredits" />
      <ProjectsLabelFull v-show="showProjects" />
    </div>

    <div ref="sceneContainer" class="three-scene">
      <!-- Three.js renderer will mount here -->
    </div>
    <div ref="labelsContainer" class="three-labels">
      <!-- Labels, if any -->
    </div>

    <div class="cursor" v-show="showCursorCircle"></div>
    <!-- Custom cursor -->
  </div>
</template>

<style scoped>
* {
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.main-container {
  position: fixed; /* makes this the origin of its children */
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
  position: absolute; /* let us position ourself inside the container */
  left: 0; /* make our position the top left of the container */
  top: 0;
  color: white;
  z-index: 10;
}

.loading {
  position: fixed; /* make it fixed to always cover the screen */
  left: 0; /* start at the top-left corner */
  top: 0;
  width: 100%; /* cover the entire width of the screen */
  height: 100%; /* cover the entire height of the screen */
  background-color: #555555;
  z-index: 9999; /* ensure it is above all other elements */
  display: flex;
  flex-direction: column; /* stack elements vertically */
  justify-content: center;
  align-items: center;
  pointer-events: none;
  /* opacity: 0.1; /* for debugging */
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

.three-labels > div:hover {
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

.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  pointer-events: none; /* So it doesn't interfere with mouse events */
  z-index: 9999;
  border-radius: 50%;

  /* This creates a circle with a radial gradient */
  background: radial-gradient(
      farthest-side,
      transparent calc(100% - 3px),
      white calc(100% - 2px) calc(100% - 1px),
      /* white border */ transparent 100%
    )
    no-repeat;

  opacity: 0.8; /* semi-transparent */

  background-size: 50px 50px;

  /* Add glow effect */
  box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.3);
  filter: blur(0.5px);
}
</style>
