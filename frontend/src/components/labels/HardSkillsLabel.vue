<template>
  <v-container class="hard-skills">
    <v-btn @click="closeHardSkills">X</v-btn>

    <h1>{{ $t('hard-skills.title') }}</h1>
    <p v-html="$t('hard-skills.main-description')"></p>
    <v-container class="hard-skills-list">
      <v-list
        v-for="(skill, index) in $tm('hard-skills.skills')"
        :key="index">
        <v-list-item class="skill-item">
          <v-list-item-title class="skill-name">{{ skill.name }}</v-list-item-title>
          {{ skill.description }}
        </v-list-item>
        <v-divider class="skill-divider" v-if="index < $tm('hard-skills.skills').length - 1"></v-divider>
      </v-list>
    </v-container>
    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useMainStore } from '../store';

const mainStore = useMainStore();

const closeHardSkills = () => {
  // @ts-ignore
  document.querySelector('.label-renderer').style.pointerEvents = "auto";
  // @ts-ignore
  document.querySelector('.inspect-view').style.pointerEvents = "none";

  mainStore.hideHardSkills();
  mainStore.enableMouseEvents();
}

</script>

<style scoped>
.hard-skills {
  background-color: white;
  padding: 2rem;
  margin: 2rem;
  text-align: justify;
  font-family: Arial, sans-serif;
  width: 90%;
  height: 80%;
  overflow: scroll;
}

.skill-item {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.skill-name {
  font-weight: bold;
}

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
