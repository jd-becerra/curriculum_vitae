<template>
  <LabelContainer @close="closeView">
    <h1 class="certificates-title">{{ $t('certificates.title') }}</h1>
    <div class="carousel-container">
      <v-carousel
        cycle
        class="certificates-carousel"
        hide-delimiter-background
        color="black"
        show-arrows="hover"
        @mouseenter="showDescriptions = true"
        @mouseleave="showDescriptions = false"
      >
        <v-carousel-item
          class="certificate-item"
          v-for="(certificate, index) in certificates"
          :key="index"
          cover
          @click="showExpandedImage(certificate.image)"
        >
          <v-img :src="`/img/certs/${certificate.image}`" class="certificate-image">
            <v-overlay v-if="showDescriptions" absolute>
              <div class="certificate-overlay">
                <p>
                  <strong>{{ certificate.title }}</strong>
                </p>
                <p>
                  {{ certificate.description }}
                </p>
                <a v-if="certificate.link" :href="certificate.link" target="_blank" @click.stop>
                  <u>{{ $t('certificates.goto-link') }}</u>
                </a>
              </div>
            </v-overlay>
          </v-img>

          <v-img src="/icons/expand.svg" class="expand-icon" />
        </v-carousel-item>
      </v-carousel>
      <p class="expand-text">{{ $t('certificates.expand') }}</p>
    </div>
    <div v-if="expandImage" class="expand-image">
      <v-img v-if="currentImage" :src="currentImage" @click.stop.prevent="hideExpandedImage" />
      <v-img src="/icons/hide.svg" class="hide-icon" @click="hideExpandedImage" />
    </div>
  </LabelContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../store'
import LabelContainer from '../LabelContainer.vue'
import '../../assets/base.css'
import { ref, watch } from 'vue'

interface Certificate {
  title: string
  description: string
  link: string
  image: string
}

const { tm } = useI18n()
// Safely access certificates array from i18n messages
const certificates = ref<Array<Certificate>>((tm('certificates.content') as Certificate[]) || [])
const showDescriptions = ref<boolean>(true)

watch(
  () => tm('certificates.content'),
  (newCertificates) => {
    certificates.value = newCertificates as Certificate[]
  },
)

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

const expandImage = ref<boolean>(false)
const currentImage = ref<string | null>(null)

const showExpandedImage = (image: string) => {
  expandImage.value = true
  currentImage.value = `/img/certs/${image}`
  mainStore.disableInfoPanel()
}
const hideExpandedImage = () => {
  expandImage.value = false
  currentImage.value = null
}
</script>

<style scoped>
.certificates-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.certificates-title {
  font-weight: bold;
  height: 20%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
}
.hide-descriptions-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: end;
  margin: 0.5rem;
}
.hide-descriptions-btn {
  border: 1px solid black;
  border-radius: var(--border-radius);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  position: absolute;
  right: 15%;
  top: 15%;
  z-index: 10;
}
.certificates-carousel {
  width: 100%;
  height: 100%;
}
.carousel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;

  margin-top: 2rem;
}
.certificate-overlay {
  background-color: rgba(39, 39, 39, 0.9);
  color: white;
  padding: 1.5rem;
  font-weight: bold;
  text-align: center;
}
.certificate-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.expand-image {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: black;
}
.expand-text {
  width: 100%;
  text-align: right;
  margin-top: 1rem;
}
.expand-icon {
  width: 24px;
  height: 24px;
  padding: 1rem;
  position: absolute;
  bottom: 5%;
  right: 20%;
  z-index: 10;
  background-color: rgba(10, 10, 10, 0.8);
  border-radius: 5px;
  object-fit: contain;
}
.certificate-item:hover .expand-icon {
  transform: scale(1.25); /* grow icon when hovering anywhere on the panel */
}
.hide-icon {
  width: 32px;
  height: 32px;
  padding: 1rem;
  position: absolute;
  top: 15%;
  right: 15%;
  z-index: 1000;
  background-color: rgba(10, 10, 10, 0.6);
  border-radius: 5px;
  object-fit: contain;
}
.expand-image:hover .hide-icon {
  transform: scale(1.25); /* grow icon when hovering on the expanded image */
}
</style>
