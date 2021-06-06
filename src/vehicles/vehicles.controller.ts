import * as helper from './vehicle.helper';

function getFreeSpots(req, res, next) {
    try {
        return helper.getFreeSpots().then((response) => {
            return res.status(200).send(response);
        }, (err) => {
            return next(err);
        })
    }
    catch (err) {
        return next(err);
    }
}

function registerVehicle(req, res, next) {
    try {
        return helper.registerVehicle(req.body).then((response) => {
            return res.status(200).send(response);
        }, (err) => {
            return next(err);
        })
    }
    catch (err) {
        return next(err);
    }
}

function deregisterVehicle(req, res, next) {
    try {
        return helper.deregisterVehicle(req.params.licensePlate).then((response) => {
            return res.status(200).send(response);
        }, (err) => {
            return next(err);
        })
    }
    catch (err) {
        return next(err);
    }
}

function checkCurrentFee(req, res, next) {
    try {
        return helper.checkCurrentFee(req.params.licensePlate).then((response) => {
            return res.status(200).send(response);
        }, (err) => {
            return next(err);
        })
    }
    catch (err) {
        return next(err);
    }
}

export {
    getFreeSpots,
    registerVehicle,
    checkCurrentFee,
    deregisterVehicle,
}