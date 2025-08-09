<template>
  <LabelContainer class="hard-skills" @close="closeHardSkills">
    <h1 class="label-title">{{ $t('hard-skills.title') }}</h1>
    <div class="expand-container">
      <v-btn class="expand-btn" @click="expandAllPanels" flat>
        {{ $t('hard-skills.expand') }}
      </v-btn>
    </div>
    <v-expansion-panels v-model="panel" multiple class="hard-skills-list" flat variant="popout">
      <v-expansion-panel
        class="hard-skill-item"
        v-for="(hard_skill, index) in getHardSkills"
        :key="index"
        :text="hard_skill.description"
        :title="`${index + 1}. ${hard_skill.name}`"
        :ref="(el) => (panelRefs[index] = el as HTMLElement)"
      ></v-expansion-panel>
    </v-expansion-panels>
  </LabelContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useMainStore } from '../store'
import { useI18n } from 'vue-i18n'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

const { tm } = useI18n()
const getHardSkills = ref<Array<{ name: string; description: string }>>(
  tm('hard-skills.skills') as Array<{ name: string; description: string }>,
)

watch(
  () => tm('hard-skills.skills'),
  (newSkills) => {
    getHardSkills.value = newSkills as Array<{ name: string; description: string }>
  },
)

const mainStore = useMainStore()
// Use computed to get panel for hard skills
const panel = computed<number[]>({
  get: () => mainStore.panelHardSkills as number[],
  set: (val: number[]) => {
    mainStore.setPanelHardSkills(val)
  },
})
const closeHardSkills = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideHardSkills()
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
  mainStore.showAboutNavigation('skills')

  panelRefs.value = []
  mainStore.emptyPanelHardSkills()
}

// Scroll to first selected panel
const panelRefs = ref<HTMLElement[]>([])
watch(panel, async (val) => {
  if (val.length === 1) {
    // Will only work if only one panel is selected
    await nextTick().then(() => {
      const target = panelRefs.value[val[0]]
      if (target?.$el || target?.$el?.scrollIntoView) {
        target.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (target?.scrollIntoView) {
        console.log('Scrolling into view')
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
})
const expandAllPanels = () => {
  panel.value = getHardSkills.value.map((_, index) => index)
}
</script>

<style scoped>
.label-title {
  font-weight: bold;
  width: 100%;
  text-align: center;
  text-decoration: underline;
}
.hard-skill-item {
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
