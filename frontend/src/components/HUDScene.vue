<script setup lang="ts">
  import { ref } from 'vue'
  import WelcomeItem from './WelcomeItem.vue'
  import DocumentationIcon from './icons/IconDocumentation.vue'
  import ToolingIcon from './icons/IconTooling.vue'
  import EcosystemIcon from './icons/IconEcosystem.vue'
  import CommunityIcon from './icons/IconCommunity.vue'
  import SupportIcon from './icons/IconSupport.vue'
  import { inject } from 'vue';
  // @ts-ignore
  import { World } from '@/World/World.js';
  import { onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const world = inject('world') as any; // get the world from the provider
  const { locale } = useI18n();
  const menuVisible = ref(false);
  const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
  };

  function rotateCamera(direction: String) {
    if (!world.value) {
      console.error('World not found');
      return;
    }

    world.value.rotateCamera(direction);
  }

  function toggleLanguage() {
    locale.value = locale.value === 'en' ? 'es' : 'en';
  }

  function getLanguage() {
    return locale.value;
  }
</script>

  <template>
    <v-main>
      <v-container class="menu-container">
        <v-btn @click="toggleMenu" class="toggle-button">{{ menuVisible ? $t('menu.close') : $t('menu.open') }}</v-btn>
        <v-expand-transition>
          <div v-if="menuVisible" class="menu-container-buttons">
            <WelcomeItem>
                <template #icon>
                  <DocumentationIcon />
                </template>
                <template #heading>{{$t('menu.welcome')}}</template>
            </WelcomeItem>

            <WelcomeItem>
              <template #icon>
                <ToolingIcon />
              </template>
              <template #heading>{{ $t('menu.about') }}</template>
            </WelcomeItem>

            <WelcomeItem>
              <template #icon>
                <EcosystemIcon />
              </template>
              <template #heading>{{ $t('menu.contact') }}</template>
            </WelcomeItem>

            <WelcomeItem>
              <template #icon>
                <CommunityIcon />
              </template>
              <template #heading>{{ $t('menu.projects') }}</template>
            </WelcomeItem>
          </div>
        </v-expand-transition>
      </v-container>
      <v-container class="menu-rotation">
          <v-btn @click="rotateCamera('left')"><</v-btn>
          <v-btn @click="rotateCamera('right')">></v-btn>
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
    pointer-events: all;
    width: 20%;
  }

  .menu-container-buttons {
    display: flex;
    flex-direction: column;
    padding-left: 30px;
    gap: 10px;
    background-color: rgb(58, 58, 58);
    opacity: 0.9;
  }

  .menu-rotation {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    pointer-events: all;
    padding: 16px;
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
  </style>
