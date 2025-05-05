import {Tween, Easing} from '@tweenjs/tween.js';
import {
  LoopOnce,
  TextureLoader,
  PlaneGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
} from 'three';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '../../components/store';
import { createAreaSelectors, removeAreaSelectors } from '../components/objects/cube';

// State variables
let isBookOpen = false;
let isSocialsAreaActive = false;
let isAboutAreaActive = false;
let isAboutSkillsSubareaActive = false;
let isAboutMainSubareaActive = false;
let isAboutExperienceSubareaActive = false;
let hoveredObjectTag = null;

// For social icons
const gmailLink = "jbecerraofficial@gmail.com";
const linkedinLink = "https://www.linkedin.com/in/jes%C3%BAs-david-becerra-063694310/";
const githubLink = "https://github.com/jd-becerra";
let hovSocialIcon = null;
let hovSocialIconInitialY = null;
let hovSocialIconInitialRotation = null;
let hovSocialIconTick = null;

// For About area (skills, about me, experience)
let hovHardSkill = null;
let hovHardSkillInitialX = null;
let hovHardSkillTick = null;
const hardSkillIndexes = {
  "C++": 0,
  "Python": 1,
  "Javascript": 2,
  "HTML_+_CSS": 3,
  "MySQL": 4,
  "Nodejs": 5,
  "Linux": 6,
  "Git": 7,
  "Frontend_Frameworks": 8,
  "English": 9,
  "Chinese": 10,
  "More": 11
}
const skillsPos = {x: -3, y: 3.5, z: -49};
const aboutMePos = {x: -3, y: 0.5, z: -49};
const experiencePos = {x: -3, y: 1.5, z: -49};
// Headers that can be rendered
let headersToRender = [];
let lang = 'en';

// Three.js helpers
const textureLoader = new TextureLoader();

function getCurrentLocale() {
  const mainStore = useMainStore();
  return mainStore.getLocale;
}

function getHeadersByLang(locale) {
  const basePath = `img/section_headers/${locale}`;

  return {
    "about": {
      path: `${basePath}/about_me.png`,
      name: "About Me Section",
      position: {x: -1.6, y: 2, z: -26},
    },
    "certificates": {
      path: `${basePath}/certificates.png`,
      name: "Certificates Section",
      position: {x: -5.1, y: -5, z: -26},
    },
    "experience": {
      path: `${basePath}/experience.png`,
      name: "Experience Section",
      position: {x: -1.6, y: -5, z: -26},
    },
    "soft_skills": {
      path: `${basePath}/soft_skills.png`,
      name: "Soft Skills Section",
      position: {x: -1.6, y: 5.2, z: -26},
    },
    "hard_skills": {
      path: `${basePath}/hard_skills.png`,
      name: "Hard Skills Section",
      position: {x: -5.1, y: 5.2, z: -26},
    },
  };
}

function reloadHeadersOnLangChange(loop, scene, headersToRender, locale) {
  removePngHeaders(scene); // Ensure old headers are removed
  createPngHeaders(loop, scene, headersToRender, locale); // Load new ones
}

function moveToArea(controls, loop, to, angles, minDist = 20, maxDist = 32) {
  controls.minDistance = minDist;
  controls.maxDistance = maxDist;

  const from = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
  };

  const t = new Tween(from)
    .to(to, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.target.set(from.x, from.y, from.z);
      controls.update();
    })
    .start();

  // Make second tween for polar and azimuth angles
  const fromAngles = {
    polar: [controls.minPolarAngle, controls.maxPolarAngle],
    azimuth: [controls.minAzimuthAngle, controls.maxAzimuthAngle]
  };
  const toAngles = {
    polar: [angles.yDown, angles.yUp], // Y axis
    azimuth: [angles.xLeft, angles.xRight] // X axis
  };

  const t2 = new Tween(fromAngles)
    .to(toAngles, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.minPolarAngle = fromAngles.polar[0];
      controls.maxPolarAngle = fromAngles.polar[1];
      controls.minAzimuthAngle = fromAngles.azimuth[0];
      controls.maxAzimuthAngle = fromAngles.azimuth[1];
      controls.update();
    })
    .start();


  loop.updatables.push({
    tick: (delta) => {
      t.update();
      t2.update();
    }
  });
}

