<template>
  <div class="projects">
    <v-carousel cycle cover >
      <v-carousel-item>
        <v-card>
          <v-card-title>{{$t('projects-vue.title')}}</v-card-title>
          <v-card-text>
            <p v-html="$t('projects-vue.description')"></p>
          </v-card-text>
        </v-card>
      </v-carousel-item>

      <v-carousel-item
        v-for="(project, index) in $tm('projects-vue.projects')"
        :key="index"
        cover
        @click="sendTo(project.link)"
      >
        <v-card class="project-card">
          <v-card-title>{{ project.title }}</v-card-title>
          <v-card-text>
            <p v-html="project.description"></p>
          </v-card-text>
        </v-card>
        <v-img :src="project.image" class="project-image"></v-img>
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
  text-align: center;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

.v-carousel {
  margin: auto;
}

.v-carousel-item {
  cursor: pointer;
  position: relative;
}

.project-card {
  position: relative;
  z-index: 1;
}

.project-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  
  object-fit: cover;
  z-index: 0;
}
</style>
