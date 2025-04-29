<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavigationItem from './NavigationItem.vue'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from './store'

import {
  mdiHome,
  mdiBriefcaseOutline,
  mdiAccountCircle,
  mdiGithub
// @ts-ignore
} from '@mdi/js';


const world = inject('world') as any
const { t, locale } = useI18n();
const store = useMainStore();

const menuVisible = ref(false)

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
  if (menuVisible.value) {
    store.disableMouseEvents();
  } else {
    store.enableMouseEvents();
  }
}

const returnToMainView = () => {
  menuVisible.value = false;
  store.enableMouseEvents();
  world.value.moveToMainArea();
}
const moveToProjects = () => {
  menuVisible.value = false;
  store.enableMouseEvents();
  world.value.moveToProjectsArea();
}
const moveToSocials = () => {
  menuVisible.value = false;
  store.enableMouseEvents();
  world.value.moveToSocialsArea();
}
const moveToAbout = () => {
  menuVisible.value = false;
  store.enableMouseEvents();
  world.value.moveToAboutArea();
}

function toggleLanguage() {
  locale.value = locale.value === 'en' ? 'es' : 'en'
}

function getLanguage() {
  return locale.value
}

// Detect clicks outside the menu and close it
const menuRef = ref<any>(null);
const handleClickOutside = (event: MouseEvent) => {
  const menuElement = menuRef.value?.$el as HTMLElement | undefined;
  if (menuVisible.value && menuElement && !menuElement.contains(event.target as Node)) {
    menuVisible.value = false;
    store.enableMouseEvents();
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
    <v-container ref="menuRef" class="menu-container">
      <v-btn @click="toggleMenu" class="toggle-button">
        {{ menuVisible ? $t('menu.close') : $t('menu.open') }}
      </v-btn>

        <v-list v-if="menuVisible" class="menu-container-buttons">
          <!-- Main View (return to beginning) -->
          <v-list-item>
            <NavigationItem :prepend-icon=mdiHome @click="returnToMainView">
              <template #heading>{{ $t('menu.main-view') }}</template>
            </NavigationItem>
          </v-list-item>

            <v-container class="section-buttons-container">
              <!-- Projects -->
              <v-list-item>
                <NavigationItem :prepend-icon=mdiBriefcaseOutline @click="moveToProjects">
                <template #heading>{{ $t('menu.projects') }}</template>
                </NavigationItem>
              </v-list-item>

              <!-- About Section (group) -->
              <v-list-group>
                <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                >
                  <NavigationItem :prepend-icon=mdiAccountCircle>
                  <template #heading>{{ $t('menu.about') }}</template>
                  </NavigationItem>
                </v-list-item>
                </template>

                <!-- About Subitems -->

                <v-list-item>
                <NavigationItem>
                  <template #heading>{{ $t('menu.summary') }}</template>
                </NavigationItem>
                </v-list-item>

                <v-list-item>
                <NavigationItem>
                  <template #heading>{{ $t('menu.skills') }}</template>
                </NavigationItem>
                </v-list-item>

                <v-list-item>
                <NavigationItem>
                  <template #heading>{{ $t('menu.experience') }}</template>
                </NavigationItem>
                </v-list-item>
              </v-list-group>

              <!-- Socials -->
              <v-list-item>
                <NavigationItem :prepend-icon=mdiGithub @click="moveToSocials">
                <template #heading>{{ $t('menu.socials') }}</template>
                </NavigationItem>
              </v-list-item>
            </v-container>

        </v-list>
    </v-container>

    <v-container class="menu-download-cv">
      <v-btn>Download CV</v-btn>
    </v-container>

    <v-container class="menu-settings">
      <v-btn @click="toggleLanguage">{{ getLanguage() }}</v-btn>
    </v-container>
  </v-main>
</template>

<style scoped>
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
    margin-bottom: 10px;
  }

  .menu-container {
    position: fixed;
    top: 0;
    left: 0;
    padding: 16px 0 0 16px;
    z-index: 10;
    pointer-events: auto;
    width: auto;
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
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    width: 10%;
    pointer-events: all;
  }

  .about-subitems {
    padding-left: 30px;
  }
</style>
