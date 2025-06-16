<template>
  <div class="contact">
    <h1>Contact</h1>
    <ul>
      <li>
        <a href="mailto:email@gmail.com" @click.prevent="openEmail">
          <span class="email">email</span>
        </a>
      </li>
      <li>
        <a href="https://linkedin.com/in/linkedin" target="_blank">
          <span class="linkedin">linkedin</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ContactLabel',
  methods: {
    openEmail(event) {
      window.open(event.target.href);
    }
  }
}
</script>

<style scoped>
.contact {
  background-color: white;
  padding: 5rem;
  text-align: center;
  font-family: Arial, sans-serif;
}
a {
  pointer-events: auto;
}
</style>
