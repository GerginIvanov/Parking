const express = require('express');
const router = express.Router();
const vehicleCtrl = require('./vehicles.controller');

router.get('/freeSpots', vehicleCtrl.getFreeSpots);
router.post('/', vehicleCtrl.registerVehicle);

export default router;