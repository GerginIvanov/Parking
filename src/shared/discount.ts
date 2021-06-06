'use strict';
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

interface DiscountAttributes {
    discountType: string,
    ammount: bigint,
};

export interface DiscountModel extends Model<DiscountAttributes>, DiscountAttributes { };
export class Discount extends Model<DiscountModel, DiscountAttributes> { };

export type DiscountStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): DiscountModel;
};

export function DiscountFactory(sequelize: Sequelize): DiscountStatic {
    return <DiscountStatic>sequelize.define('discount', {
        discountType: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        ammount: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};

