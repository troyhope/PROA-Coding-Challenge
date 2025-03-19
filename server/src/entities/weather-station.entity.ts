import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Measurement } from "./measurement.entity";

@Entity()
export class WeatherStation {
  @PrimaryColumn()
  id: number;

  @Column()
  ws_name: string;

  @Column()
  site: string;

  @Column()
  portfolio: string;

  @Column()
  state: string;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  @OneToMany(() => Measurement, (measurement) => measurement.station)
  measurements: Measurement[];
}
