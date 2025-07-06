<template>
  <v-container
    class="projects"
  >
    <v-btn @click="closeView">X</v-btn>
    <v-carousel v-model="selectedProject">
      <v-carousel-item
        v-for="(project, index) in projects"
        :key="index"
        cover
      >
        <v-card class="project-card">
          <v-card-title>{{ project.title }}</v-card-title>
          <v-card-text>
            <p v-html="project.description"></p>
            <p v-if="project.link && project.link.trim() !== ''">
              <a :href="project.link" target="_blank">{{ project.link }}</a>
            </p>
          </v-card-text>
          <v-img :src="project.image" class="project-image"></v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store';
import { computed } from 'vue';

interface Project {
  title: string
  description: string
  image: string
  link?: string
}

const { tm } = useI18n()
const projects = (tm('projects.cards') as Project[]);

const mainStore = useMainStore();
const selectedProject = computed({
  get: () => mainStore.getSelectedProjectIndex,  // Get the currently selected project index
  /* The set method helps us update the selection, since without it, the computed property
  would be read-only and it would get stuck on the first project selected */
  set: (val: number) => mainStore.setCurrentProjectIndex(val)
});

const closeView = () => {
  (document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = "auto";
  (document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = "none";
  (document.querySelector('.menu-container') as HTMLElement).style.display = 'block';

  mainStore.hideProjects();
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu();
}
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
</style>

