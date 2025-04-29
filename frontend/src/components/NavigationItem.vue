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
  place-content: center;
  place-items: center;
  background-color: #000000;
}

.header {
  font-size: 1rem;
  font-weight: 300;
  color: #fff;
}
</style>
