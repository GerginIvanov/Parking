'use strict';
import { Sequelize } from 'sequelize';
import { VehiclesFactory, VehicleStatic } from './vehicles';
import { VehicleSizeFactory, VehicleSizeStatic } from './vehicle_size';

const config = require('../config/config');

export interface DB {
    sequelize: Sequelize,
    Vehicles: VehicleStatic,
    VehicleSize: VehicleSizeStatic,
}

const sequelize = new Sequelize(config);


export const Vehicles = VehiclesFactory(sequelize);
export const VehicleSize = VehicleSizeFactory(sequelize);

/*
    DB relations are defined here
*/

Vehicles.belongsTo(VehicleSize,{
    foreignKey:{
        name: 'vehicleType',
    }
});

VehicleSize.hasMany(Vehicles, {
    foreignKey: {
        name: 'vehicleType',
    }
});

export const db: DB = {
    sequelize,
    VehicleSize,
    Vehicles,
}