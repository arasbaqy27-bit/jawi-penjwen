
export interface DayForecast {
  day: string;
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  humidity: number;
  rainChance: number;
  snowChance: number;
  windSpeed: number;
  detailedDescription: string;
  icon: string;
}

export interface WeatherData {
  currentTemp: number;
  currentCondition: string;
  currentDate: string;
  humidity: number;
  windSpeed: number;
  currentRainChance: number;
  currentSnowChance: number;
  roadStatus: string;
  healthAdvice: string;
  inspirationalQuote: string;
  strongestEarthquake: {
    magnitude: string;
    date: string;
  };
  penjwenIdentity: {
    hospitality: string;
    etymology: string;
  };
  forecast: DayForecast[];
}
