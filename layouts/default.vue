<template>
  <div
    class="flex min-h-screen flex-col font-Roboto"
    :style="{
      backgroundImage: `url(${backImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }"
  >
    <NavBar />
    <slot />
  </div>
</template>

<script setup>
import backImage from "@/assets/wallpaper.jpg";
</script>

<style lang="scss" scoped></style>
