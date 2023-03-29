<template>
  <div class="font-rubik bg-img flex min-h-screen flex-col">
    <NavBar />
    <slot />
  </div>
</template>

<script setup></script>

<style scoped>
.bg-img {
  background-image: url(@/assets/night/rain.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: grey;
  transition: 500ms;
  opacity: 1;
}

.font-rubik {
  font-family: "Rubik", sans-serif;
}
</style>
