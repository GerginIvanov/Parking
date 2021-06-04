const models = require('../shared');

function getFreeSpots() {
    return new Promise((resolve, reject) => {
        models.FreeSpots.findAll({
            where: {
                id: 'freeSpots',
            },
            attributes: [
                'currentSpots',
            ]
        })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    });
}

export {
    getFreeSpots,
}