import { PromiseResponse } from '../shared/promise.helper';
require('dotenv').config();
const services = require('./vehicle.services');
const FreeSpots = require('../freeSpots/freeSpots.services');

function registerVehicle(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        /**
         * This code allows us to take the required space for each vehicle from a .env file
         * The alternative would be to store the space in variables here but I think this way is better
         * because if we extend the app in the future and reuse the space variables in multiple files
         * changing their values will be a lot easier with a single .env file instead of declaring constants in each file
         */
        let placeholder: any;
        if (data.vehicleType === 'A') {
            placeholder = process.env.A;
        } else if (data.vehicleType === "B") {
            placeholder = process.env.B;
        } else {
            placeholder = process.env.C;
        }
        const spaceNeeded: number = parseInt(placeholder);

        FreeSpots.getFreeSpots() //check how many spots we have free at the moment
            .then((freeSpots) => {
                if (freeSpots.dataValues.currentSpots > spaceNeeded) { //compare free spots to what we need for current vehicle
                    services.registerVehicle(data)
                        .then(
                            FreeSpots.subtractFreeSpots(spaceNeeded) //update the space in the parking lot
                        )
                        .then(() => {
                            resolve(new PromiseResponse(
                                'Success',
                                `Vehicle with number ${data.licensePlate} has been registered!`
                            ));
                        })
                        .catch((err) => {
                            reject({
                                status: "Error",
                                message: "Something went wrong: " + err,
                            });
                        });
                } else {
                    resolve(new PromiseResponse(
                        'Success',
                        'We do not have enough free space for your vehicle',
                    ));
                }
            });
    });
}

export {
    registerVehicle,

}