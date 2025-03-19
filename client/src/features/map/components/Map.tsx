import { useState, MouseEvent } from "react";
import Map, { Marker } from "react-map-gl";
import { Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Measurement, WeatherStation } from "@shared/types";
import styles from "./Map.module.css";
import Popup from "../../../components/Popup/Popup";
import StateFilter from "./StateFilter";
import { weatherStationApi } from "../../../services/api/weatherStation";
import { MapProps, ViewState } from "../types";

function WeatherMap({
  stations,
  selectedState,
  states,
  onStateChange,
  selectedStation,
  onStationSelect,
}: MapProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 135.2093,
    latitude: -25.8688,
    zoom: 3.5,
  });

  const handleMarkerClick = async (e: MouseEvent, station: WeatherStation) => {
    e.stopPropagation();
    try {
      const data = await weatherStationApi.getLatestMeasurements(station.id);
      setMeasurements(data);
      onStationSelect(station);
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <StateFilter
        selectedState={selectedState}
        states={states}
        onStateChange={onStateChange}
      />
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        attributionControl={false}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="bottom"
          >
            <div
              className={styles.marker}
              onClick={(e) => handleMarkerClick(e, station)}
            >
              <LocationOnIcon
                sx={{
                  color:
                    selectedStation?.id === station.id ? "#2196f3" : "#f44336",
                  fontSize: "2rem",
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))",
                }}
              />
            </div>
          </Marker>
        ))}
      </Map>

      {selectedStation && (
        <Popup
          title={selectedStation.ws_name}
          details={[
            { label: "Site", value: selectedStation.site },
            { label: "Portfolio", value: selectedStation.portfolio },
            { label: "State", value: selectedStation.state },
          ]}
          measurements={{
            title: "Latest Measurements",
            items: measurements.map((m) => ({
              label: m.variableLongName,
              value: `${m.value} ${m.unit}`,
            })),
          }}
        />
      )}
    </Box>
  );
}

export default WeatherMap;
