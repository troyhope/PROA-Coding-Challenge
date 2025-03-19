import { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { WeatherStation } from "@shared/types";
import { WeatherMap } from "./features/map";
import { weatherStationApi } from "./services/api/weatherStation";
import "./App.css";

function App() {
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [allStates, setAllStates] = useState<string[]>([]);
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(
    null
  );

  const fetchStations = useCallback(async () => {
    try {
      const data = await weatherStationApi.getStations(selectedState);
      setStations(data);

      // Only update allStates if it's empty (initial load)
      if (allStates.length === 0) {
        const uniqueStates = [...new Set(data.map((station) => station.state))];
        setAllStates(uniqueStates);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  }, [selectedState, allStates.length]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleClosePopup = () => {
    setSelectedStation(null);
  };

  return (
    <Box
      onClick={handleClosePopup}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Weather Station Map
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "1000px" },
            height: { xs: "500px", md: "80vh" },
          }}
        >
          <WeatherMap
            stations={stations}
            selectedState={selectedState}
            states={allStates}
            onStateChange={setSelectedState}
            selectedStation={selectedStation}
            onStationSelect={setSelectedStation}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
