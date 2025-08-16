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

const handleClickMenuContainer = () => {
  /** When the container expands, there's an area that is not visible to the user
   * but still blocks clicks from the scene behind. Handle this case as if we
   * had clicked outside the menu container.
   */
  if (!store.isPngHeadersLoadingVisible && !store.isVueLabelOpen) {
    store.closeNavigationMenu()
    store.enableMouseEvents()
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

const getAboutNavigationButtons = () => {
  const subarea = store.getCurrentArea
  const buttons = { up: '', down: '' }

  if (subarea == 'about') {
    buttons.up = 'move_up_skills'
    buttons.down = 'move_down_experience'
  } else if (subarea == 'skills') {
    buttons.down = 'move_down_about'
  } else if (subarea == 'experience') {
    buttons.up = 'move_up_about'
  }

  // It's ok if we get empty strings, because in those cases the buttons are not rendered
  return buttons
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
    <!-- Navigation Menu -->
    <v-container
      ref="menuRef"
      class="menu-container"
      v-show="showNavigationMenu"
      @click="handleClickMenuContainer"
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

    <!-- Navigation Buttons for About Section -->
    <v-container class="about-navigation" v-show="showAboutNavigationBtns">
      <v-btn
        v-show="store.moveUpToSkills || store.moveUpToAbout"
        @click.stop.prevent="moveAboutUp"
        class="about-navigation-up"
      >
        {{ $t(`menu.${getAboutNavigationButtons().up}`) }}
        <v-icon :icon="mdiMenuUp" class="about-nav-icon ml-2" width="32" height="32"></v-icon>
      </v-btn>

      <v-btn
        v-show="store.moveDownToExperience || store.moveDownToAbout"
        @click.stop.prevent="moveAboutDown"
        class="about-navigation-down"
      >
        {{ $t(`menu.${getAboutNavigationButtons().down}`) }}
        <v-icon :icon="mdiMenuDown" class="about-nav-icon ml-2" width="32" height="32"></v-icon>
      </v-btn>
    </v-container>

    <!-- Download Button -->
    <v-btn
      class="download-cv-btn"
      v-show="showDownloadCV"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      @mouseleave="store.showCursorCircle()"
    >
      <v-img src="/icons/download.svg" width="24" height="24" class="mr-2" />
      {{ t('menu.download') }}
    </v-btn>

    <!-- Button to open Settings Menu -->
    <v-btn
      @click.stop.prevent="store.enableInfoPanel()"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      v-show="store.isInfoButtonVisible"
      class="language-button"
    >
      <v-img src="/icons/help.svg" width="24" height="24" class="mr-2" />
      {{ t('menu.info_panel') }}
    </v-btn>

    <!-- Settings Menu -->
    <v-container
      class="info"
      ref="infoPanelRef"
      v-show="infoPanelVisible"
      @mouseenter.stop.prevent="removeMouseArtifacts"
      @mouseleave="store.showCursorCircle()"
    >
      <v-btn class="close-info" @click.stop.prevent="store.disableInfoPanel()">
        <v-img src="/icons/close_black.svg" width="24" height="24"
      /></v-btn>

      <v-container class="pa-0 ma-0 d-flex align-end justify-end mb-12">
        <v-list>
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" class="change_language_open">
                <v-list-item-title class="d-flex justify-end">{{
                  t('menu.change_language')
                }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item @click.stop.prevent="setLang('en')" class="change_language_item en">
              <div class="d-flex">
                <v-img src="/icons/english.png" width="24" height="24" class="mr-4" />
                {{ t('menu.english') }}
              </div>
            </v-list-item>
            <v-list-item @click.stop.prevent="setLang('es')" class="change_language_item es">
              <div class="d-flex">
                <v-img src="/icons/spanish.png" width="24" height="24" class="mr-4" />
                {{ t('menu.spanish') }}
              </div>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-container>

      <h3 class="text-h5">{{ t('menu.instructions_title') }}</h3>
      <p class="mb-4">{{ t('menu.instructions') }}</p>
      <v-list>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>1. {{ t('menu.click_and_drag') }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-img class="w-100" src="/img/info/drag.gif" alt="Drag"></v-img>
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>2. {{ t('menu.click_interact') }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-img class="w-100" src="/img/info/click.gif" alt="Click"></v-img>
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>3. {{ t('menu.scroll_zoom') }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-img class="w-100" src="/img/info/zoom.gif" alt="Scroll"></v-img>
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>4. {{ t('menu.instructions_navigation') }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-img
              class="w-100"
              src="/img/info/instructions_navigation.gif"
              alt="Navigation"
            ></v-img>
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>5. {{ t('menu.instructions_download') }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item>
            <v-img class="w-100" src="/img/info/instructions_download.png" alt="Download"></v-img>
          </v-list-item>
        </v-list-group>
      </v-list>

      <div class="visit_link">
        <p>
          {{ t('menu.visit_link') }}
          <a href="https://github.com/jd-becerra/curriculum_vitae" target="_blank"
            >https://github.com/jd-becerra/curriculum_vitae</a
          >
        </p>
      </div>
    </v-container>

    <!-- Background Overlay -->
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
  width: auto;
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
  border: 5px solid black;
  right: 0;
  padding: 16px;
  width: 50%;
  height: 100%;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  background-color: white;
  animation: slide-in 0.5s ease-in-out;
  z-index: 1000;
  cursor: default;
  overflow-y: auto;
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
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  min-width: 24px !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  align-self: flex-end;
  margin: 1rem 1rem 1rem 0;
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
  z-index: 15;
  pointer-events: auto;
  transform: translate(50%, -50%);
  /** center objects (vertically and horizontally) */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  background-color: white;
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

.change_language_open {
  border-bottom: 1px solid black;
}
.change_language_item {
  width: 100%;
  border: 1px solid black;
  display: flex;
}
.en {
  margin-top: 0.5rem;
  border-bottom: 0px;
}
.visit_link {
  display: flex;
  font-size: 0.9rem;
  align-items: end;
  justify-content: end;
  flex-grow: 1;
}
a {
  color: #00277d;
  text-decoration: underline;
}
</style>
