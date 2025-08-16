/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tween, Easing } from '@tweenjs/tween.js'
import { LoopOnce, MathUtils } from 'three'
import { useMainStore } from '../../components/store'
import { createAreaSelectors, removeAreaSelectors } from '../components/objects/cube'
import { createPngHeaders } from './png_loader'

// State variables
let isBookOpen = false
let isSocialsAreaActive = false
let isAboutAreaActive = false
let isAboutSkillsSubareaActive = false
let isAboutMainSubareaActive = false
let isAboutExperienceSubareaActive = false
let isProjectsAreaActive = false
let hoveredObjectTag = null
let bookFinishedListener = null

// For social icons
const gmailLink = 'jbecerraofficial@gmail.com'
const linkedinLink = 'https://www.linkedin.com/in/jd-becerra'
const githubLink = 'https://github.com/jd-becerra'
let hovSocialIcon = null
let hovSocialIconInitialY = null
let hovSocialIconInitialRotation = null
let hovSocialIconTick = null

// For About area (skills, about me, experience)
let hovHardSkill = null
let hovHardSkillInitialX = null
let hovHardSkillTick = null
const hardSkillIndexes = {
  'C++': 0,
  PHP: 1,
  Javascript: 2,
  MySQL: 3,
  Nodejs: 4,
  Linux: 5,
  Git: 6,
  English: 7,
}
const aboutX = -3,
  aboutZ = -50
const skillsPos = { x: aboutX, y: 3.5, z: aboutZ }
const aboutMePos = { x: aboutX, y: 0.5, z: aboutZ }
const experiencePos = { x: aboutX, y: -2.5, z: aboutZ }
let bookObject = null

function getCurrentLocale() {
  const mainStore = useMainStore()
  return mainStore.getLocale
}

function moveToArea(controls, loop, to, angles, minDist = 20, maxDist = 32) {
  controls.minDistance = minDist
  controls.maxDistance = maxDist

  const from = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z,
  }

  const t = new Tween(from)
    .to(to, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.target.set(from.x, from.y, from.z)
      controls.update()
    })
    .start()

  // Make second tween for polar and azimuth angles
  const fromAngles = {
    polar: [controls.minPolarAngle, controls.maxPolarAngle],
    azimuth: [controls.minAzimuthAngle, controls.maxAzimuthAngle],
  }
  const toAngles = {
    polar: [angles.yDown, angles.yUp], // Y axis
    azimuth: [angles.xLeft, angles.xRight], // X axis
  }

  const t2 = new Tween(fromAngles)
    .to(toAngles, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.minPolarAngle = fromAngles.polar[0]
      controls.maxPolarAngle = fromAngles.polar[1]
      controls.minAzimuthAngle = fromAngles.azimuth[0]
      controls.maxAzimuthAngle = fromAngles.azimuth[1]
      controls.update()
    })
    .start()

  loop.updatables.push({
    tick: (delta) => {
      t.update()
      t2.update()
    },
  })
}

function getAnimation(animations, name) {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i]
    if (animation.name === name) {
      return animation
    }
  }
  return null
}

function handleSocialsHover(object, loop, picker) {
  // Make the object bounce
  loop.updatables.push({
    tick: (delta) => {
      object.rotateY(delta * 0.5)
    },
  })
}

// Returns to the initial state of the scene
function handleReturnToMainView(controls, loop, scene) {
  removeAreaSelectors(scene)

  handleSocialIconHover(null, loop, scene)
  handleHardSkillsHover(null, loop, null)
  isBookOpen = false
  isSocialsAreaActive = false
  isAboutAreaActive = false
  isProjectsAreaActive = false

  const store = useMainStore()
  store.disableComputerVisible()
  store.setCurrentArea('main')

  // Return area selectors
  createAreaSelectors(scene, loop)
  const headersToRender = ['my_projects', 'professional_overview', 'contact_me']
  createPngHeaders(loop, scene, headersToRender, getCurrentLocale())

  const to = { x: 17, y: 4, z: 17 }
  const angles = {
    yDown: MathUtils.degToRad(80),
    yUp: MathUtils.degToRad(85),
    xLeft: MathUtils.degToRad(25),
    xRight: MathUtils.degToRad(40),
  }

  moveToArea(controls, loop, to, angles, 5, 10)
}

