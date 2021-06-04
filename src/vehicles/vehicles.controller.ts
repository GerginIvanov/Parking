import * as helper from './vehicle.helper';

function registerVehicle(req, res, next) {
    try {
        return helper.registerVehicle(req.body).then((response) => {
            return res.status(200).send(response);
        }, (err) => {
            return next(err);
            console.log(err);
        })
    }
    catch (err) {
        return next(err);
    }
}

export {
    registerVehicle,

}