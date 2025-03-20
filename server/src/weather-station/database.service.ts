import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { WeatherStation } from "../entities/weather-station.entity";
import { Measurement } from "../entities/measurement.entity";

// Internal type used only for CSV import
type Variable = {
  varId: number;
  stationId: number;
  name: string;
  unit: string;
  longName: string;
};

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly dataPath: string;

  constructor(
    @InjectRepository(WeatherStation)
    private weatherStationRepo: Repository<WeatherStation>,
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>
  ) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    this.dataPath = isDevelopment
      ? path.resolve(__dirname, "../../data")
      : path.resolve(__dirname, "../../data");
    this.logger.log(`Data path set to: ${this.dataPath}`);
  }

  async onModuleInit() {
    // Check if data already exists
    const stationCount = await this.weatherStationRepo.count();
    if (stationCount === 0) {
      await this.importData();
    }
  }

  private async importData() {
    try {
      this.logger.log("Starting data import...");

      // Import weather stations
      const stationsPath = path.join(this.dataPath, "weather_stations.csv");
      const stationsData = fs.readFileSync(stationsPath, "utf-8");
      const stations: WeatherStation[] = parse(stationsData, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === "id") return parseInt(value);
          if (context.column === "latitude" || context.column === "longitude")
            return parseFloat(value);
          return value;
        },
      });

      await this.weatherStationRepo.save(stations);
      this.logger.log(`Imported ${stations.length} weather stations`);

      // Import variables
      const variablesPath = path.join(this.dataPath, "variables.csv");
      const variablesData = fs.readFileSync(variablesPath, "utf-8");
      const variables: Variable[] = parse(variablesData, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === "var_id") return parseInt(value);
          if (context.column === "id") return parseInt(value);
          return value;
        },
      }).map((row: any) => ({
        varId: row.var_id,
        stationId: row.id,
        name: row.name,
        unit: row.unit,
        longName: row.long_name,
      }));

      // Import measurements for each station
      for (const station of stations) {
        const measurementFile = path.join(
          this.dataPath,
          `data_${station.id}.csv`
        );

        if (fs.existsSync(measurementFile)) {
          const stationVariables = variables.filter(
            (v) => v.stationId === station.id
          );

          const measurementData = fs.readFileSync(measurementFile, "utf-8");
          const parsedRows = parse(measurementData, {
            columns: true,
            skip_empty_lines: true,
          });

          const measurements: Measurement[] = [];

          parsedRows.forEach((row: any) => {
            Object.entries(row).forEach(([column, value]) => {
              if (column !== "timestamp") {
                const variable = stationVariables.find(
                  (v) => v.name === column
                );
                if (variable) {
                  measurements.push(
                    this.measurementRepo.create({
                      stationId: station.id,
                      variableId: variable.varId,
                      timestamp: row.timestamp,
                      value: parseFloat(value as string),
                      unit: variable.unit,
                      variableName: variable.name,
                      variableLongName: variable.longName,
                      station: station,
                    })
                  );
                }
              }
            });
          });

          // Save measurements in chunks to avoid memory issues
          const chunkSize = 1000;
          for (let i = 0; i < measurements.length; i += chunkSize) {
            const chunk = measurements.slice(i, i + chunkSize);
            await this.measurementRepo.save(chunk);
          }

          this.logger.log(
            `Imported ${measurements.length} measurements for station ${station.id}`
          );
        }
      }

      this.logger.log("Data import completed successfully");
    } catch (error) {
      this.logger.error(`Error importing data: ${error}`);
      throw error;
    }
  }

  async getAllWeatherStations(): Promise<WeatherStation[]> {
    return this.weatherStationRepo.find();
  }

  async getWeatherStationsByState(state: string): Promise<WeatherStation[]> {
    return this.weatherStationRepo.find({
      where: {
        state: state.toUpperCase(),
      },
    });
  }

  async getLatestMeasurements(stationId: number): Promise<Measurement[]> {
    // Get the latest timestamp for the station
    const latestMeasurement = await this.measurementRepo.findOne({
      where: { stationId },
      order: { timestamp: "DESC" },
    });

    if (!latestMeasurement) {
      return [];
    }

    // Get all measurements for that timestamp
    return this.measurementRepo.find({
      where: {
        stationId,
        timestamp: latestMeasurement.timestamp,
      },
    });
  }
}
