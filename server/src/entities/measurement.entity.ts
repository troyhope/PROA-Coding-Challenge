import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WeatherStation } from "./weather-station.entity";

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationId: number;

  @Column()
  variableId: number;

  @Column()
  timestamp: string;

  @Column("float")
  value: number;

  @Column()
  unit: string;

  @Column()
  variableName: string;

  @Column()
  variableLongName: string;

  @ManyToOne(() => WeatherStation, (station) => station.measurements)
  station: WeatherStation;
}
