const express = require('express');
let router = express.Router();
const freeSpotsCtrl = require('./freeSpots.controller');

router.get('/', freeSpotsCtrl.getFreeSpots);

export default router;