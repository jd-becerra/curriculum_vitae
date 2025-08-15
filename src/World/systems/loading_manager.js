import { LoadingManager } from 'three'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '../../components/store'

function createLoadingManager() {
  const manager = new LoadingManager()
  const { t } = useI18n()
  const store = useMainStore()
  manager.onStart = function () {
    store.disableMouseEvents()
    store.disableInfoPanel()
    store.disableInfoButton()
    store.hideNavigationMenu()
  }

  manager.onLoad = function () {
    // console.log('All items loaded.');
    const loadingElement = document.querySelector('.loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
    }
    store.enableInfoPanel()
    store.disableMouseEvents() // Only enable them when user clicks out of the info panel
  }

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    // Assume you have a child div inside .loading
    const loadingBar = document.querySelector('.loading-bar')
    const loadingText = document.querySelector('.loading-description')

    if (loadingText) {
      loadingText.innerHTML = `(${itemsLoaded}/${itemsTotal}) ${t('scene-renderer.progress')}`
    }

    if (loadingBar) {
      loadingBar.style.width = `${(itemsLoaded / itemsTotal) * 100}%`
    }
  }

  manager.onError = function (url) {
    console.error('There was an error loading ' + url)
  }

  return manager
}

export { createLoadingManager }
