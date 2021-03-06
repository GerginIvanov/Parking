const express = require('express');
const router = express.Router();
const vehicleCtrl = require('./vehicles.controller');

router.get('/freeSpots', vehicleCtrl.getFreeSpots);
router.post('/', vehicleCtrl.registerVehicle);
router.get('/:licensePlate', vehicleCtrl.checkCurrentFee);
router.delete('/:licensePlate', vehicleCtrl.deregisterVehicle);

export default router;