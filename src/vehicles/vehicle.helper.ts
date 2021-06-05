import { PromiseResponse } from '../shared/promise.helper';
import { checkAvailableSpace, stayDuration } from './vehicle.services';
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
 * 1. Get the current time
 * 2. Get the time when the car was parked
 * 3. Calculate elapsed time 
 * 4. Figure out how much of that is day and night
 *
 */

function deregisterVehicle(licensePlate: string): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.stayDuration(licensePlate) //this one works and doesnt throw errors
            .then(stayDuration => {
                if (stayDuration > 24) {
                    const days = Math.floor(stayDuration / 24);
                    services.calculatePrice(licensePlate, stayDuration, days)
                        .then((fee) => {
                            console.log(`You owe at least ${fee}lv. currently!`);
                        })
                }
            })
    });
}

export {
    getFreeSpots,
    registerVehicle,
    deregisterVehicle,
}

