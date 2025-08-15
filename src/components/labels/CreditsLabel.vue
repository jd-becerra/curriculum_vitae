<template>
  <LabelContainer @close="closeView">
    <div class="credits">
      <h1 class="label-title">{{ tm('credits.title') }}</h1>
      <div class="credits-content">
        <p class="mt-2">{{ tm('credits.description') }}</p>
        <p>
          <strong>{{ tm('credits.note-title') }}</strong> {{ tm('credits.note') }}
        </p>
        <ul class="credits-list">
          <li v-for="(model, index) in credits" :key="index">
            {{ model.name }}, {{ tm('credits.author_by') }} <strong>{{ model.author }}</strong
            >.
            {{ tm('credits.link') }}
            <a :href="model.link" target="_blank">{{ model.link }}</a>
          </li>
        </ul>
      </div>
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

interface Credit {
  name: string
  author: string
  link: string
}

const { tm } = useI18n()
const credits = ref<Array<Credit>>(tm('credits.models'))

watch(
  () => tm('credits.models'),
  (newCredits) => {
    credits.value = newCredits as Credit[]
  },
)

const mainStore = useMainStore()
const closeView = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideCredits()

  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
}
</script>

<style scoped>
.credits {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.credits-content {
  text-align: justify;
  font-family: Arial, sans-serif;
  overflow-y: scroll;
  padding-left: 5rem;
  padding-right: 5rem;
  height: 100%;
  width: 250%;
}
.credits-list {
  margin-top: 1rem;
}
a {
  color: #00277d;
  text-decoration: underline;
}
</style>
