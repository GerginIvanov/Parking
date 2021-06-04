import * as helper from './freeSpots.helper';

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

export {
    getFreeSpots,
}