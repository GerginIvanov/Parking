'use strict';

import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface VehicleSizeAttributes {
    vehicleType: string,
    vehicleSize: bigint,
};

export interface VehicleSizeModel extends Model<VehicleSizeAttributes>, VehicleSizeAttributes { };
export class VehicleSize extends Model<VehicleSizeModel, VehicleSizeAttributes> { };

export type VehicleSizeStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): VehicleSizeModel;
};

export function VehicleSizeFactory(sequelize: Sequelize): VehicleSizeStatic {
    return <VehicleSizeStatic>sequelize.define('vehicle_size', {
        vehicleType: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        vehicleSize: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};

