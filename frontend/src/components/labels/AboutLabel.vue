<template>
  <div class="about">
    <h1>{{ $t('about.title') }}</h1>
    <p v-html="$t('about.description')"></p>
  </div>
</template>

<script>
export default {
  name: 'AboutLabel'
}
</script>

<style scoped>
.about {
  background-color: white;
  padding: 5rem;
  text-align: center;
  font-family: Arial, sans-serif;
}
</style>
