<template>
  <div v-if="cities.length === 0"><CityCardSkeleton /></div>
  <div v-for="city in cities" :key="city.id">
    <CityCard :city="city" />
  </div>

  <p v-if="savedCities.length === 0">
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import CityCard from "./CityCard.vue";
import { useCitiesStore } from "~/stores/cities";
import { storeToRefs } from "pinia";

const cityStore = useCitiesStore();

const { cities } = storeToRefs(cityStore);
const savedCities = reactive({
  cities: [],
});

const getCities = async () => {
  const cities = useCookie("savedCities");
  if (cities.value) {
    savedCities.cities = cities.value;
    const requests = [];
    savedCities.cities.forEach((city) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial`
        )
      );
    });
    const weatherData = await Promise.all(requests);
    weatherData.forEach((value, index) => {
      savedCities.cities[index].weather = value.data;
    });
    cityStore.setCities(savedCities.cities);
  }
};

//Flicker Delay
await new Promise((res) => setTimeout(res, 1000));

await getCities();
</script>
