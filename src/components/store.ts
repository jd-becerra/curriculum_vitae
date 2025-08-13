import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    showHardSkills: false,
    showSoftSkills: false,
    showProjects: false,
    showAbout: false,
    showExperience: false,
    showCertificates: false,
    showCredits: false,

    navigationMenuVisible: false,
    shouldOpenNavigationMenu: false,
    infoPanelVisible: false,
    showSettingsMenu: false,
    showDownloadCV: false,

    // Navigation buttons for the About section
    aboutNavigationVisible: false,
    // Skills section
    moveDownToAbout: false,
    // About me section (main)
    moveUpToSkills: false,
    moveDownToExperience: false,
    // Experience section
    moveUpToAbout: false,

    shouldAllowMouseEvents: false,
    // Since the mouse events don't wait for the click to be released, we need an aditional variable to delay the click
    delayClick: false,

    panelHardSkills: [],

    // PickHelper handles mouse evenets on Three.js scene
    pickHelper: null as unknown,
    outlinePass: null as unknown, // so the pickHelper can highlight outlines of objects
    scene: null as unknown, // to access the scene in the pickHelper

    computerVisible: false,
    currentProjectIndex: 0,

    showPngHeadersLoading: false,

    // Cursor
    cursorCircleVisible: false,

    locale: localStorage.getItem('locale') || 'en', // Default to English if no locale is set
  }),
  actions: {
    // Show elements
    triggerShowHardSkills() {
      this.showHardSkills = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showSoftSkills = false
      this.showProjects = false
      this.showAbout = false
      this.showExperience = false
      this.showCertificates = false
      this.showCredits = false
    },
    triggerShowSoftSkills() {
      this.showSoftSkills = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showProjects = false
      this.showAbout = false
      this.showExperience = false
      this.showCertificates = false
      this.showCredits = false
    },
    triggerShowProjects() {
      this.showProjects = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showSoftSkills = false
      this.showAbout = false
      this.showExperience = false
      this.showCertificates = false
      this.showCredits = false
    },
    triggerShowAbout() {
      this.showAbout = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showSoftSkills = false
      this.showProjects = false
      this.showExperience = false
      this.showCertificates = false
      this.showCredits = false
    },
    triggerShowExperience() {
      this.showExperience = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showSoftSkills = false
      this.showProjects = false
      this.showAbout = false
      this.showCertificates = false
      this.showCredits = false
    },
    triggerShowCertificates() {
      this.showCertificates = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showSoftSkills = false
      this.showProjects = false
      this.showAbout = false
      this.showExperience = false
      this.showCredits = false
    },
    triggerShowCredits() {
      this.showCredits = true
      this.aboutNavigationVisible = false
      this.showDownloadCV = false

      // Set all other elements to false
      this.showHardSkills = false
      this.showSoftSkills = false
      this.showProjects = false
      this.showAbout = false
      this.showExperience = false
      this.showCertificates = false
    },
    enableMouseEvents() {
      if (this.showPngHeadersLoading) return

      this.shouldAllowMouseEvents = true
      this.cursorCircleVisible = true

      const labelRenderer = document.querySelector('.label-renderer') as HTMLElement
      if (labelRenderer) {
        labelRenderer.style.pointerEvents = 'auto'
      }

      // Set all elements in class "vue-label-3d" to pointer-events: auto
      const labels = document.querySelectorAll('.vue-label-3d')
      labels.forEach((label) => {
        ;(label as HTMLElement).style.pointerEvents = 'auto'
      })
    },
    showNavigationMenu() {
      this.navigationMenuVisible = true
    },
    openNavigationMenu() {
      this.shouldOpenNavigationMenu = true
      this.delayClick = true
    },
    showAboutNavigation(subarea = 'main') {
      this.aboutNavigationVisible = true

      if (subarea === 'main') {
        this.moveUpToSkills = true
        this.moveDownToExperience = true

        this.moveDownToAbout = false
        this.moveUpToAbout = false
      } else if (subarea === 'skills') {
        this.moveDownToAbout = true

        this.moveUpToSkills = false
        this.moveDownToExperience = false
        this.moveUpToAbout = false
      } else if (subarea === 'experience') {
        this.moveUpToAbout = true

        this.moveDownToAbout = false
        this.moveUpToSkills = false
        this.moveDownToExperience = false
      }
    },
    enableComputerVisible() {
      this.computerVisible = true
    },
    showCursorCircle() {
      this.cursorCircleVisible = true
    },
    enableInfoPanel() {
      this.infoPanelVisible = true
      this.disableMouseEvents()
      this.showDownloadCV = false
      this.showSettingsMenu = false
      this.delayClick = true

      // Remove elements in class "hover-tag" (created by mouse_events.js)
      const hoverTags = document.querySelectorAll('.hover-tag')
      hoverTags.forEach((tag) => {
        tag.parentNode?.removeChild(tag)
      })
    },
    enableDownloadCV() {
      this.showDownloadCV = true
    },
    enableSettingsMenu() {
      this.showSettingsMenu = true
    },
    triggerShowPngHeadersLoading() {
      this.navigationMenuVisible = false
      this.aboutNavigationVisible = false
      this.shouldOpenNavigationMenu = false

      this.showPngHeadersLoading = true
      this.cursorCircleVisible = false

      this.disableMouseEvents()
    },

    // Hide elements
    hideHardSkills() {
      this.showHardSkills = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideSoftSkills() {
      this.showSoftSkills = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideProjects() {
      this.showProjects = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideAbout() {
      this.showAbout = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideExperience() {
      this.showExperience = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideCertificates() {
      this.showCertificates = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    hideCredits() {
      this.showCredits = false
      this.aboutNavigationVisible = true
      this.showDownloadCV = true
    },
    disableMouseEvents() {
      this.shouldAllowMouseEvents = false
      this.cursorCircleVisible = false

      const labelRenderer = document.querySelector('.label-renderer') as HTMLElement
      if (labelRenderer) {
        labelRenderer.style.pointerEvents = 'none'
      }

      // Set all elements in class "3d-vue-label" to pointer-events: none
      const labels = document.querySelectorAll('.vue-label-3d')
      labels.forEach((label) => {
        ;(label as HTMLElement).style.pointerEvents = 'none'
      })
      document.body.style.cursor = 'default'
    },
    hideNavigationMenu() {
      this.navigationMenuVisible = false
    },
    closeNavigationMenu() {
      this.shouldOpenNavigationMenu = false
    },
    hideAboutNavigation() {
      this.aboutNavigationVisible = false

      this.moveDownToAbout = false
      this.moveUpToSkills = false
      this.moveDownToExperience = false
      this.moveUpToAbout = false
    },
    emptyPanelHardSkills() {
      this.panelHardSkills = []
    },
    disableComputerVisible() {
      this.computerVisible = false
    },
    hideCursorCircle() {
      this.cursorCircleVisible = false
    },
    disableInfoPanel() {
      this.infoPanelVisible = false
      this.showSettingsMenu = true

      // If Vue labels are open, don't enable mouse events
      if (!this.isVueLabelOpen) {
        this.showDownloadCV = true
        this.enableMouseEvents()
      }
    },
    disableDownloadCV() {
      this.showDownloadCV = false
    },
    disableSettingsMenu() {
      this.showSettingsMenu = false
    },
    hidePngHeadersLoading() {
      this.showPngHeadersLoading = false

      if (this.isVueLabelOpen) return;

      this.navigationMenuVisible = true
      this.aboutNavigationVisible = true
      this.shouldOpenNavigationMenu = false
      this.cursorCircleVisible = true

      setTimeout(() => {
        // To avoid the click event being triggered immediately after the loading animation is hidden
        this.enableMouseEvents()
      }, 50)
    },

    // Setters
    setLocale(locale: string) {
      this.locale = locale
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPanelHardSkills(panelHardSkills: any) {
      this.panelHardSkills = panelHardSkills
    },
    setClickDelay(delay: boolean) {
      this.delayClick = delay
    },
    initializePickHelper(pickHelper: unknown) {
      this.pickHelper = pickHelper
    },
    setOutlinePass(outlinePass: unknown) {
      this.outlinePass = outlinePass
    },
    set3DScene(scene: unknown) {
      this.scene = scene
    },
    setCurrentProjectIndex(index: number) {
      this.currentProjectIndex = index
    },
  },
  getters: {
    isHardSkillsVisible: (state) => state.showHardSkills,
    isSoftSkillsVisible: (state) => state.showSoftSkills,
    isProjectsVisible: (state) => state.showProjects,
    isAboutMeVisible: (state) => state.showAbout,
    isExperienceVisible: (state) => state.showExperience,
    isCertificatesVisible: (state) => state.showCertificates,
    isCreditsVisible: (state) => state.showCredits,
    isMouseEventsAllowed: (state) => state.shouldAllowMouseEvents,
    isNavigationMenuVisible: (state) => state.navigationMenuVisible,
    isNavigationMenuOpen: (state) => state.shouldOpenNavigationMenu,
    isInfoPanelVisible: (state) => state.infoPanelVisible,
    isSettingsMenuVisible: (state) => state.showSettingsMenu,
    isDownloadCVVisible: (state) => state.showDownloadCV,
    isComputerVisible: (state) => state.computerVisible,
    getLocale: (state) => state.locale,
    getPanelHardSkills: (state) => state.panelHardSkills,
    shouldDelayClick: (state) => state.delayClick,
    isAboutNavigationVisible: (state) => state.aboutNavigationVisible,
    getPickHelper: (state) => state.pickHelper,
    getOutlinePass: (state) => state.outlinePass,
    get3DScene: (state) => state.scene,
    getSelectedProjectIndex: (state) => state.currentProjectIndex,
    isPngHeadersLoadingVisible: (state) => state.showPngHeadersLoading,
    isVueLabelOpen: (state) => {
      return (
        state.showHardSkills ||
        state.showSoftSkills ||
        state.showProjects ||
        state.showAbout ||
        state.showExperience ||
        state.showCertificates ||
        state.showCredits
      )
    },
  },
})
