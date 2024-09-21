const express = require('express');
const locationController = require('../../controllers/locationController/location.controller');
const router = express.Router();


router.post('/check-availability',  locationController.checkAvailability);
console.log("object");
module.exports = router;
