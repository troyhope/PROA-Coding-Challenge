import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { StateFilterProps } from "../types";

function StateFilter({
  selectedState,
  states,
  onStateChange,
}: StateFilterProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onStateChange(event.target.value);
  };

  return (
    <Paper
      sx={{
        position: { xs: "static", md: "absolute" },
        left: 20,
        top: 20,
        marginBottom: 2,
        zIndex: 1,
        p: 2,
        width: { xs: "calc(100% - 32px)", md: "250px" },
        height: "fit-content",
        backgroundColor: "white",
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Filter by State</InputLabel>
        <Select
          value={selectedState}
          label="Filter by State"
          onChange={handleChange}
        >
          <MenuItem value="all">All States</MenuItem>
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}

export default StateFilter;
