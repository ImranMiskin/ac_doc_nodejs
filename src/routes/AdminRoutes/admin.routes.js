const express = require('express');
const adminController = require('../../controllers/AdminController/admin.controller');
const router = express.Router();

router.post('/login', adminController.adminLogin);

router.post('/generate-refresh-token', adminController.generateRefreshToken);


module.exports = router;
