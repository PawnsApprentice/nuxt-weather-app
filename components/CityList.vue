<template>
  <button
    class="w-3/6 rounded-full py-3 px-3 text-lg text-white shadow-md backdrop-blur-3xl backdrop-opacity-100 backdrop-filter hover:shadow-lg hover:backdrop-blur-lg"
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
import { ref } from "vue";
import CityCard from "./CityCard.vue";
import { useCitiesStore } from "~/stores/cities";
import { storeToRefs } from "pinia";

const router = useRouter();

const cityStore = useCitiesStore();

const { cities } = storeToRefs(cityStore);
const savedCities = reactive({
  cities: [],
});

const config = useRuntimeConfig();
const openweatherApiKey = config.OPENWEATHER_API_KEY;

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

const findLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // make API request to retrieve city name for coordinates
      const apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${openweatherApiKey}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const cityName = data[0].name;
          const countryName = data[0].country;
          console.dir(data);
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
    },

    (error) => {
      console.log("Error getting location.");
    }
  );
};

await getCities();
</script>
