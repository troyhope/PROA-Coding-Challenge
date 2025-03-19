import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeatherStationController } from "./weather-station.controller";
import { DatabaseService } from "./database.service";
import { WeatherStation } from "../entities/weather-station.entity";
import { Measurement } from "../entities/measurement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WeatherStation, Measurement])],
  controllers: [WeatherStationController],
  providers: [DatabaseService],
})
export class WeatherStationModule {}
