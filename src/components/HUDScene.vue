<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, inject } from 'vue'
import NavigationItem from './NavigationItem.vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from './store'
import '../assets/base.css'

import {
  mdiHome,
  mdiBriefcaseOutline,
  mdiAccountCircle,
  mdiGithub,
  mdiMenuUp,
  mdiMenuDown,
} from '@mdi/js'
import type { VListGroup } from 'vuetify/components'
import { remove } from '@tweenjs/tween.js'

const world = inject('world') as any
const { t, locale } = useI18n()
const store = useMainStore()

const showAboutNavigationBtns = computed(() => store.isAboutNavigationVisible)
const infoPanelVisible = computed(() => store.isInfoPanelVisible)

// To show at the beginning of the application
const showNavigationMenu = computed(() => store.isNavigationMenuVisible)
const showSettingsMenu = computed(() => store.isSettingsMenuVisible)
const showDownloadCV = computed(() => store.isDownloadCVVisible)
const showPngHeadersLoading = computed(() => store.isPngHeadersLoadingVisible)

const isNavOpen = computed({
  get() {
    return store.isNavigationMenuOpen
  },
  set(value) {
    if (value) {
      store.openNavigationMenu()
      store.disableMouseEvents()
    } else {
      store.closeNavigationMenu()
      if (!store.isVueLabelOpen && !store.isPngHeadersLoadingVisible) store.enableMouseEvents()
    }
  },
})
const isAboutOpen = ref(false)

const returnToMainView = () => {
  store.closeNavigationMenu()
  store.hideAboutNavigation()
  store.enableMouseEvents()
  store.setClickDelay(false)
  world.value.moveToMainArea()
}
const moveToProjects = () => {
  store.closeNavigationMenu()
  store.enableMouseEvents()
  store.hideAboutNavigation()
  store.setClickDelay(true)
  world.value.moveToProjectsArea()
}
const moveToSocials = () => {
  store.closeNavigationMenu()
  store.enableMouseEvents()
  store.hideAboutNavigation()
  store.setClickDelay(false)
  world.value.moveToSocialsArea()
}
const moveToAboutMain = () => {
  store.closeNavigationMenu()
  store.enableMouseEvents()
  store.setClickDelay(false)
  world.value.moveToAboutMainSubarea()
}
const moveToAboutSkills = () => {
  store.closeNavigationMenu()
  store.enableMouseEvents()
  store.setClickDelay(false)
  world.value.moveToAboutSkillsSubarea()
}
const moveToAboutExperience = () => {
  store.closeNavigationMenu()
  store.enableMouseEvents()
  store.setClickDelay(false)
  world.value.moveToAboutExperienceSubarea()
}
const moveAboutUp = () => {
  if (store.moveUpToSkills) {
    moveToAboutSkills()
  } else if (store.moveUpToAbout) {
    moveToAboutMain()
  }
}
const moveAboutDown = () => {
  if (store.moveDownToExperience) {
    moveToAboutExperience()
  } else if (store.moveDownToAbout) {
    moveToAboutMain()
  }
}

function setLang(lang: string) {
  locale.value = lang
  store.setLocale(lang)

  localStorage.setItem('locale', lang)

  // change html lang attribute
  document.documentElement.setAttribute('lang', lang)
}

// Detect clicks outside the menu and close it
const menuRef = ref<any>(null)
const infoPanelRef = ref<any>(null)
const handleClickOutside = (event: MouseEvent) => {
  const isMenuVisible =
    store.isNavigationMenuOpen &&
    menuRef.value?.$el &&
    !menuRef.value.$el.contains(event.target as Node)
  const isInfoPanelVisible =
    infoPanelVisible.value &&
    infoPanelRef.value?.$el &&
    !infoPanelRef.value.$el.contains(event.target as Node)
  if (isMenuVisible || isInfoPanelVisible) {
    store.closeNavigationMenu()
    store.disableInfoPanel()
    if (!store.isPngHeadersLoadingVisible && !store.isVueLabelOpen) {
      store.enableMouseEvents()
      store.enableDownloadCV()
    }
    store.enableSettingsMenu()

    isNavOpen.value = false
  }
}

const removeMouseArtifacts = () => {
  // Remove decorative elements that follow the mouse
  store.hideCursorCircle()
  removeHoverTags()
}

const toggleNavigationMenu = () => {
  isNavOpen.value = !isNavOpen.value
  removeHoverTags()
}

