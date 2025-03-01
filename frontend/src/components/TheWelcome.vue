<script setup lang="ts">
import { ref } from 'vue'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const menuVisible = ref(true)
const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}
</script>

<template>
  <v-main>
    <v-btn @click="toggleMenu" class="toggle-button">{{ menuVisible ? 'Ocultar' : 'Navegación' }}</v-btn>
    <v-expand-transition>
      <div v-if="menuVisible" class="menu-container">
        <WelcomeItem>
          <template #icon>
            <DocumentationIcon />
          </template>
          <template #heading>Proyectos</template>
        </WelcomeItem>

        <WelcomeItem>
          <template #icon>
            <ToolingIcon />
          </template>
          <template #heading>Contacto</template>
        </WelcomeItem>

        <WelcomeItem>
          <template #icon>
            <EcosystemIcon />
          </template>
          <template #heading>Certificados</template>
        </WelcomeItem>

        <WelcomeItem>
          <template #icon>
            <CommunityIcon />
          </template>
          <template #heading>Sobre mí</template>
        </WelcomeItem>

        <WelcomeItem>
          <template #icon>
            <SupportIcon />
          </template>
          <template #heading>Experiencia</template>
        </WelcomeItem>
      </div>
    </v-expand-transition>
  </v-main>
</template>

<style scoped>
.toggle-button {
  margin-bottom: 10px;
}
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
