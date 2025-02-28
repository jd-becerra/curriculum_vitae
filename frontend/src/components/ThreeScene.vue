<template>
  <div ref="mainContainer" class="main-container">
    <div ref="sceneContainer" class="three-scene"></div>
    <div ref="labelsContainer" class="three-labels"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { World } from "@/World/World.js";

export default {
  setup() {
    const sceneContainer = ref(null);
    const labelsContainer = ref(null);

    onMounted(() => {
      if (sceneContainer.value && labelsContainer.value) {
        const world = new World(sceneContainer.value, labelsContainer.value);
        world.start();
      } else {
        console.error(`Scene container is ${sceneContainer.value} and labels container is ${labelsContainer.value}`);
      }
    });

    return { sceneContainer, labelsContainer };
  },
};
</script>

<style scoped>
.main-container {
  position: fixed;  /* makes this the origin of its children */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.three-scene {
  width: 100%;
  height: 100%;
  display: block;
}

.three-labels {
  position: absolute;  /* let us position ourself inside the container */
  left: 0;             /* make our position the top left of the container */
  top: 0;
  color: white;
  z-indez: 10;
}

.three-labels>div {
  position: absolute;  /* let us position them inside the container */
  left: 0;             /* make their default position the top left of the container */
  top: 0;
  cursor: pointer;     /* change the cursor to a hand when over us */
  font-size: large;
  user-select: none;   /* don't let the text get selected */
  text-shadow:         /* create a black outline */
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
}
.three-labels>div:hover {
  color: red;
}
</style>
