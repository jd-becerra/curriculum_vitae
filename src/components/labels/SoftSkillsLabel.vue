<template>
  <v-container class="soft-skills">
    <v-btn @click="closeSoftSkills">X</v-btn>

    <h1>{{ $t('soft-skills.title') }}</h1>
    <p v-html="$t('soft-skills.main-description')"></p>
    <v-expansion-panels
    v-model="panel"
    multiple
    class="soft-skills-list">
      <v-expansion-panel
        v-for="(soft_skill, index) in $tm('soft-skills.skills')"
        :key="index"
        :text="soft_skill.description"
        :title="soft_skill.name"
        ></v-expansion-panel>
    </v-expansion-panels>
    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '../store';

const mainStore = useMainStore();
// Use computed to get panel for soft skills
const panel = ref<number[]>([]);
const closeSoftSkills = () => {
  // @ts-ignore
  document.querySelector('.label-renderer').style.pointerEvents = "auto";
  // @ts-ignore
  document.querySelector('.inspect-view').style.pointerEvents = "none";
  // @ts-ignore
  document.querySelector('.menu-container').style.display = 'block';

  mainStore.hideSoftSkills();
  mainStore.enableMouseEvents();

  panel.value = [];
}

</script>

<style scoped>
.soft-skills {
  background-color: white;
  padding: 2rem;
  margin: 2rem;
  text-align: justify;
  font-family: Arial, sans-serif;
  width: 90%;
  height: 80%;
  overflow: scroll;
}

.soft-skill-item {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.soft-skill-name {
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
