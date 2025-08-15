<template>
  <v-container class="projects">
    <v-carousel
      :cycle="cycleProjects"
      :show-arrows="false"
      v-model="currentProjectIndex"
      hide-delimiter-background
      :hide-delimiters="true"
    >
      <v-carousel-item v-for="(project, index) in projects" :key="index" cover>
        <v-img :src="`/img/projects_scr/${project.image}`" class="project-image"></v-img>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useMainStore } from '../store'

interface Project {
  image: string
}

const { tm } = useI18n()
const projects = tm('projects.cards') as Project[]

const currentProjectIndex = ref(0)
watch(currentProjectIndex, (newIndex) => {
  const mainStore = useMainStore()
  if (!mainStore.showProjects) mainStore.setCurrentProjectIndex(newIndex)
})

const mainStore = useMainStore()
const cycleProjects = ref<boolean>(mainStore.canCycleProjects)
watch(
  () => mainStore.canCycleProjects,
  (newVal) => {
    cycleProjects.value = newVal
  },
)
</script>

<style scoped>
.projects {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.projects-carousel {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.project-slide {
  width: 100%;
  height: 100%;
}

.introduction-card,
.project-card {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* Ensure text doesn't overflow */
.text-subtitle-1,
.text-body-2 {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.next,
.prev {
  background-color: white;
  opacity: 1;
  font-weight: bold;
}
</style>
