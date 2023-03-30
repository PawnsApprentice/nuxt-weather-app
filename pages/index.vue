<template>
  <main class="container text-white">
    <div class="relative mb-5 pt-4">
      <input
        v-model="searchQuery"
        @input="getSearchResults"
        type="text"
        placeholder="Search for a city or place in the world."
        class="focus:shadow-outline-blue w-full appearance-none rounded-lg border bg-gray-100 bg-opacity-50 px-3 py-3.5 placeholder-white shadow-sm transition-all duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5"
      />
      <ul
        v-if="mapboxSearchResults"
        class="absolute top-[66px] z-10 w-full bg-weather-secondary py-2 px-1 text-white shadow-md"
      >
        <p v-if="searchError">Sorry something went wrong, please try again.</p>
        <p v-if="!searchError && mapboxSearchResults.length === 0">
          No results match the given query, try a different place.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="cursor-pointer py-2"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import { useCitiesStore } from "~/stores/cities";

const cityStore = useCitiesStore();
cityStore.setBackgroundImage("CLOUDY_NIGHT"); //Default background

const router = useRouter();

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null);

//retrieve the runtime config
const config = useRuntimeConfig();
const mapboxApiKey = config.MAPBOX_API_KEY;

//METHODS
const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(",");
  router.push({
    path: `/weather/${state.replaceAll(" ", "")}/${city}`,
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true,
    },
  });
};

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxApiKey}&types=place`
        );
        mapboxSearchResults.value = result.data.features;
      } catch (error) {
        console.error(error);
        searchError.value = true;
        mapboxSearchResults.value = null;
      }
    } else {
      mapboxSearchResults.value = null;
    }
  }, 300);
};

onMounted(() => {
  cityStore.setImage("");
});
</script>

<style scoped></style>