function loadPngHeader(url, name, pos, scale, loop, scene) {
  const geometry = new PlaneGeometry(scale.x, scale.y);
  const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true });
  const header = new Mesh(geometry, material);
  header.name = name;

  header.position.set(pos.x, pos.y, pos.z);

  textureLoader.load(url, (texture) => {
    header.material.map = texture;
    header.material.needsUpdate = true;
  });

  // Add tick to make it bounce
  let elapsed = 0;
  const bounceHeight = 0.1;
  const bounceSpeed = 3;
  const initialY = header.position.y;
  loop.updatables.push({
    tick: (delta) => {
      elapsed += delta;
      const y = initialY + Math.sin(elapsed * bounceSpeed) * bounceHeight;
      header.position.set(pos.x, y, pos.z);
    }
  });

  scene.add(header);
}

function getAnimation(animations, name) {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    if (animation.name === name) {
      return animation;
    }
  }
  return null;
}

function handleSocialsHover(object, loop, picker) {
  // Make the object bounce
  loop.updatables.push({
    tick: (delta) => {
      object.rotateY(delta * 0.5);
    }
  });

}

// Returns to the initial state of the scene
function handleReturnToMainView(controls, loop, scene) {
  removeAreaSelectors(scene);

  handleSocialIconHover(null, loop);
  handleHardSkillsHover(null, loop, null);
  isBookOpen = false;
  isSocialsAreaActive = false;
  isAboutAreaActive = false;

  // Return area selectors
  createAreaSelectors(scene);

  const to = {x: 17, y: 4, z: 17};
  const angles = {
    yDown: MathUtils.degToRad(80),
    yUp: MathUtils.degToRad(85),
    xLeft: MathUtils.degToRad(30),
    xRight: MathUtils.degToRad(35)
  }

  moveToArea(controls, loop, to, angles, 5, 10);
}

// Moves to the general Projects area (the desk with computer)
function handleProjectsClick(controls, loop, scene) {
  removeAreaSelectors(scene);

  handleSocialIconHover(null, loop);
  handleHardSkillsHover(null, loop, null);
  isBookOpen = false;
  isSocialsAreaActive = false;
  isAboutAreaActive = false;

  const to = {x: -40, y: 0, z: -10};

  const angles = {
    yUp: MathUtils.degToRad(95),
    yDown: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(80),
    xRight: MathUtils.degToRad(100)
  }
  moveToArea(controls, loop, to, angles);
}

// Moves to the general Socials area (over the fireplace, with trophies (contact icons) and a plaque with credits)
function handleSocialsClick(controls, loop, scene) {
  removeAreaSelectors(scene);

  handleHardSkillsHover(null, loop, null);
  isBookOpen = false;
  isAboutAreaActive = false;

  isSocialsAreaActive = true;

  const to = {x: 15, y: 4, z: -42};
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(92),
    xLeft: MathUtils.degToRad(-5),
    xRight: MathUtils.degToRad(5)
  }
  moveToArea(controls, loop, to, angles);
}

function removePngHeaders(scene) {
  const hardSkillsHeader = scene.getObjectByName("Hard Skills Section");
  if (hardSkillsHeader) {
    scene.remove(hardSkillsHeader);
  }

  const softSkillsHeader = scene.getObjectByName("Soft Skills Section");
  if (softSkillsHeader) {
    scene.remove(softSkillsHeader);
  }

  const aboutHeader = scene.getObjectByName("About Me Section");
  if (aboutHeader) {
    scene.remove(aboutHeader);
  }

  const experienceHeader = scene.getObjectByName("Experience Section");
  if (experienceHeader) {
    scene.remove(experienceHeader);
  }

  const certificatesHeader = scene.getObjectByName("Certificates Section");
  if (certificatesHeader) {
    scene.remove(certificatesHeader);
  }
}

