<template>
  <LabelContainer class="soft-skills" @close="closeSoftSkills">
    <h1 class="label-title">{{ $t('soft-skills.title') }}</h1>
    <div class="expand-container">
      <v-btn class="expand-btn" @click="expandAllPanels" flat>
        {{ $t('soft-skills.expand') }}
      </v-btn>
    </div>
    <v-expansion-panels
      v-model="panelSoftSkills"
      multiple
      class="soft-skills-list"
      flat
      variant="popout"
    >
      <v-expansion-panel
        class="soft-skill-item"
        v-for="(soft_skill, index) in softSkills"
        :key="index"
        :text="soft_skill.description"
        :title="soft_skill.name"
      ></v-expansion-panel>
    </v-expansion-panels>
  </LabelContainer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMainStore } from '../store'
import { useI18n } from 'vue-i18n'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

const { tm } = useI18n()
const softSkills = ref<Array<{ name: string; description: string }>>(
  tm('soft-skills.skills') as Array<{ name: string; description: string }>,
)

watch(
  () => tm('soft-skills.skills'),
  (newSkills) => {
    softSkills.value = newSkills as Array<{ name: string; description: string }>
  },
)

const mainStore = useMainStore()
// Use computed to get panel for soft skills
const panelSoftSkills = ref<number[]>([])
const closeSoftSkills = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideSoftSkills()
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
  mainStore.showAboutNavigation('skills')

  panelSoftSkills.value = []
}

const expandAllPanels = () => {
  panelSoftSkills.value = softSkills.value.map((_, index) => index)
}
</script>

<style scoped>
.label-title {
  font-weight: bold;
  width: 100%;
  text-align: center;
  text-decoration: underline;
}
.soft-skill-item {
  border-radius: 0px;
  border-bottom: 1px solid var(--color-border);
}
.v-expansion-panel >>> .v-expansion-panel-title {
  font-weight: bold;
  color: var(--expand-panel-title);
}
.expand-container {
  display: flex;
  justify-content: end;
  margin-bottom: 1rem;
}
.expand-btn {
  border: 1px solid black;
  border-radius: var(--border-radius);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}
</style>
