'use strict';
import { Sequelize } from 'sequelize';

//const config = require(route_to_config)

export interface DB {

}

const sequelize = new Sequelize();


export const db: DB = {
    sequelize,

}