// Moves to the general projectsArea (the desk with computer)
function handleProjectsClick(controls, loop, scene) {
  removeAreaSelectors(scene)

  handleSocialIconHover(null, loop, scene)
  handleHardSkillsHover(null, loop, null)
  isBookOpen = false
  isSocialsAreaActive = false
  isAboutAreaActive = false
  isProjectsAreaActive = true

  const headersToRender = ['projects_expand']
  createPngHeaders(loop, scene, headersToRender, getCurrentLocale())

  const to = { x: -40, y: 0, z: -10 }

  const angles = {
    yUp: MathUtils.degToRad(95),
    yDown: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(80),
    xRight: MathUtils.degToRad(100),
  }
  moveToArea(controls, loop, to, angles)

  const store = useMainStore()
  store.enableComputerVisible()
  store.setCurrentArea('projects')
}

// Moves to the general Socials area (over the fireplace, with trophies (contact icons) and a plaque with credits)
function handleSocialsClick(controls, loop, scene) {
  removeAreaSelectors(scene)

  handleHardSkillsHover(null, loop, null)
  isBookOpen = false
  isAboutAreaActive = false
  isSocialsAreaActive = true
  isProjectsAreaActive = false

  const store = useMainStore()
  store.disableComputerVisible()
  store.setCurrentArea('socials')

  // Render header
  const headersToRender = ['credits', 'socials']
  createPngHeaders(loop, scene, headersToRender, getCurrentLocale())

  const to = { x: 15, y: 4, z: -42 }
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(92),
    xLeft: MathUtils.degToRad(-5),
    xRight: MathUtils.degToRad(5),
  }
  moveToArea(controls, loop, to, angles)
}

// Moves to the general About Me area (a bookcase with books, picture frames and a flower pot)
function handleAboutSubarea(controls, loop, scene, subarea = 'main') {
  const store = useMainStore()
  store.showAboutNavigation(subarea)

  isAboutAreaActive = true
  store.disableComputerVisible()

  if (subarea == 'main') store.setCurrentArea('about')
  else store.setCurrentArea(subarea)

  removeAreaSelectors(scene)

  handleSocialIconHover(null, loop, scene)
  isBookOpen = false
  isSocialsAreaActive = false
  isProjectsAreaActive = false
  let targetPos = aboutMePos
  let headersToRender = []
  if (subarea === 'main') {
    headersToRender = ['about']
  } else if (subarea === 'skills') {
    headersToRender = ['soft_skills', 'hard_skills']
    targetPos = skillsPos
  } else if (subarea === 'experience') {
    targetPos = experiencePos
    headersToRender = ['certificates', 'experience']
  } else {
    console.error('Invalid subarea to navigate:', subarea)
    return
  }
  createPngHeaders(loop, scene, headersToRender, getCurrentLocale())
  isAboutAreaActive = true
  setAboutSubareaActive(subarea)

  const to = targetPos
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(-2),
    xRight: MathUtils.degToRad(1),
  }
  moveToArea(controls, loop, to, angles, 31, 32)
}

function handleAboutClick(controls, loop, scene) {
  // The first subarea we navigate to is the main one
  handleAboutSubarea(controls, loop, scene, 'main')
}

function toggleIsSocialsActive() {
  isSocialsAreaActive = !isSocialsAreaActive
  return isSocialsAreaActive
}

function toggleIsAboutActive() {
  isAboutAreaActive = !isAboutAreaActive
  return isAboutAreaActive
}

