const models = require('../shared');
const moment = require('moment');

function registerVehicle(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
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
    });
}

function calculateFreeSpots(): Promise<any> {
    let takenSpots: number = 0;
    return new Promise((resolve, reject) => {
        models.Vehicles.findAll({
            include: [
                {
                    model: models.VehicleSize,
                    attributes: [
                        'vehicleSize'
                    ]
                }
            ]
        })
            .then((allVehicles) => {
                if (allVehicles.length == 0) {
                    resolve(200);
                } else {

                    for (let i = 0; i < allVehicles.length; i++) {
                        takenSpots += allVehicles[i].dataValues.vehicle_size.dataValues.vehicleSize;
                    }
                    resolve(takenSpots);
                }
            })
            .catch((err) => {
                reject({
                    message: "Something went wrong: " + err,
                });
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
            },
            include: [
                {
                    model: models.VehicleSize,
                }
            ]
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

function stayDuration(licensePlate: string): Promise<any> {
    return new Promise((resolve, reject) => {
        registrationTime(licensePlate)
            .then(carRegistrationTime => {
                currentTime()
                    .then((currentTime) => {
                        let time2 = carRegistrationTime;
                        let carTime = moment(time2);

                        console.log(`The car was parked on: ${carTime.format('DD MM HH:mm')}`);
                        console.log(`The current time is: ${currentTime.format('DD MM HH:mm')}`);

                        var duration = moment.duration(currentTime.diff(carTime)); //time elapsed between parking and leaving in 
                        var final = duration.asHours();
                        console.log(`Stay duration: ${Math.round(final) + 1} hours`);
                        resolve(Math.round(final)); //rounding the hours because the vehicle is taxed at the beginning of each hour
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

function getDiscount(discountType: string): Promise<any> {
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
        models.Vehicles.destroy({
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

/**
 * I know this method is quite lengthy but I tried to separate almost any operations out of it
 * This is mainly logic I use to call the correct methods and it was originally in the helper
 * but I moved it here so I can reuse it for both checking current fee and checking final sum when deregistering
 * 
 * An overview of the worflow is:
 * - check how long the car has been parked for and save the number of whole days in a variable
 * - find the vehicle info by license plate and form there collect info about the discount and vehicle type
 * - then use the vehicle type to get the correct pricing rate
 * - from here the program just gets the current time and the time when the car was registered
 * - then a comparison is made because the calculations are a bit different so I have two methods
 */

function checkCurrentFee(licensePlate: string): Promise<any> {
    let discountAmmount: number = 0;
    return new Promise((resolve, reject) => {
        stayDuration(licensePlate)
            .then(stayDuration => {
                findVehicle(licensePlate)
                    .then((vehicle) => {
                        console.log(vehicle.dataValues.vehicle_size.dataValues);
                        getDiscount(vehicle.dataValues.discountType)
                            .then((discountType) => {
                                discountAmmount = discountType.dataValues.ammount;
                            })
                        checkVehicleInfo(vehicle.dataValues.vehicleType)
                            .then((vehicleInfo) => {

                                const dayFee = vehicleInfo.dataValues.dayPrice;
                                const nightFee = vehicleInfo.dataValues.nightPrice;
                                const days = Math.floor(stayDuration / 24);
                                const dayFormula = (10 * dayFee + 14 * nightFee) * days;

                                currentTime()
                                    .then(result => {
                                        let currentTime = moment(result).hours();
                                        registrationTime(licensePlate)
                                            .then(result => {
                                                //use reg/dereg times in whole hour format 
                                                let registrationTime = moment(result).hours();

                                                if (registrationTime > currentTime) {
                                                    arrivalLargerThanDeparture(currentTime, registrationTime, dayFee, nightFee)
                                                        .then((result) => {
                                                            resolve(result + dayFormula - ((result + dayFormula) * discountAmmount / 100));
                                                        })
                                                        .catch((err) => {
                                                            reject({
                                                                status: "Error",
                                                                message: "Something went wrong: " + err,
                                                            });
                                                        });
                                                } else {
                                                    arrivalLessThanDeparture(currentTime, registrationTime, dayFee, nightFee)
                                                        .then((result) => {
                                                            resolve(result + dayFormula - ((result + dayFormula) * discountAmmount / 100));
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
                            })
                    })
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
    checkCurrentFee,
}