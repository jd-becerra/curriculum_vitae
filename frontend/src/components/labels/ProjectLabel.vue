<template>
  <v-container class="projects">
    <v-carousel cycle>
      <v-carousel-item>
        <v-card class="project-card">
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
          <v-img :src="project.image" class="project-image"></v-img>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-container>
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
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 0;
}

.projects-carousel {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.project-slide {
  width: 100%;
  height: 100%;
}

.introduction-card,
.project-card {
  width: 100%;
  max-width: 100%;
  margin-top: 0;
}

.project-image {
  object-fit: scale-down;
  margin-top: 0; /* Ensure no space between card and image */
}

/* Ensure text doesn't overflow */
.text-subtitle-1,
.text-body-2 {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.next, .prev {
  color: black;
}
</style>
