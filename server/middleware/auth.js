const jwt = require('jsonwebtoken');

// Helper function to generate JWT with 48-hour expiry
const generateToken = (userId) => {
  const payload = {
    user: {
      id: userId,
    },
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" });
};

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
        
        // Generate new token for rolling session (extend by 48 hours)
        const newToken = generateToken(decoded.user.id);
        
        // Set new token in response header
        res.setHeader('X-New-Token', newToken);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
