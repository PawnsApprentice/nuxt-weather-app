<template>
  <header class="sticky top-0 z-50">
    <nav
      class="container flex flex-col items-center gap-4 py-6 text-white sm:flex-row"
    >
      <NuxtLink to="/">
        <div class="flex text-2xl">
          <!-- Known hydration error, need to wrap in a span else enjoy double rendering-->
          <span><font-awesome-icon :icon="['fas', 'sun']" /></span>
          <p class="ml-4">The Local Weather</p>
        </div>
      </NuxtLink>
      <div class="flex flex-1 justify-end gap-3">
        <font-awesome-icon
          class="cursor-pointer text-xl duration-150 hover:text-weather-secondary"
          :icon="['fas', 'circle-info']"
          @click="toggleModal"
        />
        <font-awesome-icon
          class="cursor-pointer text-xl duration-150 hover:text-weather-secondary"
          :icon="['fas', 'plus']"
          @click="addCity"
          v-if="route.query.preview"
        />
      </div>

      <BaseModal :modal-active="modalActive" @close-modal="toggleModal">
        <div class="text-black">
          <h1 class="mb-1 text-2xl">About:</h1>
          <p class="mb-4">
            The Local Weather allows you to track the current and future weather
            of cities of your choosing.
          </p>
          <h2 class="text-2xl">How it works:</h2>
          <ol class="mb-4 list-inside list-decimal">
            <li>
              Search for your city by entering the name into the search bar.
            </li>
            <li>
              Select a city within the results, this will take you to the
              current weather for your selection.
            </li>
            <li>
              Track the city by clicking on the "+" icon in the top right. This
              will save the city to view at a later time on the home page.
            </li>
          </ol>

          <h2 class="text-2xl">Removing a city</h2>
          <p>
            If you no longer wish to track a city, simply select the city within
            the home page. At the bottom of the page, there will be am option to
            delete the city.
          </p>
        </div></BaseModal
      >
    </nav>
  </header>
</template>

<script setup>
import { uid } from "uid";
import { useCitiesStore } from "~/stores/cities";
import { storeToRefs } from "pinia";

const cityStore = useCitiesStore();

const { cityImage } = storeToRefs(cityStore);
const route = useRoute();
const router = useRouter();
const modalActive = ref(null);

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
const savedCities = ref([]);
const addCity = () => {
  const citiesFromCookies = useCookie("savedCities");
  if (citiesFromCookies.value) {
    savedCities.value = citiesFromCookies.value;
  }

  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
    },
    image: cityImage.value,
  };

  savedCities.value.push(locationObj);
  citiesFromCookies.value = savedCities.value;
  cityStore.setCities(savedCities.value);

  let query = Object.assign({}, route.query);
  delete query.preview;

  router.replace({ query });
};
</script>

<style scoped>
nav {
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  background: rgba(110, 110, 110, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

nav a {
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}

nav a:hover {
  color: #ccc;
}
</style>
