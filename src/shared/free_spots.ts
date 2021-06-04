'use strict';

import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface FreeSpotsAttributes {
    id: string,
    currentSpots: bigint,
};

export interface FreeSpotsModel extends Model<FreeSpotsAttributes>, FreeSpotsAttributes { };
export class FreeSpots extends Model<FreeSpotsModel, FreeSpotsAttributes> { };

export type FreeSpotsStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): FreeSpotsModel;
};

export function FreeSpotsFactory(sequelize: Sequelize): FreeSpotsStatic {
    return <FreeSpotsStatic>sequelize.define('free_spots', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        currentSpots: {
            type: DataTypes.BIGINT,
        }
    }, {
        timestamps: true,
    });
};

