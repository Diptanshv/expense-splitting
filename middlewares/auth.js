const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present and well-formed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied, no token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer'

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the user exists for signup/login purposes
exports.checkIfUserExists = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    next();
};
