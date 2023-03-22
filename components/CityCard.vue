<template>
  <div
    class="flex cursor-pointer rounded-md bg-weather-secondary py-6 px-3 shadow-md"
    @click="goToCityView(city)"
  >
    <div class="flex flex-1 flex-col">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
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
    <div class="ml-10 flex items-center justify-center">
      <font-awesome-icon
        class="cursor-pointer text-2xl duration-150 hover:text-red-500"
        :icon="['fas', 'trash']"
        @click="deleteCity($event, city)"
      />
    </div>
  </div>
</template>

<script setup>
import { fToCelcius } from "~~/utils/utils";
import { useCitiesStore } from "~/stores/cities";

const cityStore = useCitiesStore();

defineProps({
  city: {
    type: Object,
    default: () => {},
  },
});

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
