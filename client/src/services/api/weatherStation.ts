import axios from "axios";
import { WeatherStation, Measurement } from "@shared/types";

const BASE_URL = "http://localhost:5000/api/weatherstation";

export const weatherStationApi = {
  getStations: async (state?: string) => {
    const url =
      state && state !== "all"
        ? `${BASE_URL}/getweatherstations?state=${state}`
        : `${BASE_URL}/getweatherstations`;

    const response = await axios.get<WeatherStation[]>(url);
    return response.data;
  },

  getLatestMeasurements: async (stationId: number) => {
    const response = await axios.get<Measurement[]>(
      `${BASE_URL}/getlatestmeasurements?stationId=${stationId}`
    );
    return response.data;
  },
};
