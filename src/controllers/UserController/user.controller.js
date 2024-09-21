const User = require('../../models/User/user.model');
const jwt = require('jsonwebtoken');
const { generateRandom4Digit } = require('../../Utils/common')
const JWT_SECRET = 'User@1234';  // Keep this secure and hidden (use process.env.JWT_SECRET in real projects)

// Create a new user
exports.createUser = async (req, res) => {
    // Get 4 digit number for OTP
    const getOTP = generateRandom4Digit()
    const currentTime = new Date().getTime();
    const generateOtpExpiryTime = new Date(currentTime + 2 * 60 * 1000).getTime()

    const phoneNumber = req.body.phoneNumber;
    const countryCode = req.body.countryCode;


    const findUser = await User.findOne({ phoneNumber: phoneNumber, countryCode: countryCode })
    // console.log("::::::::::", findUser);

    if (findUser) {
        const assessToken = jwt.sign({ findUser }, JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ findUser }, JWT_SECRET);

        await User.updateOne({ _id: findUser._id },
            {
                otp: getOTP,
                refreshToken: refreshToken,
                otpExpiryTime: generateOtpExpiryTime
            })

        return res.status(201).json({
            status: true,
            otp: getOTP,
            data: findUser,
            assessToken: assessToken,
            refreshToken: refreshToken
        })
    } else {
        const assessToken = jwt.sign({ findUser }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ findUser }, JWT_SECRET);

        const newUser = await User.create({
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            otp: getOTP,
            otpExpiryTime: generateOtpExpiryTime,
            refreshToken: refreshToken
        });

        return res.status(201).json({
            status: true,
            data: newUser,
            assessToken: assessToken,
            refreshToken: refreshToken
        });


    }
};

exports.verifyOtp = async (req, res) => {
    const currentTime = new Date().getTime();

    const { userId, otp } = req.body
    const findUser = await User.findOne({ _id: userId })
    if (!findUser) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
        })
    }

    console.log("object found", findUser,);


    if (findUser.otpExpiryTime >= currentTime) {

        if (findUser.otp !== otp) {
            return res.status(400).json({
                status: false,
                message: 'Invalid otp'
            })
        }


        const users = await User.updateOne({ _id: userId }, { isOtpVerify: 1 });
        res.status(200).json({ status: true, data: findUser });

    } else {
        return res.status(410).json({
            status: false,
            message: 'Otp expired. Please try again'
        })
    }
};

exports.resendOtp = async (req, res) => {
    const getOTP = generateRandom4Digit()
    const currentTime = new Date().getTime();
    const generateOtpExpiryTime = new Date(currentTime + 2 * 60 * 1000).getTime()

    const phone_number = req.body.phoneNumber
    const country_code = req.body.countryCode;

    const findUser = await User.findOne({ countryCode: country_code, phoneNumber: phone_number })


    if (!findUser) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
        })
    }


    const updateOtpAndTime = await User.updateOne(
        { _id: findUser._id },
        { otpExpiryTime: generateOtpExpiryTime, otp: getOTP })


    return res.status(200).json({
        status: true,
        otp: getOTP,
        data: findUser
    })

};

exports.updateProfile = async (req, res) => {

    const userId = req.body.userId
    const user_name = req.body.userName

    const findUser = await User.findOne({ _id: userId })


    if (!findUser) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
        })
    }


    await User.updateOne(
        { _id: findUser._id },
        { name: user_name })


    return res.status(200).json({
        status: true,
        message: "Profile updated successfully"
    })

};
