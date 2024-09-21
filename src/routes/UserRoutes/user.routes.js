const express = require('express');
const userController = require('../../controllers/UserController/user.controller');
const { loginUser, verifyOTPUser, resendOTPUser, profileUpdate } = require('../../validators/validateUser');
const router = express.Router();

// router.get('/', userController.getUsers);
router.post('/login', loginUser, userController.createUser);

router.post('/verify-otp', verifyOTPUser, userController.verifyOtp);

router.post('/resend-otp', resendOTPUser, userController.resendOtp);

router.post('/profile-update', profileUpdate, userController.updateProfile);

module.exports = router; 
