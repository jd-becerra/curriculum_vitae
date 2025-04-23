import { LoadingManager } from "three";
import { useI18n } from 'vue-i18n';


function createLoadingManager() {
  const manager = new LoadingManager();
  const { t } = useI18n();
  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url);
  };

  manager.onLoad = function () {
    console.log('All items loaded.');
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  };

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const loadingBar = document.querySelector(".loading-bar"); // Assume you have a child div inside .loading
    const loadingText = document.querySelector(".loading-description"); // Assume you have a child div inside .loading

    if (loadingText) {

      loadingText.innerHTML = `[${itemsLoaded}/${itemsTotal}] ${t('scene-renderer.progress')}`;
    }

    if (loadingBar) {
      loadingBar.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
    }
  };

  manager.onError = function (url) {
    console.error('There was an error loading ' + url);
  };

  return manager;
}

export { createLoadingManager };
