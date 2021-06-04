const models = require('../shared');

function getFreeSpots(): Promise<any> {
    return new Promise((resolve, reject) => {
        models.FreeSpots.findOne({
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