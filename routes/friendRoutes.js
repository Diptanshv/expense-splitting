const express = require('express');
const User = require('../models/user');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

// Add a friend
router.post('/users/add-friend', authenticateToken, async (req, res) => {
    const { identifier } = req.body; // This can be email, phone, or username

    try {
        // Check if the friend exists based on the provided identifier
        const friend = await User.findOne({
            $or: [
                { email: identifier },
                { mobile: identifier },
                { username: identifier }
            ]
        });

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friend is already in the user's friends list
        const user = await User.findById(req.user._id);
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'This user is already your friend' });
        }

        // Add the friend to the user's friends list
        user.friends.push(friend._id);
        await user.save();

        if (!friend.friends.includes(user._id)) {
            friend.friends.push(user._id);
            await friend.save();
        }

        res.status(200).json({ message: 'Friend added successfully', friend });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all friends of the user
router.get('/friends', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'name email mobile username'); // Get friends' details
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.friends); // Return the list of friends
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove a friend
router.delete('/friends', authenticateToken, async (req, res) => {
    const { identifier } = req.body; // This can be email, phone, or username

    try {
        // Find the friend using the provided identifier
        const friend = await User.findOne({
            $or: [
                { email: identifier },
                { mobile: identifier },
                { username: identifier }
            ]
        });

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findById(req.user._id); // Current user's ID from the token
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the friend is in the user's friends list
        if (!user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'This user is not your friend' });
        }

        // Remove friend ID from user's friends list
        user.friends = user.friends.filter(id => id.toString() !== friend._id.toString());
        await user.save();

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
