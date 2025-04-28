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

    shouldAllowMouseEvents: false,
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
    }
  },
  getters: {
    isHardSkillsVisible: (state) => state.showHardSkills,
    isSoftSkillsVisible: (state) => state.showSoftSkills,
    isProjectsVisible: (state) => state.showProjects,
    isAboutVisible: (state) => state.showAbout,
    isExperienceVisible: (state) => state.showExperience,
    isCertificatesVisible: (state) => state.showCertificates,
    isCreditsVisible: (state) => state.showCredits,
    isMouseEventsAllowed: (state) => state.shouldAllowMouseEvents
  }
});
