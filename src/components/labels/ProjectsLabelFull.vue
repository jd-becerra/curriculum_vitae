<template>
  <LabelContainer @close="closeView">
    <h1 class="projects-title">{{ $t('projects.title') }}</h1>
    <div class="carousel-container">
      <v-carousel
        v-model="selectedProject"
        class="projects-carousel"
        hide-delimiter-background
        color="black"
        show-arrows="hover"
        @mouseenter="showDescriptions = true"
        @mouseleave="showDescriptions = false"
      >
        <v-carousel-item
          class="project-item"
          v-for="(project, index) in projects"
          :key="index"
          :src="`/img/projects_scr/${project.image}`"
          cover
        >
          <v-overlay absolute v-if="showDescriptions">
            <div class="project-overlay">
              <h2 class="text-center">{{ project.title }}</h2>

              {{ project.description }}

              <p v-if="project.link && project.link.trim() !== ''">
                <strong>Visit the website:</strong>
                <a :href="project.link" target="_blank">
                  {{ project.link }}
                </a>
              </p>

              <p v-if="project.github_link && project.github_link.trim() !== ''">
                <strong>Check the code on GitHub:</strong>
                <a :href="project.github_link" target="_blank">
                  {{ project.github_link }}
                </a>
              </p>
            </div>
          </v-overlay>
        </v-carousel-item>
      </v-carousel>
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store'
import { computed, ref, watch } from 'vue'
import LabelContainer from '../LabelContainer.vue'

interface Project {
  title: string
  description: string
  image: string
  link?: string
  github_link?: string
}

const { tm } = useI18n()
const projects = ref<Project[]>(tm('projects.cards'))

watch(
  () => tm('projects.cards'),
  (newProjects) => {
    projects.value = newProjects as Project[]
  },
)

const mainStore = useMainStore()

const selectedProject = computed({
  get: () => mainStore.getSelectedProjectIndex, // Get the currently selected project index
  /* The set method helps us update the selection, since without it, the computed property
  would be read-only and it would get stuck on the first project selected */
  set: (val: number) => mainStore.setCurrentProjectIndex(val),
})

const closeView = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideProjects()
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
}

const showDescriptions = ref<boolean>(false)
</script>

<style scoped>
.projects-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.projects-title {
  font-weight: bold;
  height: 20%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
}
.projects-carousel {
  width: 100%;
  height: 100%;
}
.carousel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;

  margin-top: 2rem;
}
.project-overlay {
  background-color: rgba(39, 39, 39, 0.95);
  color: white;
  padding: 1.5rem;
  text-align: justify;
}
a {
  color: #72fdfd;
  text-decoration: underline;
}
</style>
