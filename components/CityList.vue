<template>
  <button
    class="w-3/6 rounded-full py-3 px-3 text-lg text-white hover:shadow-lg hover:backdrop-blur-lg"
    @click="findLocation()"
  >
    Find Location
  </button>
  <div v-for="city in cities" :key="city.id">
    <CityCard :city="city" />
  </div>
  <p v-if="cities.length === 0" class="bold">
    No locations added. To start tracking a location, search in the field above
    or press the button above to fetch location.
  </p>
</template>

<script setup>
import axios from "axios";
import CityCard from "./CityCard.vue";
import { useCitiesStore } from "~/stores/cities";
import { storeToRefs } from "pinia";

const router = useRouter();

const cityStore = useCitiesStore();
const { cities } = storeToRefs(cityStore);

const savedCities = reactive({
  cities: [],
});

//GET THE ENV VARIABLES
const config = useRuntimeConfig();
const openweatherApiKey = config.OPENWEATHER_API_KEY;

//METHODS
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

const findLocation = () => {
  const successCallback = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // make API request to retrieve city name for coordinates
    const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${openweatherApiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const cityName = data[0].name;
        const countryName = data[0].country;
        router.push({
          path: `/weather/${countryName}/${cityName}`,
          query: {
            lat: lat,
            lng: lng,
            preview: true,
          },
        });
      })
      .catch((error) => {
        console.log(`Error getting city name: ${error}`);
      });
  };

  const errorCallback = (error) => {
    console.error(`Error getting location. ${error} encountered`);
    alert(
      "Could not retrieve your location. Please enable location services and try again."
    );
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

await getCities();

//Flicker Delay
await new Promise((res) => setTimeout(res, 1500));
</script>

<style scoped>
button {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  background: rgba(110, 110, 110, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
}
</style>
