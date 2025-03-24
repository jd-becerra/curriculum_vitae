<template>
  <div class="projects">
    <v-carousel cycle>
      <v-carousel-item>
        <v-card>
          <v-card-title>$t('projects-vue.title')</v-card-title>
          <v-card-text>
            <p v-html="$t('projects-vue.description')"></p>
          </v-card-text>
        </v-card>
      </v-carousel-item>

      <v-carousel-item
        v-for="(project, index) in $tm('projects-vue.projects')"
        :key="index"
        :src="project.image"
        cover
        @click="sendTo(project.link)"
      >
        <v-card>
          <v-card-title>{{ project.title }}</v-card-title>
          <v-card-text>
            <p v-html="project.description"></p>
          </v-card-text>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: "ProjectCarousel",
  methods: {
    sendTo(link) {
      if (!link) return;

      window.open(link, "_blank");
    },
  }
};
</script>

<style scoped>
.projects {
  background-color: #f5f5f5;
  padding: 5rem;
  text-align: center;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-carousel {
  width: 50vw;
  margin: auto;
  padding: 2rem;
}
.v-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  cursor: pointer;
}
</style>
