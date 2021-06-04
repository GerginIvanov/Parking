import { PromiseResponse } from '../shared/promise.helper';
const services = require('./freeSpots.services');

function getFreeSpots() {
    return new Promise((resolve, reject) => {
        services.getFreeSpots()
            .then((result) => {
                resolve(new PromiseResponse(
                    'Success',
                    result,
                ));
            })
            .catch((err) => {
                reject({
                    status: "Error",
                    message: "Something went wrong: " + err,
                });
            });
    });
}

export {
    getFreeSpots,
}