function getActiveAboutSubarea() {
  if (isAboutMainSubareaActive) return 'main'
  if (isAboutSkillsSubareaActive) return 'skills'
  if (isAboutExperienceSubareaActive) return 'experience'
  return ''
}

function setAboutSubareaActive(subarea) {
  if (subarea === 'main') {
    isAboutMainSubareaActive = true
    isAboutSkillsSubareaActive = false
    isAboutExperienceSubareaActive = false
  } else if (subarea === 'skills') {
    isAboutMainSubareaActive = false
    isAboutSkillsSubareaActive = true
    isAboutExperienceSubareaActive = false
  } else if (subarea === 'experience') {
    isAboutMainSubareaActive = false
    isAboutSkillsSubareaActive = false
    isAboutExperienceSubareaActive = true
  }
}

function getIsAreaActive(area, subArea = '') {
  if (area === 'projects') {
    return isProjectsAreaActive
  } else if (area === 'socials') {
    return isSocialsAreaActive
  } else if (area === 'about') {
    if (subArea === '') {
      return isAboutAreaActive
    } else if (subArea === 'main') {
      return isAboutMainSubareaActive
    } else if (subArea === 'skills') {
      return isAboutSkillsSubareaActive
    } else if (subArea === 'experience') {
      return isAboutExperienceSubareaActive
    }
  }
  return false
}

function handleOpenBook(object) {
  if (isAboutExperienceSubareaActive || isAboutSkillsSubareaActive) return

  if (isBookOpen) {
    return
  }

  let parent = object.parent
  while (parent && !parent.mixer) {
    parent = parent.parent
  }
  if (!parent) {
    console.error('No parent with mixer found for object:', object.name)
    return
  }

  const mixer = parent.mixer

  if (!mixer || mixer == undefined) {
    console.error('No mixer found for object:', object.name)
    return
  }
  if (!mixer.animations || mixer.animations.length === 0) {
    console.error('No animations found for object:', object.name)
    return
  }

  // Determine which animation to play
  let bookAnimation = getAnimation(mixer.animations, 'Open')
  if (!bookAnimation) {
    console.error('No animation found for object:', object.name)
    return
  }
  isBookOpen = true

  if (!bookAnimation) {
    console.error('No animation found for object:', object.name)
    return
  }

  // Stop all other animations to prevent conflicts
  mixer.stopAllAction()

  const store = useMainStore()
  store.disableMouseEvents()
  setHoveredObjectTag(null)
  store.hideAboutNavigation()

  // Play the new animation
  const animation = mixer.clipAction(bookAnimation, mixer.target)
  animation.setLoop(LoopOnce)
  animation.clampWhenFinished = true
  animation.reset().play() // Ensure animation starts fresh

  if (bookObject === null) {
    bookObject = object
  }

  store.hideNavigationMenu()
  store.hideAboutNavigation()

  // Wait for the animation to finish (remember to remove previous listeners)
  if (bookFinishedListener) {
    mixer.removeEventListener('finished', bookFinishedListener)
    bookFinishedListener = null
  }

  bookFinishedListener = () => {
    // Stop the animation to reset to the original state
    animation.stop()

    isBookOpen = !isBookOpen
    document.querySelector('.label-renderer').style.pointerEvents = 'none'
    document.querySelector('.inspect-view').style.pointerEvents = 'auto'
    store.triggerShowAbout()

    // After listener fires, remove it
    mixer.removeEventListener('finished', bookFinishedListener)
    bookFinishedListener = null
  }

  mixer.addEventListener('finished', bookFinishedListener)
}

function handleSocialIconClick(iconName, loop) {
  if (iconName == 'Gmail') {
    _removeSocialIconTick(loop)
    window.open(`mailto:${gmailLink}`, '_blank')
  } else if (iconName == 'LinkedIn') {
    _removeSocialIconTick(loop)
    window.open(linkedinLink, '_blank')
  } else if (iconName == 'Github') {
    _removeSocialIconTick(loop)
    window.open(githubLink, '_blank')
  }
}

