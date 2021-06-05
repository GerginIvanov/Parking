const express = require('express');
const router = express.Router();
const vehicleCtrl = require('./vehicles.controller');

router.get('/freeSpots', vehicleCtrl.getFreeSpots);
router.post('/', vehicleCtrl.registerVehicle);
router.post('/:licensePlate', vehicleCtrl.deregisterVehicle);
// router.get('/:licensePlate', vehicleCtrl.getFees);

export default router;