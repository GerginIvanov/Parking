import { PromiseResponse } from '../shared/promise.helper';
import { checkAvailableSpace, stayDuration } from './vehicle.services';
const moment = require('moment');
require('dotenv').config();
const services = require('./vehicle.services');

function getFreeSpots() {
    return new Promise((resolve, reject) => {
        services.calculateFreeSpots()
            .then((result) => {
                resolve(new PromiseResponse(
                    'Success', //these statuses can be used for unit testing
                    `There are currently ${result} free spots`,
                ));
            })
            .catch((err) => {
                reject({
                    status: "Error",
                    message: "Something went wrong: " + err,
                });
            })
    });
}

function registerVehicle(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        services.calculateFreeSpots()
            .then((freeSpots) => {
                checkAvailableSpace(freeSpots, data.vehicleType)
                    .then((result) => {
                        if (result === true) {
                            services.registerVehicle(data)
                                .then(() => {
                                    resolve(new PromiseResponse(
                                        'Success',
                                        `Vehicle with license ${data.licensePlate} has been registered!`,
                                    ))
                                })
                        } else {
                            resolve(new PromiseResponse(
                                'Success',
                                "Unfortunately we don't have enough space!",
                            ));
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
    });
}

//note: cannot resolve as this is POST request
/**
 * 
 * 1. Also add a table for discounts to normalize
 * 2. Add the discounts into the code calculations; I think this needs a getDiscount(licensePlate) method
 * 3. Check if I can skip the if-else in the registerVehicle() method
 * 4. Refactor the entire deregisterVehicle() funcitionality to have a good structure 
 * 5. See if I have time to move the prices to the DB
 */

function checkCurrentFee(licensePlate: string): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.stayDuration(licensePlate)
            .then(stayDuration => {
                services.findVehicle(licensePlate)
                    .then((vehicle) => {
                        let day, night;

                        if (vehicle.dataValues.vehicleType === "A") {
                            day = process.env.costDayA;
                            night = process.env.costNightB;
                        } else if (vehicle.dataValues.vehicleType === "B") {
                            day = process.env.costDayB;
                            night = process.env.costNightB;
                        } else {
                            day = process.env.costDayC;
                            night = process.env.costNightC;
                        }
                        const dayFee = parseInt(day);
                        const nightFee = parseInt(night);

                        const days = Math.floor(stayDuration / 24);
                        const dayFormula = (10 * dayFee + 14 * nightFee) * days;

                        services.currentTime()
                            .then(result => {
                                let currentTime = moment(result).hours();
                                services.registrationTime(licensePlate)
                                    .then(result => {
                                        //use reg/dereg times in whole hour format 
                                        let registrationTime = moment(result).hours();

                                        if (registrationTime > currentTime) {
                                            services.arrivalLargerThanDeparture(currentTime, registrationTime, dayFee, nightFee)
                                                .then((result) => {
                                                    resolve(new PromiseResponse(
                                                        'Success',
                                                        `Vehicle with license plate ${licensePlate} owes ${result + dayFormula} lv.`,
                                                    ));
                                                })
                                                .catch((err) => {
                                                    reject({
                                                        status: "Error",
                                                        message: "Something went wrong: " + err,
                                                    });
                                                });
                                        } else {
                                            services.arrivalLessThanDeparture(currentTime, registrationTime, dayFee, nightFee)
                                                .then((result) => {
                                                    console.log(result, dayFormula, result + dayFormula);
                                                    resolve(new PromiseResponse(
                                                        'Success',
                                                        `Vehicle with license plate ${licensePlate} owes ${result + dayFormula} lv.`,
                                                    ));
                                                })
                                                .catch((err) => {
                                                    reject({
                                                        status: "Error",
                                                        message: "Something went wrong: " + err,
                                                    });
                                                });
                                        }

                                    })
                            })
                    }
                    )


            })
    });
}

export {
    getFreeSpots,
    registerVehicle,
    checkCurrentFee,
}

