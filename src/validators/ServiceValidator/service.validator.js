const Joi = require('joi');


const createServiceSchema = Joi.object({

    // name: Joi.string().required().messages({
    //     'any.required': 'Service name is required',
    //     // 'string.empty': 'Service name cannot be empty',
    // }),

    description: Joi.string().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be empty',
    }),
    terms: Joi.string().required().messages({
        'any.required': 'Service terms is required',
        'string.empty': 'Service terms cannot be empty',
    }),
    category: Joi.string().required().messages({
        'any.required': 'Category is required',
        'string.empty': 'Category cannot be empty',
    }),
    // icon: Joi.string().required().messages({
    //     'any.required': 'Icon is required',
    //     'string.empty': 'Icon cannot be empty',
    // }),
    // banner_image: Joi.string().required().messages({
    //     'any.required': 'Banner Image is required',
    //     'string.empty': 'Banner Image cannot be empty',
    // }),
});

const createValidateService = (req, res, next) => {
    const { error } = createServiceSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details[0].message,
        });
    }
    next();
};

module.exports = { createValidateService };