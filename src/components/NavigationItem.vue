<template>
  <v-btn class="item">
    <h6 class="header">
      <slot name="heading"></slot>
    </h6>
  </v-btn>
</template>

<style scoped>
.item {
  display: flex;
  position: relative;
  place-content: left;
  place-items: left;

  width: 100%;
  justify-content: left;
}

.header {
  font-size: 1rem;
  font-weight: 300;
}
</style>
