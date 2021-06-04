const express = require('express');
const router = express.Router();
const vehicleCtrl = require('./vehicles.controller');

router.post('/', vehicleCtrl.registerVehicle);

export default router;