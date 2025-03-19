import { WeatherStation } from "@shared/types";

export type StateFilterProps = {
  selectedState: string;
  states: string[];
  onStateChange: (state: string) => void;
};

export type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export type MapProps = {
  stations: WeatherStation[];
  selectedState: string;
  states: string[];
  onStateChange: (state: string) => void;
  selectedStation: WeatherStation | null;
  onStationSelect: (station: WeatherStation | null) => void;
};
