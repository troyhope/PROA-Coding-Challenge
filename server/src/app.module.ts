import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeatherStationModule } from "./weather-station/weather-station.module.js";
import { WeatherStation } from "./entities/weather-station.entity";
import { Measurement } from "./entities/measurement.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "weather_stations.sqlite",
      entities: [WeatherStation, Measurement],
      synchronize: true, // Only use this for development
    }),
    WeatherStationModule,
  ],
})
export class AppModule {}
