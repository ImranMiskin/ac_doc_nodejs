const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Admin@1234';  // Keep this secure and hidden (use process.env.JWT_SECRET in real projects)
const Admin = require('../../models/Admin/admin.model');

// Middleware to verify JWT token
const adminAuthenticateToken = async (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.accesstoken;
    const refresh_Token = req.headers.refreshtoken; // Use req instead of request

    if (!authHeader) {
        return res.status(401).json({
            statusCode: 410,
            message: 'No access token provided, access denied'
        });
    }

    if (!refresh_Token) {
        return res.status(401).json({
            statusCode: 410,
            message: 'No refresh token provided, access denied'
        });
    }

    // Verify the access token
    jwt.verify(authHeader, JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({
                statusCode: 410,
                message: 'Invalid or expired token'
            });
        }

        req.user = user;

        const id = req.user.admin._id;

        const admin = await Admin.findOne({ _id: id });

        if (!admin) {
            return res.status(410).json({
                status: false,
                message: 'User not found or logged in on another device',
                statusCode: 410,
            });
        }

        if (refresh_Token !== admin.refreshToken) {
            return res.status(410).json({
                status: false,
                message: 'User already logged in on another device',
                statusCode: 410,
            });
        }

        next();
    });
};

module.exports = adminAuthenticateToken;
