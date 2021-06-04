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

function subtractFreeSpots(size: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        models.FreeSpots.findOne({
            where: {
                id: 'freeSpots',
            }
        })
            .then(foundSpots => {
                models.FreeSpots.upsert({
                    id: 'freeSpots',
                    currentSpots: foundSpots.currentSpots - size,
                })
            })
            .then(() => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

export {
    getFreeSpots,
    subtractFreeSpots,
}