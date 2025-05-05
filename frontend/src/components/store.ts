import { defineStore } from 'pinia';

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

    // Navigation buttons for the About section
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

    locale: 'en',
  }),
  actions: {
    // Show elements
    triggerShowHardSkills() {
      this.showHardSkills = true;

      // Set all other elements to false
      this.showSoftSkills = false;
      this.showProjects = false;
      this.showAbout = false;
      this.showExperience = false;
      this.showCertificates = false;
      this.showCredits = false;
    },
    triggerShowSoftSkills() {
      this.showSoftSkills = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showProjects = false;
      this.showAbout = false;
      this.showExperience = false;
      this.showCertificates = false;
      this.showCredits = false;
    },
    triggerShowProjects() {
      this.showProjects = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showSoftSkills = false;
      this.showAbout = false;
      this.showExperience = false;
      this.showCertificates = false;
      this.showCredits = false;
    },
    triggerShowAbout() {
      this.showAbout = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showSoftSkills = false;
      this.showProjects = false;
      this.showExperience = false;
      this.showCertificates = false;
      this.showCredits = false;
    },
    triggerShowExperience() {
      this.showExperience = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showSoftSkills = false;
      this.showProjects = false;
      this.showAbout = false;
      this.showCertificates = false;
      this.showCredits = false;
    },
    triggerShowCertificates() {
      this.showCertificates = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showSoftSkills = false;
      this.showProjects = false;
      this.showAbout = false;
      this.showExperience = false;
      this.showCredits = false;
    },
    triggerShowCredits() {
      this.showCredits = true;

      // Set all other elements to false
      this.showHardSkills = false;
      this.showSoftSkills = false;
      this.showProjects = false;
      this.showAbout = false;
      this.showExperience = false;
      this.showCertificates = false;
    },
    enableMouseEvents() {
      this.shouldAllowMouseEvents = true;

      const labelRenderer = document.querySelector('.label-renderer') as HTMLElement;
      if (labelRenderer){
        labelRenderer.style.pointerEvents = "auto";
      }

      // Set all elements in class "vue-label-3d" to pointer-events: auto
      const labels = document.querySelectorAll('.vue-label-3d');
      labels.forEach((label) => {
        (label as HTMLElement).style.pointerEvents = "auto";
      });
    },
    showNavigationMenu() {
      this.navigationMenuVisible = true;
    },

    // Hide elements
    hideHardSkills() {
      this.showHardSkills = false;
    },
    hideSoftSkills() {
      this.showSoftSkills = false;
    },
    hideProjects() {
      this.showProjects = false;
    },
    hideAbout() {
      this.showAbout = false;
    },
    hideExperience() {
      this.showExperience = false;
    },
    hideCertificates() {
      this.showCertificates = false;
    },
    hideCredits() {
      this.showCredits = false;
    },
    disableMouseEvents() {
      this.shouldAllowMouseEvents = false;

      const labelRenderer = document.querySelector('.label-renderer') as HTMLElement;
      if (labelRenderer){
        labelRenderer.style.pointerEvents = "none";
      }

      // Set all elements in class "3d-vue-label" to pointer-events: none
      const labels = document.querySelectorAll('.vue-label-3d');
      labels.forEach((label) => {
        (label as HTMLElement).style.pointerEvents = "none";
      });
    },
    hideNavigationMenu() {
      this.navigationMenuVisible = false;
    },
    emptyPanelHardSkills() {
      this.panelHardSkills = [];
    },

    setLocale(locale: string) {
      this.locale = locale;
    },
    setPanelHardSkills(panelHardSkills: any) {
      this.panelHardSkills = panelHardSkills;
    },
    setClickDelay(delay: boolean) {
      this.delayClick = delay;
    }
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
    getLocale: (state) => state.locale,
    getPanelHardSkills: (state) => state.panelHardSkills,
    shouldDelayClick: (state) => state.delayClick
  }
});
