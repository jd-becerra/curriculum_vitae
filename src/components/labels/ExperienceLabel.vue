<template>
  <LabelContainer @close="closeView">
    <div class="experience">
      <h1 class="label-title">{{ $t('experience.title') }}</h1>

      <div class="experience-content">
        <h2 class="experience-subtitle">{{ $t('experience.education_title') }}</h2>
        <p class="experience-description">{{ $t('experience.education_description') }}</p>
        <div class="image-container">
          <img src="/img/experience/education.png" alt="Education" class="experience-image" />
        </div>
        <h2 class="experience-subtitle">{{ $t('experience.social_service_title') }}</h2>
        <p class="experience-description">
          {{ $t('experience.social_service_description') }}
          <a :href="$t('experience.social_service_link')" target="_blank">{{
            $t('experience.social_service_link')
          }}</a>
        </p>
        <div class="image-container">
          <img
            src="/img/experience/social_service.svg"
            alt="Social Service"
            class="experience-image"
          />
        </div>
        <h2 class="experience-subtitle">{{ $t('experience.exchange_title') }}</h2>
        <p class="experience-description">{{ $t('experience.exchange_description') }}</p>
        <div class="image-container">
          <img src="/img/experience/exchange.jpg" alt="Exchange" class="experience-image" />
        </div>
      </div>
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { useMainStore } from '../store'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

const mainStore = useMainStore()

const closeView = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideExperience()
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
  mainStore.showAboutNavigation('experience')
}
</script>

<style scoped>
.experience {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.experience-content {
  text-align: justify;
  font-family: Arial, sans-serif;
  overflow-y: scroll;
  padding-left: 5rem;
  padding-right: 5rem;
  height: 100%;
  width: 250%;
}
.experience-subtitle {
  font-weight: bold;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.experience-image {
  width: 80%;
  height: auto;
  margin-top: 1rem;
  margin-bottom: 3rem;
}
</style>
