'use strict';
import { Sequelize } from 'sequelize';
import { FreeSpotsFactory, FreeSpotsStatic } from './free_spots';
import { VehiclesFactory, VehicleStatic } from './vehicles';

const config = require('../config/config');

export interface DB {
    sequelize: Sequelize,
    FreeSpots: FreeSpotsStatic,
    Vehicles: VehicleStatic,
}

const sequelize = new Sequelize(config);

export const FreeSpots = FreeSpotsFactory(sequelize);
export const Vehicles = VehiclesFactory(sequelize);

export const db: DB = {
    sequelize,
    FreeSpots,
    Vehicles,
}