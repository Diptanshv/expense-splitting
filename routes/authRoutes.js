const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkIfUserExists } = require('../middlewares/auth');
const { validateEmail, validateMobile } = require('../utils/validation');
const router = express.Router();

// Signup
router.post('/signup', checkIfUserExists, async (req, res) => {
    const { name, email, mobile,username, password } = req.body;

    // Validate input
    if (!validateEmail(email) || !validateMobile(mobile)) {
        return res.status(400).json({ message: 'Invalid email or mobile number' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, mobile,username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('Authorization', `Bearer ${token}`).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('Authorization', `Bearer ${token}`).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
