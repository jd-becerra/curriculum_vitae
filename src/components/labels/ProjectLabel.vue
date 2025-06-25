<template>
  <v-container
    class="projects"
    @mouseenter="handleMouseEnter($event)"
    @mouseleave="handleMouseLeave"
  >
    <v-carousel cycle>
      <v-carousel-item>
        <v-card class="project-card">
          <v-card-title>{{$t('projects-vue.title')}}</v-card-title>
          <v-card-text>
            <p v-html="$t('projects-vue.description')"></p>
          </v-card-text>
        </v-card>
      </v-carousel-item>

      <v-carousel-item
        v-for="(project, index) in $tm('projects-vue.projects')"
        :key="index"
        cover
      >
        <v-card class="project-card">
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
import { useMainStore } from '../store'
import { Vector2 } from 'three';
import { ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendTo = (link: string) => {
  if (!link) return;
  window.open(link, "_blank");
};

const computerObject = ref(null);

const handleMouseEnter = (event: MouseEvent) => {
  setTimeout(() => {  // Delay to ensure the event is processed
    const store = useMainStore();
    if (!store.isComputerVisible) {
      console.warn("Projects are not visible or store is not initialized.");
      return;
    }

    const pick_helper = store.getPickHelper;
    const scene = store.get3DScene;

    if (!pick_helper || !scene) return;

    if (!computerObject.value) {
      computerObject.value = scene.getObjectByName("computer") || scene.getObjectByName("Computer");
    }

    if (!computerObject.value) return;

    const mouse = new Vector2();
    const rect = document.body.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    pick_helper.outlineObject(computerObject.value, mouse, "My Projects");
  }, 20);
};

const handleMouseLeave = () => {
  const store = useMainStore();
  const pick_helper = store.getPickHelper;

  if (!pick_helper) return;

  pick_helper.clearOutline();
};
</script>

<style scoped>
.projects {
  width: 100%;
  height: 100%;
  position: fixed;
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

.next, .prev {
  color: black;
}
</style>