function createPngHeaders(loop, scene, headersToRender) {
  lang = getCurrentLocale();

  const planeSize = {x: 3, y: 1.5};
  const headers = getHeadersByLang(lang);

  headersToRender.forEach(key => {
    const header = headers[key];
    loadPngHeader(header.path, header.name, header.position, planeSize, loop, scene);
  });
}

// Moves to the general About Me area (a bookcase with books, picture frames and a flower pot)
function handleAboutSubarea(controls, loop, scene, subarea = "main") {
  if (isAboutAreaActive) {
    return;
  }

  removeAreaSelectors(scene);
  removePngHeaders(scene);

  handleSocialIconHover(null, loop);
  isBookOpen = false;
  isSocialsAreaActive = false;
  let targetPos = aboutMePos;
  if (subarea === "main") {
    headersToRender = ["about"];
  }
  else if (subarea === "skills") {
    headersToRender = ["soft_skills", "hard_skills"];
    targetPos = skillsPos;
  }
  else if (subarea === "experience") {
    targetPos = experiencePos;
    headersToRender = ["certificates", "experience"];
  }
  else {
    console.error("Invalid subarea to navigate:", subarea);
    return;
  }
  createPngHeaders(loop, scene, headersToRender, getCurrentLocale());
  // Add to loop a tick to re-render the headers if the language changes
  loop.updatables.push({
    tick: (delta) => {
      if (isAboutAreaActive && getCurrentLocale() !== lang) {
        removePngHeaders(scene);
        createPngHeaders(loop, scene, headersToRender);
      }
    }
  });
  isAboutAreaActive = true;
  setAboutSubareaActive(subarea);

  const to = targetPos;
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(-2),
    xRight: MathUtils.degToRad(1)
  }
  moveToArea(controls, loop, to, angles, 31, 32);
}

function handleAboutClick(controls, loop, scene) {
  // The first subarea we navigate to is the main one
  handleAboutSubarea(controls, loop, scene, "main");
}

function toggleIsSocialsActive() {
  isSocialsAreaActive = !isSocialsAreaActive;
  return isSocialsAreaActive;
}

function toggleIsAboutActive() {
  isAboutAreaActive = !isAboutAreaActive;
  return isAboutAreaActive;
}

function getActiveAboutSubarea() {
  if (isAboutMainSubareaActive) return "main";
  if (isAboutSkillsSubareaActive) return "skills";
  if (isAboutExperienceSubareaActive) return "experience";
  return "";
}

function setAboutSubareaActive(subarea) {
  if (subarea === "main") {
    isAboutMainSubareaActive = true;
    isAboutSkillsSubareaActive = false;
    isAboutExperienceSubareaActive = false;
  } else if (subarea === "skills") {
    isAboutMainSubareaActive = false;
    isAboutSkillsSubareaActive = true;
    isAboutExperienceSubareaActive = false;
  } else if (subarea === "experience") {
    isAboutMainSubareaActive = false;
    isAboutSkillsSubareaActive = false;
    isAboutExperienceSubareaActive = true;
  }
}

function getIsAreaActive(area, subArea = "") {
  if (area === 'socials') {
    return isSocialsAreaActive;
  } else if (area === 'about') {
    if (subArea === '') {
      return isAboutAreaActive;
    }
  }
  return false;
}

