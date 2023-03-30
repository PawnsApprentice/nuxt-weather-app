<template>
  <div
    class="windowpane flex cursor-pointer flex-row flex-wrap justify-between rounded-full md:py-5 md:px-3"
    @click="goToCityView(city)"
  >
    <!-- weather image -->
    <div class="flex items-center justify-center">
      <img
        class="h-20 rounded-lg object-contain brightness-125 contrast-125 filter"
        :src="city.image"
        alt="Weather Picture"
      />
    </div>
    <!-- weather place -->
    <div class="ml-2 flex w-full w-auto flex-col justify-center md:ml-10">
      <h2 class="text-xl md:text-3xl">{{ city.city }}</h2>
      <h3 class="text-xs md:text-base">{{ city.state }}</h3>
    </div>
    <!-- weather temp -->
    <div class="ml-2 flex flex-col justify-center">
      <p class="self-end text-sm md:text-3xl">
        {{ fToCelcius(city.weather.main.temp) }}&deg;
      </p>
      <div class="flex gap-2">
        <span class="text-xs md:text-sm">
          H: {{ fToCelcius(city.weather.main.temp_max) }}&deg;
        </span>
        <span class="text-xs md:text-sm">
          L: {{ fToCelcius(city.weather.main.temp_min) }}&deg;
        </span>
      </div>
    </div>
    <!-- Delete Button -->
    <div class="mr-2 flex items-center justify-center md:mr-10">
      <font-awesome-icon
        class="cursor-pointer text-3xl duration-150 hover:text-red-500"
        :icon="['fas', 'trash']"
        @click="deleteCity($event, city)"
      />
    </div>
  </div>
</template>

<script setup>
import { fToCelcius } from "~~/utils/utils";
import { useCitiesStore } from "~/stores/cities";

defineProps({
  city: {
    type: Object,
    default: () => {},
  },
});

const cityStore = useCitiesStore();

const router = useRouter();

const goToCityView = (city) => {
  cityStore.setCityDetails(city.id, city.state, city.city);
  router.push({
    path: `/weather/${city.state}/${city.city}`,
    query: {
      lat: city.coords.lat,
      lng: city.coords.lng,
    },
  });
};
const deleteCity = (event, citySelected) => {
  event.stopPropagation();
  const cities = useCookie("savedCities");
  const updatedCities = cities.value.filter((city) => {
    return city.id !== citySelected.id;
  });
  cities.value = updatedCities;
  cityStore.setCities(cities.value);
};
</script>

<style scoped>
.windowpane {
  border-radius: 50px;
  margin-top: 10px;
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.5);
  background: rgba(110, 110, 110, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: box-shadow 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.windowpane:hover {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
</style>
