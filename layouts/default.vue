<template>
  <div
    class="font-rubik flex min-h-screen flex-col"
    :style="{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'grey',
      transition: 'background-image 0.5s ease-in-out',
    }"
  >
    <NavBar />
    <slot />
  </div>
</template>

<script setup>
import { useCitiesStore } from "~/stores/cities";
import clearNightImage from "@/assets/night/clear.jpg";
import cloudyNightImage from "@/assets/night/cloudy.jpg";
import rainNightImage from "@/assets/night/rain.jpg";
import snowNightImage from "@/assets/night/snow.jpg";
import clearDayImage from "@/assets/day/clear.jpg";
import cloudyDayImage from "@/assets/day/cloudy.jpg";
import rainDayImage from "@/assets/day/rain.jpg";
import snowDayImage from "@/assets/day/snow.jpg";

const cityStore = useCitiesStore();

const backgroundImage = {
  CLEAR_NIGHT: clearNightImage,
  CLOUDY_NIGHT: cloudyNightImage,
  RAIN_NIGHT: rainNightImage,
  SNOW_NIGHT: snowNightImage,
  CLEAR_DAY: clearDayImage,
  CLOUDY_DAY: cloudyDayImage,
  RAIN_DAY: rainDayImage,
  SNOW_DAY: snowDayImage,
};

const bgImage = computed(() => {
  console.log("triggered");
  return backgroundImage[cityStore.backgroundImage];
});

useHead({
  title: "Local Weather App ",
});
</script>

<style scoped>
.font-rubik {
  font-family: "Rubik", sans-serif;
}
</style>
