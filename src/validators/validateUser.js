const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);  // Extending Joi with objectId support

const mongoose = require('mongoose');  // For validating ObjectId

const userLoginSchema = Joi.object({
    phoneNumber: Joi.string().required().messages({
        'string.phoneNumber': 'Please provide a valid phoneNumber',
        'string.empty': 'Phone number is required'
    }),
    countryCode: Joi.string().required().messages({
        'string.empty': 'Country code is required'
    })
});

const loginUser = (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    next();
};

const userVerifyOTPSchema = Joi.object({
    userId: Joi.objectId().required().messages({
        'any.required': 'User ID is required',
        'string.pattern.name': 'Please provide a valid MongoDB ObjectId'
    }),
    otp: Joi.number().min(4).required().messages({
        'any.required': 'OTP is required',
        'number.base': 'OTP must be a number',
        'number.min': 'OTP must be at least 3 digits long'
    })
});

const verifyOTPUser = (req, res, next) => {
    const { error } = userVerifyOTPSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    next();
};


const userResendOTPSchema = Joi.object({
    phoneNumber: Joi.string().required().messages({
        'string.phoneNumber': 'Please provide a valid phoneNumber',
        'string.empty': 'Phone number is required'
    }),
    countryCode: Joi.string().required().messages({
        'string.empty': 'Country code is required'
    })
});

const resendOTPUser = (req, res, next) => {
    const { error } = userResendOTPSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    next();
};

const userProfileSchema = Joi.object({
    userName: Joi.string()
        .required()
        .messages({
            'string.base': 'User name must be a string.',
            'string.empty': 'User name cannot be empty.',
            'any.required': 'User name is required.'
        }),
    userId: Joi.string()
        .required()
        .messages({
            'string.base': 'User ID must be a string.',
            'string.empty': 'User ID cannot be empty.',
            'any.required': 'User ID is required.'
        }),
});

const profileUpdate = (req, res, next) => {
    const { error } = userProfileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: false, message: error.details[0].message });
    }
    next();
};
module.exports = { loginUser, verifyOTPUser, resendOTPUser, profileUpdate }
