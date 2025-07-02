<template>
  <v-container class="projects">
    <v-carousel cycle :show-arrows="false" v-model="currentProjectIndex">
      <v-carousel-item v-for="(project, index) in projects" :key="index" cover>
        <v-card class="project-card" style="cursor: pointer">
          <v-card-title>{{ project.title }}</v-card-title>
          <v-card-text>
            <p v-html="project.description"></p>
          </v-card-text>
          <v-img :src="project.image" class="project-image"></v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useMainStore } from '../store'

interface Project {
  title: string
  description: string
  image: string
}

const { tm } = useI18n()
const projects = tm('projects.cards') as Project[]

const currentProjectIndex = ref(0)
watch(currentProjectIndex, (newIndex) => {
  const mainStore = useMainStore()
  if (!mainStore.showProjects) mainStore.setCurrentProjectIndex(newIndex)
})
</script>

<style scoped>
.projects {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin-top: 0;
}

.projects-carousel {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
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
  object-fit: scale-down;
  margin-top: 0; /* Ensure no space between card and image */
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
