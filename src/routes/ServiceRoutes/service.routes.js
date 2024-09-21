const express = require('express');
const serviceController = require('../../controllers/ServiceController/service.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createValidateService } = require('../../validators/ServiceValidator/service.validator');
const adminAuthenticateToken = require('../../middlewares/Admin/admin.auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Save to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format. Only JPEG or PNG allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Max file size 5MB
    },
    fileFilter: fileFilter,
});

const uploadFields = upload.fields([
    { name: 'banner_image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
]);

router.post('/add-service', adminAuthenticateToken, uploadFields, serviceController.createService);


router.post('/edit-service/:serviceId', adminAuthenticateToken, uploadFields, serviceController.editService);


router.post('/service-get-by-id/:serviceId', adminAuthenticateToken, serviceController.singleServiceGetById);


router.post('/service-active-inactive/:serviceId', adminAuthenticateToken, serviceController.serviceActiveInactive);


router.post('/service-admin-all-list', adminAuthenticateToken, serviceController.serviceList);


router.post('/service-mobile-list', serviceController.serviceMobileList);




module.exports = router;
