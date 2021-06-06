const models = require('../shared');
const moment = require('moment');

function registerVehicle(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        //'discount' is an optional parameter so this if-else handles requests without a 'discount' in the req.body
        if (data.discount) {
            models.Vehicles.create({
                licensePlate: data.licensePlate,
                vehicleType: data.vehicleType,
                discountType: data.discount,
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
                            checkVehicleInfo(allVehicles[i].dataValues.vehicleType)
                                .then(carSize => {
                                    takenSpots += carSize.dataValues.vehicleSize;
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

function checkVehicleInfo(vehicleType: string): Promise<any> {
    return new Promise((resolve, reject) => {
        models.VehicleSize.findOne({
            where: {
                vehicleType: vehicleType,
            }
        })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject({ message: "Something went wrong: " + err });
            })
    });
}

function checkAvailableSpace(freeSpots: number, vehicleType: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        checkVehicleInfo(vehicleType)
            .then((spaceNeeded) => {
                console.log(spaceNeeded);
                if (freeSpots > spaceNeeded.dataValues.vehicleSize) {
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

function findVehicle(licensePlate: string): Promise<any> {
    return new Promise((resolve, reject) => {
        models.Vehicles.findOne({
            where: {
                licensePlate: licensePlate,
            }
        })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

function currentTime(): Promise<any> {
    return new Promise((resolve) => {
        let time = Date.now();
        let currentTime = moment(time);
        resolve(currentTime);
    });
}

function registrationTime(licensePlate: string): Promise<any> {
    return new Promise((resolve, reject) => {
        findVehicle(licensePlate)
            .then((vehicle) => {
                resolve(vehicle.dataValues.createdAt);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

function stayDuration(licensePlate: string) { //this will need some cleaning up tomorrow
    return new Promise((resolve, reject) => {
        registrationTime(licensePlate)
            .then(carRegistrationTime => {
                currentTime()
                    .then((currentTime) => {
                        let time2 = carRegistrationTime;
                        let carTime = moment(time2);

                        console.log(`The car was parked at: ${carTime.format('H:mm')}`);
                        console.log(`The current time is: ${currentTime.format('H:mm')}`);

                        var duration = moment.duration(currentTime.diff(carTime)); //time elapsed between parking and leaving in 
                        var final = duration.asHours();
                        console.log(`Stay duration: ${Math.round(final) + 1} hours`);
                        resolve(Math.round(final));
                    })

            })
            .catch((err) => {
                reject({
                    message: "Something went wrong: " + err,
                });
            })
    });
}

function arrivalLargerThanDeparture(currentTime: number, registrationTime: number, day: number, night: number): Promise<number> {
    let fee: number = 0;
    const dayFee = day;
    const nightFee = night;
    return new Promise((resolve) => {
        let hours = 0;
        console.log(`Arrival is larger than departure`);
        while (hours < 24) {
            if (hours > currentTime && hours < registrationTime) { //skip the interval when the car was not parked
                hours++;
                continue;
            } else if (hours >= 8 && hours < 18) {
                fee += dayFee;
                hours++;
            } else {
                fee += nightFee;
                hours++;
            }
        }
        resolve(fee);
    });
}

function arrivalLessThanDeparture(currentTime: number, registrationTime: number, day: number, night: number): Promise<number> {
    let fee: number = 0;
    const dayFee = day;
    const nightFee = night;
    console.log("Arrival is less than departure");
    return new Promise((resolve) => {
        let hours = 0;
        while (hours < 24) {
            if (hours < registrationTime || hours > currentTime) {
                hours++;
                continue;
            } else if (hours >= 8 && hours < 18) {
                fee += dayFee;
                hours++;
            } else {
                fee += nightFee;
                hours++;
            }
        }
        resolve(fee);
    });
}

function getDiscount(discountType: string): Promise<number> {
    return new Promise((resolve, reject) => {
        if (discountType === null) {
            resolve(0);
        } else {
            models.Discount.findOne({
                where: {
                    discountType: discountType
                }
            })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject({
                        message: "Something went wrong: " + err,
                    });
                })
        }
    });
}

function deregisterVehicle(licensePlate: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        models.Vehicle.destroy({
            where: {
                licensePlate: licensePlate,
            }
        })
            .then(() => {
                resolve(true);
            })
            .catch((err) => {
                reject({
                    message: "Something went wrong: " + err,
                });
            })
    });
}

export {
    registerVehicle,
    calculateFreeSpots,
    checkVehicleInfo,
    checkAvailableSpace,
    currentTime,
    stayDuration,
    findVehicle,
    deregisterVehicle,
    registrationTime,
    arrivalLargerThanDeparture,
    arrivalLessThanDeparture,
    getDiscount,
}