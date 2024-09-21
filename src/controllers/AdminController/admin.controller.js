const bcrypt = require('bcryptjs');  // Import bcrypt for hashing passwords
const Admin = require('../../models/Admin/admin.model');
const jwt = require('jsonwebtoken');
// const Admin_SECRET = 'Admin@1234';


// Create a new user
// exports.adminRegistration = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if the email already exists in the database
//         const existingAdmin = await Admin.findOne({ email });
//         if (existingAdmin) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'Email is already registered'
//             });
//         }

//         // Hash the password using bcrypt before storing it
//         const hashedPassword = await bcrypt.hash("Admin@1234", 10);  // 10 is the salt rounds

//         // Create a new admin user and store the hashed password
//         const newAdmin = new Admin({
//             email: "admin@gmail.com",
//             password: hashedPassword,
//             name: "John Smith"
//         });

//         // Save the new admin to the database
//         await newAdmin.save();

//         return res.status(201).json({
//             status: true,
//             message: 'Admin registered successfully',
//             data: {
//                 email: newAdmin.email
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: false,
//             message: 'Server error'
//         });
//     }
// };

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the admin with the provided email exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password'
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password'
            });
        }

        const assessToken = jwt.sign({ admin }, process.env.Admin_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ admin }, process.env.Admin_SECRET);


        await Admin.findOneAndUpdate(admin._id, { refreshToken, refreshToken })
        return res.status(200).json({
            status: true,
            assessToken: assessToken,
            refreshToken: refreshToken,
            message: 'Login successful',
            data: {
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Server error'
        });
    }
};

exports.generateRefreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    // Check if the refresh token is provided
    if (!refreshToken) {
        return res.status(400).json({ status: 400, message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.Admin_SECRET);

        console.log(":::::::", decoded);
        const adminId = decoded.admin._id
        // Check if the user exists and the refresh token is valid
        const checkRefreshToken = await Admin.findOne({ _id: adminId, refreshToken: refreshToken });

        if (!checkRefreshToken) {
            return res.status(401).json({ status: 401, message: 'Invalid refresh token or user logged in on another device' });
        }

        const adminData = decoded.admin
        // Generate a new access token
        const accessToken = jwt.sign(
            { adminData },
            process.env.Admin_SECRET,
            { expiresIn: '1d' }  // 1 day expiration for access token
        );
        const refreshToken = jwt.sign({ adminData }, process.env.Admin_SECRET);
        await Admin.findOneAndUpdate(adminData._id, { refreshToken, refreshToken })

        return res.status(200).json({
            status: 200, accessToken: accessToken, refreshToken: refreshToken,
        });

    } catch (error) {
        // console.error("Error decoding refresh token:", error);

        // Handle specific token errors (expired token, etc.)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 401, message: 'Refresh token expired' });
        }

        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

