'use strict';

import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface VehicleAttributes {
    licensePlate: string,
    discount: string,
};

export interface VehicleModel extends Model<VehicleAttributes>, VehicleAttributes { };
export class Vehicles extends Model<VehicleModel, VehicleAttributes> { };

export type VehicleStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): VehicleModel;
};

export function VehiclesFactory(sequelize: Sequelize): VehicleStatic {
    return <VehicleStatic>sequelize.define('vehicles', {
        licensePlate: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        discount: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    }, {
        timestamps: true,
    });
};

