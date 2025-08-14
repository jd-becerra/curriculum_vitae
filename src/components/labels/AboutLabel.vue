<template>
  <LabelContainer @close="closeAboutMe">
    <div class="about-me">
      <h1 class="label-title">{{ $t('about.title') }}</h1>
      <div class="label-description">
        <div class="profile-image-container">
          <v-img src="/img/profile.png" class="profile-image" />
        </div>
        <p v-html="$t('about.description')"></p>
      </div>
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { useMainStore } from '../store'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

const mainStore = useMainStore()

const closeAboutMe = () => {
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideAbout()
  mainStore.showAboutNavigation('main')
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
}
</script>

<style>
.label-title {
  font-weight: bold;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
}

.label-description {
  text-align: justify;
  font-family: Arial, sans-serif;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding-left: 5rem;
  padding-right: 5rem;
  width: 250%;
}
.about-me {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  margin: auto;
}
.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid black;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
</style>