function handleOpenBook(object) {
  if (isBookOpen) {
    return;
  }

  let parent = object.parent;
  while (parent && !parent.mixer) {
    parent = parent.parent;
  }
  if (!parent) {
    console.error('No parent with mixer found for object:', object.name);
    return;
  }

  const mixer = parent.mixer;

  if (!mixer || mixer == undefined) {
    console.error('No mixer found for object:', object.name);
    return;
  }
  if (!mixer.animations || mixer.animations.length === 0) {
    console.error('No animations found for object:', object.name);
    return;
  }

  // Determine which animation to play
  let bookAnimation = getAnimation(mixer.animations, "Open");
  if (!bookAnimation) {
    console.error('No animation found for object:', object.name);
    return;
  }
  isBookOpen = !isBookOpen;

  if (!bookAnimation) {
    console.error('No animation found for object:', object.name);
    return;
  }

  // Stop all other animations to prevent conflicts
  mixer.stopAllAction();

  // Play the new animation
  const animation = mixer.clipAction(bookAnimation, mixer.target);
  animation.setLoop(LoopOnce);
  animation.clampWhenFinished = true;
  animation.reset().play(); // Ensure animation starts fresh
}

function handleSocialIconClick(iconName, loop) {
  console.log(`Clicked on ${iconName}`);

  if (iconName == 'Gmail') {
    _removeSocialIconTick(loop);
    window.open(`mailto:${gmailLink}`, '_blank');
  }
  else if (iconName == 'LinkedIn') {
    _removeSocialIconTick(loop);
    window.open(linkedinLink, '_blank');

  }
  else if (iconName == 'Github') {
    _removeSocialIconTick(loop);
    window.open(githubLink, '_blank');
  }
}

function handleSocialIconHover(newHoveredObject, loop) {
  if (hovSocialIcon === newHoveredObject) {
    return;
  }

  // Reset old hovered object's position before nulling it
  if (hovSocialIcon && hovSocialIconInitialY != null) {
    hovSocialIcon.position.y = hovSocialIconInitialY;
    hovSocialIcon.rotation.y = hovSocialIconInitialRotation;
  }

  // Remove old tick
  if (hovSocialIconTick) {
    const index = loop.updatables.indexOf(hovSocialIconTick);
    if (index > -1) {
      loop.updatables.splice(index, 1);
    }
  }

  hovSocialIcon = newHoveredObject;

  if (hovSocialIcon && newHoveredObject.selectableArea == "socials") {
    // Transform the hovered object
    hovSocialIconInitialY = hovSocialIcon.position.y;
    hovSocialIconInitialRotation = hovSocialIcon.rotation.y;

    let time = 0;
    const threshold = 0.5;
    hovSocialIconTick = {
      tick: (delta) => {
        time += delta;
        let distance = delta * 3;
        let y = hovSocialIcon.position.y;
        // If y is under threshold, move it up
        if (y < hovSocialIconInitialY + threshold) {
          hovSocialIcon.position.y += distance;
        } else {
          // Rotate the object
          hovSocialIcon.rotation.y += delta;
        }
      },
    };
    loop.updatables.push(hovSocialIconTick);
  } else {
    hovSocialIconInitialY = null;
    hovSocialIconTick = null;
    // Reset cursor to default if not hovering an icon
    document.body.style.cursor = 'default';
  }
}

function handleHardSkillsHover(newHoveredObject, loop, mousePosition) {

  if (hovHardSkill === newHoveredObject) {
    // Update tag position if already hovering the same item
    if (hoveredObjectTag) {
      const offsetX = 40;
      const offsetY = 30;
      hoveredObjectTag.style.left = `${mousePosition.x + offsetX}px`;
      hoveredObjectTag.style.top = `${mousePosition.y + offsetY}px`;
    }
    return;
  }

  // Reset previous
  if (hovHardSkill && hovHardSkillInitialX != null) {
    hovHardSkill.position.x = hovHardSkillInitialX;
  }

  if (hovHardSkillTick) {
    const index = loop.updatables.indexOf(hovHardSkillTick);
    if (index > -1) {
      loop.updatables.splice(index, 1);
    }
  }

  if (hoveredObjectTag) {
    hoveredObjectTag.remove();
    hoveredObjectTag = null;
  }

  hovHardSkill = newHoveredObject;

  if (hovHardSkill) {
    hovHardSkillInitialX = hovHardSkill.position.x;
    const threshold = 0.3;

    hovHardSkillTick = {
      tick: (delta) => {
        if (hovHardSkill.position.x > hovHardSkillInitialX - threshold) {
          hovHardSkill.position.x -= delta * 2;
        }
      },
    };
    loop.updatables.push(hovHardSkillTick);

    hoveredObjectTag = setHoveredObjectTag(hovHardSkill.name, mousePosition = { x: 0, y: 0 });
  } else {
    hovHardSkillInitialX = null;
    hovHardSkillTick = null;
  }
}

