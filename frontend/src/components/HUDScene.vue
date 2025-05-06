<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import NavigationItem from './NavigationItem.vue'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from './store'

import {
  mdiHome,
  mdiBriefcaseOutline,
  mdiAccountCircle,
  mdiGithub,
  mdiMenuUp,
  mdiMenuDown
// @ts-ignore
} from '@mdi/js';
import type { VListGroup } from 'vuetify/components'

const world = inject('world') as any;
const { t, locale } = useI18n();
const store = useMainStore();

const showAboutNavigationBtns = computed(() => store.aboutNavigationVisible);

const isNavOpen = computed({
  get() {
    return store.isNavigationMenuVisible;
  },
  set(value) {
    if (value) {
      store.showNavigationMenu();
      store.disableMouseEvents();
    } else {
      store.hideNavigationMenu();
      store.enableMouseEvents();
    }
  }
});
const isAboutOpen = ref(false)

const returnToMainView = () => {
  store.hideNavigationMenu();
  store.hideAboutNavigation();
  store.enableMouseEvents();
  world.value.moveToMainArea();
}
const moveToProjects = () => {
  store.hideNavigationMenu();
  store.enableMouseEvents();
  store.hideAboutNavigation();
  world.value.moveToProjectsArea();
}
const moveToSocials = () => {
  store.hideNavigationMenu();
  store.enableMouseEvents();
  store.hideAboutNavigation();
  world.value.moveToSocialsArea();
}
const moveToAboutMain = () => {
  store.hideNavigationMenu();
  store.enableMouseEvents();
  world.value.moveToAboutMainSubarea();
}

const moveToAboutSkills = () => {
  store.hideNavigationMenu();
  store.enableMouseEvents();
  world.value.moveToAboutSkillsSubarea();
}

const moveToAboutExperience = () => {
  store.hideNavigationMenu();
  store.enableMouseEvents();
  world.value.moveToAboutExperienceSubarea();
}

const moveAboutUp = () => {
  if (store.moveUpToSkills) {
    moveToAboutSkills();
  } else if (store.moveUpToAbout) {
    moveToAboutMain();
  }
}

const moveAboutDown = () => {
  if (store.moveDownToExperience) {
    moveToAboutExperience();
  } else if (store.moveDownToAbout) {
    moveToAboutMain();
  }

}

function setLang(lang: string) {
  locale.value = lang;
  store.setLocale(lang);
}

// Detect clicks outside the menu and close it
const menuRef = ref<any>(null);
const handleClickOutside = (event: MouseEvent) => {
  const menuElement = menuRef.value?.$el as HTMLElement | undefined;
  if (store.isNavigationMenuVisible && menuElement && !menuElement.contains(event.target as Node)) {
    store.hideNavigationMenu();
    store.enableMouseEvents();
    store.setClickDelay(true);

    isNavOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <v-main>
    <v-list ref="menuRef" class="menu-container">
      <v-list-item @click="isNavOpen = !isNavOpen">
        <v-list-item-title>
          {{ isNavOpen ? 'Close' : 'Navigation' }}
        </v-list-item-title>
      </v-list-item>

      <transition name="fade-slide">
        <div v-show="isNavOpen">
          <!-- Main View -->
          <v-list-item>
            <NavigationItem :prepend-icon="mdiHome" @click="returnToMainView">
              <template #heading>{{ $t('menu.main-view') }}</template>
            </NavigationItem>
          </v-list-item>

          <!-- Projects -->
          <v-list-item>
            <NavigationItem :prepend-icon="mdiBriefcaseOutline" @click="moveToProjects">
              <template #heading>{{ $t('menu.projects') }}</template>
            </NavigationItem>
          </v-list-item>

          <!-- Socials -->
          <v-list-item>
            <NavigationItem :prepend-icon="mdiGithub" @click="moveToSocials">
              <template #heading>{{ $t('menu.socials') }}</template>
            </NavigationItem>
          </v-list-item>

          <!-- About Section -->
          <v-list-item @click="isAboutOpen = !isAboutOpen">
            <NavigationItem :prepend-icon="mdiAccountCircle">
              <template #heading>{{ $t('menu.about') }}</template>
            </NavigationItem>
          </v-list-item>

          <transition name="fade-slide">
            <div v-show="isAboutOpen" class="about-subitems">
              <v-list-item>
                <NavigationItem @click="moveToAboutSkills"><template #heading>{{ $t('menu.skills') }}</template></NavigationItem>
              </v-list-item>
              <v-list-item>
                <NavigationItem @click="moveToAboutMain"><template #heading>{{ $t('menu.summary') }}</template></NavigationItem>
              </v-list-item>
              <v-list-item>
                <NavigationItem @click="moveToAboutExperience"><template #heading>{{ $t('menu.experience') }}</template></NavigationItem>
              </v-list-item>
            </div>
          </transition>
        </div>
      </transition>
    </v-list>

    <v-container class="about-navigation" v-show="store.isAboutNavigationVisible">
      <v-btn
        v-show="store.moveUpToSkills || store.moveUpToAbout"
        @click="moveAboutUp"
        class="about-navigation-up">
        <v-icon :icon="mdiMenuUp" class="about-nav-icon"></v-icon>
      </v-btn>

      <v-btn
        v-show="store.moveDownToExperience || store.moveDownToAbout"
        @click="moveAboutDown"
        class="about-navigation-down">
        <v-icon :icon="mdiMenuDown" class="about-nav-icon"></v-icon>
      </v-btn>
    </v-container>

    <v-container class="menu-download-cv">
      <v-btn>Download CV</v-btn>
    </v-container>

    <v-list class="menu-settings">
      <v-list-group >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
          >
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item>
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
              >
                <v-list-item-title>Change Language</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item>
              <v-btn @click="setLang('en')" class="language-button">English</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn @click="setLang('es')" class="language-button">Español</v-btn>
            </v-list-item>
          </v-list-group>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-main>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
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

.toggle-button {
  background-color: rgb(58, 58, 58);
  color: white;
}

.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  z-index: 10;
  pointer-events: auto;
  width: auto;
  height: auto;
  background-color: rgb(58, 58, 58);
  color: white;
  opacity: 0.9;
}

.menu-container-buttons {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  background-color: rgb(58, 58, 58);
  color: white;
  opacity: 0.9;
}

.section-buttons-container {
  margin-top: -1rem;
  margin-left: 0.5rem;
}

.menu-download-cv {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  pointer-events: all;
  padding: 16px;
  width: 20%;
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

.language-button {
  width: 100%;
  background-color: rgb(58, 58, 58);
  color: white;
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
  justify-content: center;
  /** center objects (vertically and horizontally) */
  display: flex;
  align-items: center;
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

.about-navigation-up {
  top: 10%;
  left: 50%;
}

.about-navigation-down {
  bottom: 10%;
  left: 50%;

  animation-delay: 0.75s; /* Add delay to alternate the bounce */
}
</style>
