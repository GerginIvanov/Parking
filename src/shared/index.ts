'use strict';
import { Sequelize } from 'sequelize';
import { VehiclesFactory, VehicleStatic } from './vehicles';
import { VehicleSizeFactory, VehicleSizeStatic } from './vehicle_size';
import { DiscountFactory, DiscountStatic } from './discount';

const config = require('../config/config');

export interface DB {
    sequelize: Sequelize,
    Vehicles: VehicleStatic,
    VehicleSize: VehicleSizeStatic,
    Discount: DiscountStatic,
}

const sequelize = new Sequelize(config);


export const Vehicles = VehiclesFactory(sequelize);
export const VehicleSize = VehicleSizeFactory(sequelize);
export const Discount = DiscountFactory(sequelize);

/*
    DB relations are defined here
*/

Vehicles.belongsTo(VehicleSize, {
    foreignKey: {
        name: 'vehicleType',
    }
});

VehicleSize.hasMany(Vehicles, {
    foreignKey: {
        name: 'vehicleType',
    }
});


// Vehicles.belongsTo(Discount);

Discount.hasMany(Vehicles, {
    foreignKey: {
        name: 'discountType',
    }
});


export const db: DB = {
    sequelize,
    VehicleSize,
    Vehicles,
    Discount,
}