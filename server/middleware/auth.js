const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token is older than 7 days
        const currentTime = Date.now() / 1000; // Current time in seconds
        const tokenIssuedAt = decoded.iat; // Token issued time
        const sevenDaysInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
        
        if (currentTime - tokenIssuedAt > sevenDaysInSeconds) {
            return res.status(401).json({ 
                msg: 'Session expired. Please login again.',
                code: 'SESSION_EXPIRED'
            });
        }
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