function handleSocialIconHover(newHoveredObject, loop, scene) {
  // If already hovering the same object, return early
  if (hovSocialIcon === newHoveredObject) return

  // Reset previous hovered child
  if (hovSocialIcon && hovSocialIconInitialY !== null) {
    const prevChild = scene.getObjectByName(hovSocialIcon.name + '-Icon')
    if (prevChild) {
      prevChild.position.y = hovSocialIconInitialY
      prevChild.rotation.y = hovSocialIconInitialRotation
    }
  }

  // Remove previous animation
  if (hovSocialIconTick) {
    const index = loop.updatables.indexOf(hovSocialIconTick)
    if (index > -1) loop.updatables.splice(index, 1)
    hovSocialIconTick = null
  }

  hovSocialIcon = newHoveredObject

  // If hovering a valid object in the socials area
  if (hovSocialIcon && hovSocialIcon.area === 'socials') {
    const childToRotate = scene.getObjectByName(hovSocialIcon.name + '-Icon')
    if (!childToRotate) return

    hovSocialIconInitialY = childToRotate.position.y
    hovSocialIconInitialRotation = childToRotate.rotation.y

    let time = 0
    const threshold = 0.5

    hovSocialIconTick = {
      tick: (delta) => {
        if (!childToRotate) return // Defensive check

        time += delta
        const distance = delta * 3

        // Bounce then rotate
        if (childToRotate.position.y < hovSocialIconInitialY + threshold) {
          childToRotate.position.y += distance
        } else {
          childToRotate.rotation.y += delta
        }
      },
    }

    loop.updatables.push(hovSocialIconTick)
    document.body.style.cursor = 'pointer'
  } else {
    // Reset all references
    hovSocialIcon = null
    hovSocialIconInitialY = null
    hovSocialIconInitialRotation = null
    document.body.style.cursor = 'default'
  }
}

function handleHardSkillsHover(newHoveredObject, loop, mousePosition) {
  if (hovHardSkill === newHoveredObject) {
    // Update tag position if already hovering the same item
    if (hoveredObjectTag) {
      const offsetX = 40
      const offsetY = 30
      hoveredObjectTag.style.left = `${mousePosition.x + offsetX}px`
      hoveredObjectTag.style.top = `${mousePosition.y + offsetY}px`
    }
    return
  }

  // Reset previous
  if (hovHardSkill && hovHardSkillInitialX != null) {
    hovHardSkill.position.x = hovHardSkillInitialX
  }

  if (hovHardSkillTick) {
    const index = loop.updatables.indexOf(hovHardSkillTick)
    if (index > -1) {
      loop.updatables.splice(index, 1)
    }
  }

  if (hoveredObjectTag) {
    hoveredObjectTag.remove()
    hoveredObjectTag = null
  }

  hovHardSkill = newHoveredObject

  if (hovHardSkill) {
    hovHardSkillInitialX = hovHardSkill.position.x
    const threshold = 0.3

    hovHardSkillTick = {
      tick: (delta) => {
        if (hovHardSkill.position.x > hovHardSkillInitialX - threshold) {
          hovHardSkill.position.x -= delta * 2
        }
      },
    }
    loop.updatables.push(hovHardSkillTick)

    hoveredObjectTag = setHoveredObjectTag(hovHardSkill.name, (mousePosition = { x: 0, y: 0 }))
  } else {
    hovHardSkillInitialX = null
    hovHardSkillTick = null
  }
}

function canSetHoveredObject(objectArea) {
  // These conditions must be false to allow setting a hovered object tag
  return !(
    (objectArea == 'about_skills' && !isAboutSkillsSubareaActive) ||
    (objectArea == 'about_main' && !isAboutMainSubareaActive) ||
    (objectArea == 'about_experiences' && !isAboutExperienceSubareaActive) ||
    (objectArea == 'socials' && !isSocialsAreaActive) ||
    (objectArea == 'credits' && !isSocialsAreaActive)
  )
}

