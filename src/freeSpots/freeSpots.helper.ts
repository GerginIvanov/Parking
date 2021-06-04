import { PromiseResponse } from '../shared/promise.helper';
const services = require('./freeSpots.services');

function getFreeSpots(): Promise<PromiseResponse> {
    return new Promise((resolve, reject) => {
        services.getFreeSpots()
            .then((result) => {
                resolve(new PromiseResponse(  //this status 'success' can be used for unit testing
                    'Success',
                    result,
                ));
            })
            .catch((err) => {
                console.log(err);
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