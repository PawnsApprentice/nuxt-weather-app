<template>
  <div class="flex flex-1 flex-col items-center">
    <!-- Banner -->
    <div v-if="route.query.preview" class="w-full p-4 text-center text-white">
      <p>
        You are currently previewing this city, click the "+" icon to start
        tracking this city.
      </p>
    </div>
    <!-- Weather Overview -->
    <div class="windowpane mb-10 flex flex-col items-center text-white">
      <h1 class="mb-2 text-4xl">{{ route.params.city }}</h1>
      <p class="mb-12 text-sm">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="mb-8 text-8xl">
        {{ fToCelcius(weatherData.current.temp) }}&deg
      </p>
      <p>Feels like {{ fToCelcius(weatherData.current.feels_like) }} &deg</p>
      <p class="capitalize">
        {{ weatherData.current.weather[0].description }}
      </p>
      <img
        class="h-auto w-[150px]"
        :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
        alt="Weather Picture"
      />
      <p class="mb-1 capitalize">Wind&deg {{ weatherData.current.wind_deg }}</p>
      <p>Wind Speed: {{ weatherData.current.wind_speed }} m/s</p>
    </div>
    <hr class="mb-5 w-full border border-white border-opacity-10" />
    <!-- Hourly Overview -->
    <div class="w-full max-w-screen-md py-2">
      <div class="windowpane mx-8 mb-5 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col items-center gap-4"
          >
            <p class="text-md whitespace-nowrap">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              class="h-auto w-[150px] object-cover"
              :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt="Weather Picture"
            />
            <p>{{ fToCelcius(hourData.temp) }}&deg</p>
          </div>
        </div>
      </div>
    </div>
    <hr class="mb-5 w-full border border-white border-opacity-10" />
    <!-- Weekly Forecast -->
    <div class="windowpane mb-5 w-full max-w-screen-md">
      <div class="mx-8 text-white">
        <h2 class="mb-4">7 Day Forecast</h2>
        <div
          v-for="day in weatherData.daily"
          :key="day.dt"
          class="flex items-center"
        >
          <p class="flex-1">
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img
            class="w=[50px] h=[50px] object-cover"
            :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
          />
          <div class="flex flex-1 justify-end gap-2">
            <p>H: {{ fToCelcius(day.temp.max) }}&deg</p>
            <p>L: {{ fToCelcius(day.temp.min) }}&deg</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="cityStore.cityId"
      class="mb-10 flex cursor-pointer items-center gap-2 text-white duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <font-awesome-icon
        class="cursor-pointer text-xl duration-150 hover:text-weather-secondary"
        :icon="['fas', 'trash']"
        @click="toggleModal"
      />
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { fToCelcius } from "~~/utils/utils";
import { useCitiesStore } from "~/stores/cities";

const cityStore = useCitiesStore();

const route = useRoute();
const router = useRouter();

const icon = ref("");

//retrieve the runtime config
const config = useRuntimeConfig();
const openweatherApiKey = config.OPENWEATHER_API_KEY;

const modifyData = (data) => {
  // cal current date and time
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const utc = data.current.dt * 1000 + localOffset;
  data.currentTime = utc + 1000 * data.timezone_offset;

  // cal hourly weather offset
  data.hourly.forEach((hour) => {
    const utc = hour.dt * 1000 + localOffset;
    hour.currentTime = utc + 1000 * data.timezone_offset;
  });

  return data;
};

//Flicker Delay
await new Promise((res) => setTimeout(res, 1500));

const { data: weatherData, error } = await useFetch(
  `https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${openweatherApiKey}&units=imperial`,
  {
    transform: (data) => {
      // transform the data here
      const transformedData = modifyData(data);
      icon.value = transformedData.current.weather[0].icon;
      return transformedData;
    },
  }
);

onMounted(() => {
  cityStore.setImage(`https://openweathermap.org/img/wn/${icon.value}@2x.png`);
});

const removeCity = () => {
  const cities = useCookie("savedCities");
  const updatedCities = cities.value.filter((city) => {
    return city.id !== cityStore.cityId;
  });
  cities.value = updatedCities;
  cityStore.resetSelection;
  router.push({
    path: `/`,
  });
};
</script>

<style scoped>
.windowpane {
  padding: 30px 40px;
  border-radius: 10px;
  margin-top: 10px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  background: rgba(110, 110, 110, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
