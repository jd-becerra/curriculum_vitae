<template>
  <v-container class="certificates">
    <v-btn @click="closeView">X</v-btn>
    <v-carousel cycle>
      <v-carousel-item
        v-for="(certificate, index) in certificates"
        :key="index"
      >
        <v-card class="certificate-card">
          <v-card-title>{{ certificate.title }}</v-card-title>
          <v-card-text>
            <p v-html="certificate.description"></p>
            <p v-if="certificate.link.trim() !== ''">
              <a :href="certificate.link" target="_blank">
                {{ certificate.link }}
              </a>
            </p>
          </v-card-text>
          <v-img
            :src="certificate.image"
            class="certificate-image"
          ></v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>

    <div class="background"></div>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store';

interface Certificate {
  title: string
  description: string
  link: string
  image: string
}

const { locale, messages } = useI18n()
const certificates = (messages.value[locale.value].certificates as Certificate[])
const mainStore = useMainStore();

const closeView = () => {
  console.log('Closing certificates view');
  (document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = "auto";
  (document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = "none";
  (document.querySelector('.menu-container') as HTMLElement).style.display = 'block';

  mainStore.hideCertificates();
  mainStore.enableMouseEvents();
  mainStore.showNavigationMenu();
  mainStore.showAboutNavigation('experience');
}
</script>

<style scoped>
.certificate-card {
  max-width: 600px;
  margin: auto;
}
.certificate-image {
  width: 100%;
  height: auto;
}
.certificate {
  text-align: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}
.certificate h2 {
  margin-bottom: 0.5rem;
}
.certificate p {
  margin: 0.5rem 0;
}
.certificate a {
  color: #1976d2;
  text-decoration: none;
}
.certificate a:hover {
  text-decoration: underline;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
</style>
