import { MathUtils } from 'three';
import {Tween, Easing} from '@tweenjs/tween.js';
import { AnimationClip, LoopOnce, LoopRepeat } from 'three';

// State variables
let isBookOpen = false;
let isSocialsAreaActive = false;
let isAboutAreaActive = false;

// For social icons
const gmailLink = "jbecerraofficial@gmail.com";
const linkedinLink = "https://www.linkedin.com/in/jes%C3%BAs-david-becerra-063694310/";
const githubLink = "https://github.com/jd-becerra";
let hovSocialIcon = null;
let hovSocialIconInitialY = null;
let hovSocialIconInitialRotation = null;
let hovSocialIconTick = null;

// For hard skills
let hovHardSkill = null;
let hovHardSkillInitialX = null;
let hovHardSkillTick = null;
let hovHardSkillTag = null;

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

function handleProjectsClick(camera, controls, object, loop) {
  const to = {x: -40, y: 0, z: -10};

  const angles = {
    yUp: MathUtils.degToRad(95),
    yDown: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(80),
    xRight: MathUtils.degToRad(100)
  }
  moveToArea(controls, loop, to, angles);
}

function handleSocialsClick(camera, controls, object, loop) {
  const to = {x: 15, y: 4, z: -42};
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(92),
    xLeft: MathUtils.degToRad(-5),
    xRight: MathUtils.degToRad(5)
  }
  moveToArea(controls, loop, to, angles);
}

function handleAboutClick(camera, controls, object, loop) {
  const to = {x: -3, y: 3.5, z: -50};
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(-2),
    xRight: MathUtils.degToRad(1)
  }
  moveToArea(controls, loop, to, angles, 31, 32);
}

function toggleIsSocialsActive() {
  isSocialsAreaActive = !isSocialsAreaActive;
  return isSocialsAreaActive;
}

function toggleIsAboutActive() {
  isAboutAreaActive = !isAboutAreaActive;
  return isAboutAreaActive;
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

function handleOpenBook(object) {
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
  let bookAnimation = isBookOpen ? getAnimation(mixer.animations, "Close") : getAnimation(mixer.animations, "Open");
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

  if (hovSocialIcon) {
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
    if (hovHardSkillTag) {
      const offsetX = 40;
      const offsetY = 30;
      hovHardSkillTag.style.left = `${mousePosition.x + offsetX}px`;
      hovHardSkillTag.style.top = `${mousePosition.y + offsetY}px`;
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

  if (hovHardSkillTag) {
    hovHardSkillTag.remove();
    hovHardSkillTag = null;
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

    const tag = document.createElement('div');
    tag.className = 'hover-tag';
    tag.innerHTML = hovHardSkill.name;
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
    hovHardSkillTag = tag;
  } else {
    hovHardSkillInitialX = null;
    hovHardSkillTick = null;
  }
}

function _removeSocialIconTick(loop) {
  if (hovSocialIconTick && loop.updatables.includes(hovSocialIconTick)) {
    const index = loop.updatables.indexOf(hovSocialIconTick);
    if (index > -1) loop.updatables.splice(index, 1);
  }
}

export {
  handleProjectsClick,
  handleSocialsClick,
  handleAboutClick,
  handleSocialsHover,
  handleSocialIconClick,
  handleSocialIconHover,
  handleHardSkillsHover,
  toggleIsSocialsActive,
  toggleIsAboutActive,
  getIsAreaActive,
  handleOpenBook,
};
