const express = require('express');
const User = require('../models/user');  // Ensure you have the User model
const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        const user = new User({ name, email, mobile });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user details by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
