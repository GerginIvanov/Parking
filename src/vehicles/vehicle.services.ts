import { Console } from "console";

const models = require('../shared');
const moment = require('moment');

function registerVehicle(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        //'discount' is an optional parameter so this if-else handles requests without a 'discount' in the req.body
        if (data.discount) {
            models.Vehicles.create({
                licensePlate: data.licensePlate,
                vehicleType: data.vehicleType,
                discount: data.discount,
            })
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject({ message: "Something went wrong: " + err });
                });
        } else {
            models.Vehicles.create({ //check if we can rewrite without if-else
                licensePlate: data.licensePlate,
                vehicleType: data.vehicleType,
            })
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    reject({ message: "Something went wrong: " + err });
                });
        }

    });
}

function calculateFreeSpots(): Promise<any> {
    let array: Array<any> = [];
    let takenSpots: number = 0;
    return new Promise((resolve, reject) => {
        models.Vehicles.findAll()
            .then((allVehicles) => {
                if (allVehicles.length == 0) {
                    resolve(200);
                } else {
                    for (let i = 0; i < allVehicles.length; i++) {
                        array.push(new Promise((resolve, reject) => {
                            checkVehicleSize(allVehicles[i].dataValues.vehicleType)
                                .then(carSize => {
                                    // console.log(carSize);
                                    takenSpots += carSize;
                                    resolve(takenSpots);
                                })
                                .catch((err) => {
                                    reject({ message: "Something went wrong: " + err, });
                                });
                        }));
                    }
                    /**
                     * Basically at this point in the code we have an array which we resolve with Promise.all()
                     * There are N elements in it and each element is the current vehicle size + all the previously taken spots
                     * If we have 4 cars of type C the array is [4, 8, 12, 16]; It slightly resembles a Fibonacci sequence
                     * We use this to take the last element which is the number of spots used and just subtract that from 200
                     */
                    Promise.all(array)
                        .then((result) => {
                            resolve(200 - result[result.length - 1]);
                        })
                        .catch((err) => {
                            reject(err);
                        })
                }

            })

    });
}

function checkVehicleSize(vehicleType: string): Promise<number> {
    return new Promise((resolve, reject) => {
        models.VehicleSize.findOne({
            where: {
                vehicleType: vehicleType,
            }
        })
            .then((result) => {
                resolve(result.dataValues.vehicleSize);
            })
            .catch((err) => {
                reject({ message: "Something went wrong: " + err });
            })
    });
}

function checkAvailableSpace(freeSpots: number, vehicleType: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        checkVehicleSize(vehicleType)
            .then((spaceNeeded) => {
                if (freeSpots > spaceNeeded) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch((err) => {
                reject({ message: "Something went wrong: " + err });
            });
    });
}

function currentTime() {
    return new Promise((resolve, reject) => {
        let time = Date.now();
        let currentTime = moment(time);
        resolve(currentTime);
    });
}

function stayDuration(licensePlate: string) {
    return new Promise((resolve, reject) => {
        models.Vehicles.findOne({
            where: {
                licensePlate: licensePlate,
            }
        })
            .then(result => {

                let time1 = Date.now();
                let currentTime = moment(time1);
                console.log(`The current time is: ${currentTime.format('DD MM H:mm')}`);

                let time2 = result.dataValues.createdAt;
                let carTime = moment(time2);
                console.log(`The car was parked at: ${carTime.format('DD MM H:mm')}`);

                var duration = moment.duration(currentTime.diff(carTime)); //time elapsed between parking and leaving in 
                var final = duration.asHours();
                console.log(`Stay duration: ${Math.round(final)} hours`);
                resolve(Math.round(final));
            })
            .catch((err) => {
                reject({
                    message: "Something went wrong: " + err,
                });
            })
    });
}

function checkDaysStayed(licensePlate: string) {
    return new Promise((resolve, reject) => {
        currentTime()
            .then((currentTime) => {
                let timeRightNow = moment(currentTime);

                models.Vehicles.findOne({
                    where: {
                        licensePlate: licensePlate,
                    }
                })
                    .then((result) => {
                        let time2 = result.dataValues.createdAt;
                        let carTime = moment(time2);

                        var duration = moment.duration(timeRightNow.diff(carTime));
                        var final = duration.asDays();
                        resolve(Math.floor(final));
                    })

            })
    });
}

function calculatePrice(vehicleType: string, dayPassed: boolean = false) {
    if (dayPassed = true) {

    } else {

    }
}

export {
    registerVehicle,
    calculateFreeSpots,
    checkVehicleSize,
    checkAvailableSpace,
    currentTime,
    stayDuration,
    checkDaysStayed,
    calculatePrice,
}