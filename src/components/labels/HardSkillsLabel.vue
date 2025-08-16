<template>
  <LabelContainer @close="closeHardSkills">
    <div class="hard-skills">
      <v-btn class="expand-btn" @click="expandAllPanels" flat>
        {{ $t('hard-skills.expand') }}
      </v-btn>
      <h1 class="label-title">{{ $t('hard-skills.title') }}</h1>
      <div class="hard-skills-list">
        <v-expansion-panels v-model="panel" multiple flat variant="popout">
          <v-expansion-panel
            class="hard-skill-item"
            v-for="(hard_skill, index) in getHardSkills"
            :key="index"
            :text="hard_skill.description"
            :title="`${index + 1}. ${hard_skill.name}`"
            :ref="(el) => (panelRefs[index] = el)"
          ></v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useMainStore } from '../store'
import { useI18n } from 'vue-i18n'
import { VExpansionPanel } from 'vuetify/components'
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
import type { ComponentPublicInstance } from 'vue'
const panelRefs = ref<Array<ComponentPublicInstance | Element | null>>([])
watch(panel, async (val) => {
  if (val.length === 1) {
    await nextTick()
    const target = panelRefs.value[val[0]]
    // If it's a Vue component, use $el; if it's an Element, use directly
    if (target) {
      if ('$el' in target && target.$el instanceof Element) {
        target.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (target instanceof Element) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
})
const expandAllPanels = () => {
  panel.value = getHardSkills.value.map((_, index) => index)
}
</script>

<style scoped>
.hard-skills {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.label-title {
  font-weight: bold;
  width: 100%;
  text-align: center;
}
.hard-skills-list {
  width: 250%;
  height: 100%;
  overflow-y: scroll;
  padding-top: 5rem;
}
.hard-skill-item {
  border-radius: 0px;
  border-bottom: 1px solid var(--color-border);
}
.v-expansion-panel :deep() .v-expansion-panel-title {
  font-weight: bold;
  color: var(--expand-panel-title);
}
.expand-btn {
  border: 1px solid black;
  border-radius: var(--border-radius);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  position: absolute;
  right: 15%;
  top: 15%;
  z-index: 10;
}
</style>