function canSetHoveredObject(objectArea) {
   if ((objectArea == 'about_skills' && !isAboutSkillsSubareaActive)
    || (objectArea == 'about_main' && !isAboutMainSubareaActive)
    || (objectArea == 'about_experiences' && !isAboutExperienceSubareaActive)
    || (objectArea == 'socials' && !isSocialsAreaActive)) {
    return false;
  }

  return true;
}

function setHoveredObjectTag(name, mousePosition, objectArea = "") {
  // Remove all tags in class hover-tag
  const tags = document.getElementsByClassName('hover-tag');
  for (let i = 0; i < tags.length; i++) {
    tags[i].remove();
  }

  // If name is null, return
  if ( !name || !canSetHoveredObject(objectArea) ) {
    return null;
  }

  const tag = document.createElement('div');
  tag.className = 'hover-tag';
  let tagName = name.replace(/_/g, ' '); // Replace underscores with spaces
  // Some special cases
  if (tagName == 'Nodejs') tagName = 'Node.js';
  else if (tagName == 'More') tagName = 'More...';
  tag.innerHTML = tagName;
  tag.style.position = 'absolute';
  tag.style.pointerEvents = 'none';
  tag.style.zIndex = '9999';
  tag.style.transition = 'opacity 0.3s ease-in-out';
  tag.style.opacity = '1';
  tag.style.fontSize = '16px';
  tag.style.color = 'white';
  tag.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  tag.style.padding = '5px 10px';
  tag.style.borderRadius = '5px';
  tag.style.whiteSpace = 'nowrap';
  tag.style.transform = 'translate(-50%, -50%)';

  const offsetX = 40;
  const offsetY = 30;
  tag.style.left = `${mousePosition.x + offsetX}px`;
  tag.style.top = `${mousePosition.y + offsetY}px`;

  document.body.appendChild(tag);
  return tag;
}

function handleSkillsClick(skillName, loop) {
  setHoveredObjectTag(null);

  document.querySelector('.label-renderer').style.pointerEvents = "none";
  document.querySelector('.inspect-view').style.pointerEvents = "auto";
  document.querySelector('.menu-container').style.display = 'none';

  const store = useMainStore();

  // Overwrite array for panel selection to hold just the index of the clicked skill
  if (skillName === 'Soft_Skills') {
    store.triggerShowSoftSkills();
  }
  else {
    store.triggerShowHardSkills();
    store.setPanelHardSkills([hardSkillIndexes[skillName]]);
  }
}

function _removeSocialIconTick(loop) {
  if (hovSocialIconTick && loop.updatables.includes(hovSocialIconTick)) {
    const index = loop.updatables.indexOf(hovSocialIconTick);
    if (index > -1) loop.updatables.splice(index, 1);
  }
}

export {
  handleReturnToMainView,
  handleProjectsClick,
  handleSocialsClick,
  handleAboutClick,
  handleSocialsHover,
  handleSocialIconClick,
  handleSocialIconHover,
  handleHardSkillsHover,
  handleSkillsClick,
  toggleIsSocialsActive,
  toggleIsAboutActive,
  getIsAreaActive,
  handleOpenBook,
  getActiveAboutSubarea,
  setHoveredObjectTag,
  canSetHoveredObject
};
