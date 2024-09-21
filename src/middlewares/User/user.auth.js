const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const userAuthenticateToken = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Attach user information to request object
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    });
};

module.exports = userAuthenticateToken;
