export type WeatherStation = {
    id: number;
    wsName: string;
    site: string;
    portfolio: string;
    state: string;
    latitude: number;
    longitude: number;
};
export type Variable = {
    varId: number;
    stationId: number;
    name: string;
    unit: string;
    longName: string;
};
export type Measurement = {
    stationId: number;
    variableId: number;
    timestamp: Date;
    value: number;
    unit: string;
    variableName: string;
    variableLongName: string;
};
