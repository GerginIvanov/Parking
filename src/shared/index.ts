'use strict';
import { Sequelize } from 'sequelize';
import { FreeSpotsFactory, FreeSpotsStatic } from './free_spots';

const config = require('../config/config');

export interface DB {
    sequelize: Sequelize,
    FreeSpots: FreeSpotsStatic,
}

const sequelize = new Sequelize(config);

export const FreeSpots = FreeSpotsFactory(sequelize);

export const db: DB = {
    sequelize,
    FreeSpots,
}