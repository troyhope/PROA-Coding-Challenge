import { Controller, Get, Query, Logger } from "@nestjs/common";
import { WeatherStation, Measurement } from "@shared/types";
import { DatabaseService } from "./database.service";

@Controller("api/weatherstation")
export class WeatherStationController {
  private readonly logger = new Logger(WeatherStationController.name);

  constructor(private readonly databaseService: DatabaseService) {
    this.logger.log("WeatherStationController initialized");
  }

  @Get("getweatherstations")
  async getWeatherStations(
    @Query("state") state?: string
  ): Promise<WeatherStation[]> {
    this.logger.log(`getWeatherStations called with state: ${state}`);
    const result = state
      ? await this.databaseService.getWeatherStationsByState(state)
      : await this.databaseService.getAllWeatherStations();
    this.logger.log(`Returning ${result.length} stations`);
    return result;
  }

  @Get("getlatestmeasurements")
  async getLatestMeasurements(
    @Query("stationId") stationId: string
  ): Promise<Measurement[]> {
    this.logger.log(
      `getLatestMeasurements called with stationId: ${stationId}`
    );
    const result = await this.databaseService.getLatestMeasurements(
      parseInt(stationId)
    );
    this.logger.log(`Returning ${result.length} measurements`);
    return result;
  }
}