function setHoveredObjectTag(name, mousePosition, objectArea = '') {
  // Remove all tags in class hover-tag
  const tags = document.getElementsByClassName('hover-tag')
  for (let i = 0; i < tags.length; i++) {
    tags[i].remove()
  }

  // If name is null, return
  if (!name || !canSetHoveredObject(objectArea)) {
    document.body.style.cursor = 'default'
    return null
  }

  const tag = document.createElement('div')
  tag.className = 'hover-tag'
  let tagName = name.replace(/_/g, ' ') // Replace underscores with spaces
  // Some special cases
  if (tagName == 'Nodejs') tagName = 'Node.js'
  else if (tagName == 'More') tagName = 'More...'
  tag.innerHTML = tagName
  tag.style.position = 'absolute'
  tag.style.pointerEvents = 'none'
  tag.style.zIndex = '100'
  tag.style.transition = 'opacity 0.3s ease-in-out'
  tag.style.opacity = '1'
  tag.style.fontSize = '16px'
  tag.style.color = 'white'
  tag.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
  tag.style.padding = '5px 10px'
  tag.style.borderRadius = '5px'
  tag.style.whiteSpace = 'nowrap'
  tag.style.transform = 'translate(-50%, -50%)'

  const offsetX = 40
  const offsetY = 30
  tag.style.left = `${mousePosition.x + offsetX}px`
  tag.style.top = `${mousePosition.y + offsetY}px`

  document.body.appendChild(tag)
  return tag
}

function setupVueInspectView() {
  const store = useMainStore()
  store.disableMouseEvents()
  setHoveredObjectTag(null)

  document.querySelector('.label-renderer').style.pointerEvents = 'none'
  document.querySelector('.inspect-view').style.pointerEvents = 'auto'
  store.hideNavigationMenu()
  store.hideAboutNavigation()

  return store
}

function handleSkillsClick(skillName, loop) {
  if (isAboutMainSubareaActive || isAboutExperienceSubareaActive) return

  const store = setupVueInspectView()

  // Overwrite array for panel selection to hold just the index of the clicked skill
  if (skillName === 'Soft_Skills') {
    store.triggerShowSoftSkills()
  } else {
    store.triggerShowHardSkills()
    store.setPanelHardSkills([hardSkillIndexes[skillName]])
  }
}

function handleExperienceClick(object) {
  if (isAboutMainSubareaActive || isAboutSkillsSubareaActive) return

  const store = setupVueInspectView()

  if (object.name === 'Certificates') {
    store.triggerShowCertificates()
  } else if (object.name === 'Experience') {
    store.triggerShowExperience()
  } else {
    console.error('Unknown experience object clicked')
  }
}

function handleCreditsClick(loop) {
  const store = setupVueInspectView()

  if (!store.isCreditsVisible) store.triggerShowCredits()
}

function handleProjectsExpandClick() {
  const store = setupVueInspectView()
  store.triggerShowProjects()
}

function _removeSocialIconTick(loop) {
  if (hovSocialIconTick && loop.updatables.includes(hovSocialIconTick)) {
    const index = loop.updatables.indexOf(hovSocialIconTick)
    if (index > -1) loop.updatables.splice(index, 1)
  }
}

export {
  handleReturnToMainView,
  handleProjectsClick,
  handleSocialsClick,
  handleAboutClick,
  handleAboutSubarea,
  handleSocialsHover,
  handleSocialIconClick,
  handleSocialIconHover,
  handleHardSkillsHover,
  handleSkillsClick,
  handleExperienceClick,
  handleCreditsClick,
  handleProjectsExpandClick,
  toggleIsSocialsActive,
  toggleIsAboutActive,
  getIsAreaActive,
  handleOpenBook,
  getActiveAboutSubarea,
  setHoveredObjectTag,
  canSetHoveredObject,
}
