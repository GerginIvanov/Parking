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






















function currentTime(): Promise<any> {
    return new Promise((resolve) => {
        let time = Date.now();
        let currentTime = moment(time);
        resolve(currentTime);
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
                        console.log(`Stay duration: ${Math.round(final)} hours`);
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


function calculatePrice(licensePlate: string, /* hours: number,*/ days: any = null): Promise<any> {  //if we pass a parameter for days it calculates differently
    return new Promise((resolve, reject) => {
        let day, night;
        let fee: number = 0;
        findVehicle(licensePlate)
            .then((vehicle) => {
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

                console.log(`For this vehicle day fee is ${dayFee} and night fee is ${nightFee}`);

                if (days) { //here we calculate if the vehicle has stayed for more than a day
                    let wholeDaysFee = (10 * dayFee + 14 * nightFee) * days;
                    // resolve(wholeDaysFee);
                } else { //here we calculate if the vehicle has stayed for less than a day
                    currentTime()
                        .then(result => {
                            let currentTime1 = moment(result).hours();
                            let currentTime2 = parseInt(currentTime1);
                            registrationTime(licensePlate)
                                .then(result => {
                                    let registrationTime1 = moment(result).hours();
                                    let registrationTime2 = parseInt(registrationTime1);
                                    console.log(registrationTime1, currentTime1);
                                    if (registrationTime1 > currentTime1) { //if arrival > departure
                                        let hours = 23;
                                        while (hours > 0) {
                                            if (hours > currentTime1 && hours < registrationTime1) { //skip the interval when the car was not parked
                                                continue;
                                            }
                                            if (hours > 8 && hours < 18) {
                                                fee += dayFee;
                                            } else {
                                                fee += nightFee;
                                            }
                                            hours--;
                                        }
                                    } else { //if departure > arrival
                                        console.log("Departure was bigger than arrival");
                                        console.log("Current time" + currentTime1);
                                        console.log("Reg time" + registrationTime1);
                                        let hours = 23;
                                        while (hours >= 0) {
                                            if (hours < 20 && hours > 0) { //this actually works; wtf I gotta debug
                                                hours--;
                                                continue;
                                            }
                                            if (hours >= 8 && hours < 18) {
                                                fee += dayFee;
                                                console.log(hours, fee);
                                                hours--;
                                            } else {
                                                fee += nightFee;
                                                console.log(hours, fee);
                                                hours--;
                                            }
                                        }
                                        resolve(fee);
                                    }

                                })
                        })
                }
            })
    });
}

export {
    registerVehicle,
    calculateFreeSpots,
    checkVehicleSize,
    checkAvailableSpace,
    currentTime,
    stayDuration,
    findVehicle,
    calculatePrice,
    registrationTime,
}