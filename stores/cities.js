import { defineStore } from "pinia";

export const useCitiesStore = defineStore("city-store", {
  state: () => {
    return {
      cityId: "",
      cityName: "",
      cityState: "",
      cities: useCookie("savedCities").value || [],
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCityDetails(id, name, state) {
      this.cityId = id;
      this.cityName = name;
      this.cityState = state;
    },
    setCities(cities) {
      this.cities = cities;
    },
    resetSelection() {
      this.cityId = "";
      this.cityName = "";
      this.cityState = "";
    },
  },
});