const removeHoverTags = () => {
  const hoverTags = document.querySelectorAll('.hover-tag')
  hoverTags.forEach((tag) => {
    tag.remove()
  })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <v-main>
    <v-container
      ref="menuRef"
      class="menu-container"
      v-show="showNavigationMenu"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      @mouseleave="store.showCursorCircle()"
    >
      <v-btn @click.stop.prevent="toggleNavigationMenu" class="pa-0 ma-0">
        <v-img src="/icons/location.svg" width="24" height="24" class="mr-2" />
        {{ isNavOpen ? $t('menu.close') : $t('menu.open') }}

        <v-img v-if="isNavOpen" src="/icons/chevron_left.svg" width="24" height="24" class="ml-8" />
        <v-img v-else src="/icons/chevron_right.svg" width="24" height="24" class="ml-8" />
      </v-btn>
      <transition name="fade-slide" class="navigation-menu-transition">
        <div v-show="isNavOpen">
          <!-- Main View -->
          <v-btn @click.stop.prevent="returnToMainView" class="d-flex justify-start">
            <v-icon class="mr-2">{{ mdiHome }}</v-icon>
            {{ $t('menu.main-view') }}
          </v-btn>

          <!-- Projects Section -->
          <v-btn @click.stop.prevent="moveToProjects" class="d-flex justify-start">
            <v-icon class="mr-2">{{ mdiBriefcaseOutline }}</v-icon>
            {{ $t('menu.projects') }}
          </v-btn>

          <!-- About Section -->

          <v-btn @click.stop.prevent="isAboutOpen = !isAboutOpen" class="d-flex justify-start">
            <v-icon class="mr-2">{{ mdiAccountCircle }}</v-icon>
            {{ $t('menu.about') }}
            <v-img src="/icons/arrow_down.svg" width="24" height="24" class="ml-8" />
          </v-btn>

          <transition name="fade-slide">
            <div v-show="isAboutOpen" class="about-subitems">
              <v-btn @click.stop.prevent="moveToAboutMain" class="d-flex justify-start">
                <v-img src="/icons/summary.svg" width="24" height="24" class="mr-2" />
                {{ $t('menu.summary') }}
              </v-btn>
              <v-btn @click.stop.prevent="moveToAboutSkills" class="d-flex justify-start">
                <v-img src="/icons/skill.svg" width="24" height="24" class="mr-2" />
                {{ $t('menu.skills') }}
              </v-btn>
              <v-btn @click.stop.prevent="moveToAboutExperience" class="d-flex justify-start">
                <v-img src="/icons/certified.svg" width="24" height="24" class="mr-2" />
                {{ $t('menu.experience') }}
              </v-btn>
            </div>
          </transition>

          <!-- Socials -->

          <v-btn @click.stop.prevent="moveToSocials" class="d-flex justify-start">
            <v-icon class="mr-2">{{ mdiGithub }}</v-icon>
            {{ $t('menu.socials') }}
          </v-btn>
        </div>
      </transition>
    </v-container>

    <v-container class="about-navigation" v-show="showAboutNavigationBtns">
      <v-btn
        v-show="store.moveUpToSkills || store.moveUpToAbout"
        @click.stop.prevent="moveAboutUp"
        class="about-navigation-up"
      >
        <v-icon :icon="mdiMenuUp" class="about-nav-icon"></v-icon>
      </v-btn>

      <v-btn
        v-show="store.moveDownToExperience || store.moveDownToAbout"
        @click.stop.prevent="moveAboutDown"
        class="about-navigation-down"
      >
        <v-icon :icon="mdiMenuDown" class="about-nav-icon"></v-icon>
      </v-btn>
    </v-container>

    <v-btn
      class="download-cv-btn"
      v-show="showDownloadCV"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      @mouseleave="store.showCursorCircle()"
    >
      <v-img src="/icons/download.svg" width="24" height="24" class="mr-2" />
      {{ t('menu.download') }}
    </v-btn>

    <v-btn
      @click.stop.prevent="store.enableInfoPanel()"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      v-show="store.isInfoButtonVisible"
      class="language-button"
    >
      <v-img src="/icons/help.svg" width="24" height="24" class="mr-2" />
      {{ t('menu.info_panel') }}
    </v-btn>

    <v-container
      class="info"
      ref="infoPanelRef"
      v-show="infoPanelVisible"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      @mouseleave="store.showCursorCircle()"
    >
      <div class="info-item d-flex justify-end">
        <v-btn class="close-info" @click.stop.prevent="store.disableInfoPanel()"> X </v-btn>
      </div>
      <v-list>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>Change Language</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-btn @click.stop.prevent="setLang('en')">English</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn @click.stop.prevent="setLang('es')">Español</v-btn>
          </v-list-item>
        </v-list-group>
      </v-list>
      <div class="info-item">
        <v-img src="/img/click.gif" width="50" height="50" alt="Click"></v-img>
        <span class="info-text">{{ t('menu.click_interact') }}</span>
      </div>
      <div class="info-item">
        <div style="height: 50px; width: 50px; position: relative">
          <v-img id="drag-icon" src="/img/drag.png" width="50" height="50" alt="Drag"></v-img>
        </div>
        <span class="info-text">{{ t('menu.click_and_drag') }}</span>
      </div>
      <div class="info-item">
        <v-img id="scroll-icon" src="/img/scroll.png" width="50" height="50" alt="Scroll"></v-img>
        <span class="info-text">{{ t('menu.scroll_zoom') }}</span>
      </div>
    </v-container>
    <div class="info-background" v-if="infoPanelVisible"></div>
    <div class="png-headers-loading" v-show="showPngHeadersLoading">
      <v-progress-circular
        indeterminate
        color="white"
        size="32"
        width="4"
        class="loading-spinner"
      ></v-progress-circular>
    </div>
  </v-main>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.v-main {
  display: flex;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.language-button {
  position: fixed;
  top: 2%;
  left: 2%;
  z-index: 1000;
  pointer-events: all;
}
.download-cv-btn {
  position: fixed;
  top: 6%;
  left: 2%;
  pointer-events: all;
  z-index: 1000;
}
.menu-container {
  position: fixed;
  top: 10%;
  left: 2%;
  z-index: 1000;
  margin: 0;
  padding: 0;
  pointer-events: auto;
  display: flex;
  flex-direction: row;
}

.menu-container-buttons {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  opacity: 0.9;
}

.section-buttons-container {
  margin-top: -1rem;
  margin-left: 0.5rem;
}

.menu-settings {
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  width: auto;
  height: auto;
  pointer-events: all;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  background-color: rgb(58, 58, 58);
  color: white;
  opacity: 0.9;
}

.info {
  position: absolute;
  right: 0;
  padding: 16px;
  width: 30%;
  height: 100%;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  background-color: white;
  animation: slide-in 0.5s ease-in-out;
  z-index: 1000;
  cursor: default;
}
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.info-item {
  margin-bottom: 2rem;
}
.close-info {
  background-color: transparent;
  color: black;
  border: none;
  font-size: 1.5rem;
}
.info-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  cursor: default;
}

.about-subitems {
  padding-left: 30px;
}

/** Set navigaton up and down in the center of the screen */
.about-navigation-up,
.about-navigation-down {
  position: fixed;
  color: black;
  z-index: 15;
  font-size: 2rem;
  height: auto;
  width: auto;
  pointer-events: auto;
  transform: translate(-50%, -50%);
  /** center objects (vertically and horizontally) */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  background-color: white;

  /* New glowing border effect */
  border-image: linear-gradient(90deg, transparent, var(--color-sweep), transparent);
  border-image-slice: 1;
  animation: glow-sweep 3s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

.about-navigation-up {
  top: 20%;
  right: 15%;
}

.about-navigation-down {
  bottom: 20%;
  right: 15%;

  animation-delay: 0.75s; /* Add delay to alternate the bounce */
}

#drag-icon {
  animation: drag 3s infinite ease-in-out;
}
@keyframes drag {
  0% {
    transform: translateX(0);
    width: 50px;
    height: 50px;
  }
  30% {
    transform: translateX(0);
    width: 50px;
    height: 50px;
  }
  40% {
    transform: translateX(0);
    width: 45px;
    height: 45px;
  }
  60% {
    transform: translateX(10px);
  }
  90% {
    width: 45px;
    height: 45px;
    transform: translateX(0);
  }
}

#scroll-icon {
  animation: scroll 3s infinite ease-in-out;
}
@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-2px);
  }
  60% {
    transform: translateY(5px);
  }
  90% {
    transform: translateY(0);
  }
}

.png-headers-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9999;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  cursor: default;
}
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.v-btn {
  min-width: var(--button-width);
  height: var(--button-height);
  border: 3px solid #030303;
  border-radius: var(--border-radius);
  text-align: right;
}
</style>
