export const fToCelcius = (num) => {
  return Math.round((num - 32) / 1.8);
};

export const backgroundChanger = (currentTime, weatherCondition) => {
  const hour = new Date(currentTime).getHours(); // Convert Unix timestamp to hours
  switch (weatherCondition) {
    case "Clear":
      return hour >= 6 && hour <= 18 ? "CLEAR_DAY" : "CLEAR_NIGHT";
    case "Clouds":
      return hour >= 6 && hour <= 18 ? "CLOUDY_DAY" : "CLOUDY_NIGHT";
    case "Rain" || "Thunderstorm" || "Drizzle" || "Tornado":
      return hour >= 6 && hour <= 18 ? "RAIN_DAY" : "RAIN_NIGHT";
    case "Snow":
      return hour >= 6 && hour <= 18 ? "SNOW_DAY" : "SNOW_NIGHT";
    default:
      return hour >= 6 && hour <= 18 ? "CLEAR_DAY" : "CLEAR_NIGHT";
  }
};
