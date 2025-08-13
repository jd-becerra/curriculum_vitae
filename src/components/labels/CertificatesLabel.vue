<template>
  <LabelContainer @close="closeView">
    <h1 class="certificates-title">{{ $t('certificates.title') }}</h1>
    <v-carousel cycle class="certificates-carousel">
      <v-carousel-item v-for="(certificate, index) in certificates" :key="index">
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
          <v-img :src="certificate.image" class="certificate-image"></v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </LabelContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'

interface Certificate {
  title: string
  description: string
  link: string
  image: string
}

const { tm } = useI18n()
// Safely access certificates array from i18n messages
const certificates = Array.isArray(tm('certificates'))
  ? (tm('certificates') as Certificate[])
  : (tm('certificates.content') as Certificate[]) || []
const mainStore = useMainStore()

const closeView = () => {
  console.log('Closing certificates view')
  ;(document.querySelector('.label-renderer') as HTMLElement).style.pointerEvents = 'auto'
  ;(document.querySelector('.inspect-view') as HTMLElement).style.pointerEvents = 'none'
  ;(document.querySelector('.menu-container') as HTMLElement).style.display = 'block'

  mainStore.hideCertificates()
  setTimeout(() => {
    // Avoid the click overlapping with PickHelper
    mainStore.enableMouseEvents()
  }, 100)
  mainStore.showNavigationMenu()
  mainStore.showAboutNavigation('experience')
}
</script>

<style scoped>
.certificates-carousel {
  width: 100%;
  height: 100%;
}
.certificates-title {
  font-weight: bold;
  width: 100%;
  text-align: center;
  background-color: black;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 20%;
}
.certificate-card {
  width: 100%;
  height: 100%;
  margin: auto;
}
.certificate-image {
  width: 100%;
  height: 100%;
}
</style>
