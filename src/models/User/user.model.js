const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    otp: {
        type: Number
    },
    otpExpiryTime: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    isOtpVerify: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
