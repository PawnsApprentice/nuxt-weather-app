<template>
  <div
    class="windowpane flex cursor-pointer justify-between rounded-full py-6 px-3"
    @click="goToCityView(city)"
  >
    <div class="ml-10 flex flex-col">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>
    <div>
      <img
        class="h-20 rounded-lg object-contain brightness-125 contrast-125 filter"
        :src="city.image"
        alt="Weather Picture"
      />
    </div>
    <div class="flex flex-col gap-2">
      <p class="self-end text-3xl">
        {{ fToCelcius(city.weather.main.temp) }}&deg;
      </p>
      <div class="flex gap-2">
        <span class="text-xs">
          H:
          {{ fToCelcius(city.weather.main.temp_max) }}&deg;
        </span>
        <span class="text-xs">
          L:
          {{ fToCelcius(city.weather.main.temp_min) }}&deg;
        </span>
      </div>
    </div>
    <div class="mr-10 flex items-center justify-center">
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
  padding: 30px 40px;
  margin-bottom: 8px;
  border-radius: 50px;
  margin-top: 10px;
  box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.5);
  background: rgba(110, 110, 110, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: box-shadow 0.3s ease-in-out;
}
.windowpane:hover {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
</style>
