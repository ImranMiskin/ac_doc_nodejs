const { Types } = require('mongoose');
const Service = require('../../models/Service/sevice.model');
const JWT_SECRET = 'Admin@1234';  // Keep this secure and hidden (use process.env.JWT_SECRET in real projects)


exports.createService = async (req, res) => {

    const { name, description, terms, category } = req.body;

    const banner_image = req.files['banner_image'] ? req.files['banner_image'][0].path : null;
    const icon = req.files['icon'] ? req.files['icon'][0].path : null;

    const existingService = await Service.findOne({
        name: name,
        category: category,
    });

    if (existingService) {
        return res.status(200).json({
            status: false,
            message: `Service with the name '${name}' already exists in the '${category}' category.`,
        });
    }


    const termData = ['banner_image', 'icon', 'banner_image']
    const descriptionData = ['banner_image', 'icon', 'banner_image']
    const addService = await Service.create({
        name: name,
        icon: icon,
        description: descriptionData,
        terms: termData,
        banner_image: banner_image,
        category: category,
    })

    return res.status(200).json({
        status: true,
        message: 'Service created successfully'
    });
};

exports.editService = async (req, res) => {

    const { serviceId } = req.params; // Service ID from the URL
    const { name, description, terms, category } = req.body;


    const banner_image = req.files['banner_image'] ? req.files['banner_image'][0].path : null;
    const icon = req.files['icon'] ? req.files['icon'][0].path : null;

    const service = await Service.findById(serviceId);

    if (!service) {
        return res.status(404).json({
            message: 'Service not found',
        });
    }

    const existingService = await Service.findOne({
        _id: { $ne: serviceId },
        name: name,
        category: category,
    });

    if (existingService) {
        return res.status(400).json({
            message: `Another service with the name '${name}' already exists in the '${category}' category.`,
        });
    }

    const descriptionData = JSON.parse(description)
    const termData = JSON.parse(terms)

    // Save the updated service to the database
    await Service.findOneAndUpdate(
        { _id: new Types.ObjectId(serviceId) },
        {
            name: name,
            description: descriptionData,
            terms: termData,
            icon: icon || service.icon,
            banner_image: banner_image || service.banner_image,
            category: category
        },
        { new: true }
    );
    return res.status(200).json({
        status: true,
        message: 'Service updated successfully!',
    });
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
exports.singleServiceGetById = async (req, res) => {
    const { serviceId } = req.params;

    const findById = await Service.findById(serviceId);

    // console.log("ddddddddddd");

    if (findById) {
        return res.status(200).json({
            status: true,
            data: findById
        });
    } else {
        return res.status(200).json({
            status: false,
            message: 'Service not found'
        });
    }
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
exports.serviceActiveInactive = async (req, res) => {
    const { serviceId } = req.params;

    const findById = await Service.findById(serviceId);

    // console.log("ddddddddddd");

    if (findById) {

        if (findById.isActive == 0) {

            await Service.findOneAndUpdate(
                { _id: new Types.ObjectId(serviceId) },
                {
                    isActive: 1
                });
            return res.status(200).json({
                status: true,
                message: 'Service De-activated'
            });
        } else {
            await Service.findOneAndUpdate(
                { _id: new Types.ObjectId(serviceId) },
                {
                    isActive: 0
                });
            return res.status(200).json({
                status: true,
                message: 'Service activated'
            });
        }
    } else {
        return res.status(200).json({
            status: false,
            message: 'Service not found'
        });
    }
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
exports.serviceList = async (req, res) => {
    const { limit, offset, search } = req.body;

    console.log("GGGGGGGGGGG",req.user);
    const limitNum = parseInt(limit, 10) || 10;
    const page = offset || 1;
    const offsetNum = (page - 1) * limit || 0;


    const findList = await Service.find({
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ]
    }).skip(offsetNum)
        .limit(limitNum)


    if (findList.length > 0) {

        return res.status(200).json({
            status: true,
            data: findList
        });
    } else {
        return res.status(200).json({
            status: false,
            message: 'Service not found'
        });
    }
};

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
exports.serviceMobileList = async (req, res) => {


    const findList = await Service.find({
        isActive: 0
    })

    if (findList.length > 0) {

        return res.status(200).json({
            status: true,
            data: findList
        });
    } else {
        return res.status(200).json({
            status: false,
            message: 'Service not found'
        });
    }
};

