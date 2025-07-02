<template>
  <v-container class="hard-skills">
    <v-btn @click="closeHardSkills">X</v-btn>

    <h1>{{ $t('hard-skills.title') }}</h1>
    <p v-html="$t('hard-skills.main-description')"></p>
    <v-expansion-panels
    v-model="panel"
    multiple
    class="hard-skills-list">
      <v-expansion-panel
        v-for="(hard_skill, index) in getHardSkills"
        :key="index"
        :text="hard_skill.description"
        :title="hard_skill.name"
        :ref="el => panelRefs[index] = el as HTMLElement"
        ></v-expansion-panel>
    </v-expansion-panels>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useMainStore } from '../store';
import { useI18n } from 'vue-i18n';

const { tm } = useI18n();
const getHardSkills = tm('hard-skills.skills') as Array<{ name: string, description: string }>;

const mainStore = useMainStore();
// Use computed to get panel for hard skills
const panel = computed({
  get: () => mainStore.panelHardSkills,
  set: (val) => {
    mainStore.setPanelHardSkills(val);
  },
});
const closeHardSkills = () => {

  (document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = "auto";
  (document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = "none";
  (document.querySelector('.menu-container') as HTMLElement).style.display = 'block';

  mainStore.hideHardSkills();
  mainStore.enableMouseEvents();
  mainStore.showNavigationMenu();
  mainStore.showAboutNavigation('skills');

  panelRefs.value = [];
  mainStore.emptyPanelHardSkills();
}

// Scroll to first selected panel
const panelRefs = ref<HTMLElement[]>([]);
watch(panel, async (val) => {
  if (val.length === 1) { // Will only work if only one panel is selected
    await nextTick().then(() => {
      const target = panelRefs.value[val[0]];
      if (target?.$el || target?.$el?.scrollIntoView) {
        target.$el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (target?.scrollIntoView) {
        console.log('Scrolling into view');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});

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

.hard-skill-item {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.hard-skill-name {
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
