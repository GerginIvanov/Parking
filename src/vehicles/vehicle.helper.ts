import { PromiseResponse } from '../shared/promise.helper';
const services = require('./vehicle.services');

function getFreeSpots(): Promise<PromiseResponse> {
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

/**
 * First we check how many free spots are left
 * Then we compare that with how large a vehicle is
 * If there is enough room we register :) 
 */
function registerVehicle(data: any): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.calculateFreeSpots()
            .then((freeSpots) => {
                services.checkAvailableSpace(freeSpots, data.vehicleType)
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

function checkCurrentFee(licensePlate: string): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.checkCurrentFee(licensePlate)
            .then(result => {
                resolve(new PromiseResponse(
                    'Success',
                    `Vehicle with license plate ${licensePlate}'s current current fee is ${result} lv.`,
                ))
            })
            .catch((err) => {
                reject({
                    status: "Error",
                    message: "Something went wrong: " + err,
                });
            })
    });
}

function deregisterVehicle(licensePlate: string): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.checkCurrentFee(licensePlate)
            .then(result => {
                services.deregisterVehicle(licensePlate)
                    .then(() => {
                        resolve(new PromiseResponse(
                            'Success',
                            result,
                            `Vehicle with license plate ${licensePlate} has been deregistered and the final fee is ${result} lv.`
                        ))
                    })
            })
            .catch((err) => {
                reject({
                    status: "Error",
                    message: "Something went wrong: " + err,
                });
            })
    });
}

export {
    getFreeSpots,
    registerVehicle,
    checkCurrentFee,
    deregisterVehicle,
}