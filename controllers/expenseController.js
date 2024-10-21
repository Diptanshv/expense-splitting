const Expense = require('../models/expense');
const User = require("../models/user")

// Add expense
exports.addExpense = async (req, res) => {
    const { description, totalAmount, splitMethod, participants } = req.body;

    try {
        // Get the logged-in user from the token
        const createdBy = req.user._id;

        // Find users by their usernames in the participants array
        const userParticipants = await Promise.all(participants.map(async participant => {
            const user = await User.findOne({ username: participant.username });
            if (!user) {
                throw new Error(`User with username ${participant.username} not found`);
            }
            return { userId: user._id, ...participant };
        }));

        let calculatedParticipants = [];

        // Validate percentages if splitMethod is 'percentage'
        if (splitMethod === 'percentage') {
            const totalPercentage = userParticipants.reduce((sum, participant) => sum + participant.percentageOwed, 0);
            if (totalPercentage !== 100) {
                return res.status(400).json({ message: 'Percentages must add up to 100%' });
            }

            calculatedParticipants = userParticipants.map(participant => ({
                username: participant.username,
                amountOwed: (totalAmount * (participant.percentageOwed / 100)).toFixed(2),
                percentageOwed: participant.percentageOwed,
            }));
        } else if (splitMethod === 'equal') {
            const amountPerPerson = (totalAmount / userParticipants.length).toFixed(2);
            calculatedParticipants = userParticipants.map(participant => ({
                username: participant.username,
                amountOwed: amountPerPerson,
                percentageOwed: (100 / userParticipants.length).toFixed(2), // Each gets equal percentage
            }));
        } else if (splitMethod === 'exact') {
            const totalParticipantsAmount = userParticipants.reduce((sum, participant) => sum + participant.amountOwed, 0);
            if (totalAmount !== totalParticipantsAmount) {
                return res.status(400).json({ message: 'Total amount must equal the sum of all individual shares' });
            }

            calculatedParticipants = userParticipants.map(participant => ({
                username: participant.username,
                amountOwed: participant.amountOwed,
                percentageOwed: (participant.amountOwed / totalAmount * 100).toFixed(2),
            }));
        }

        const expense = new Expense({
            description,
            totalAmount,
            splitMethod,
            participants: calculatedParticipants,
            createdBy, // Automatically set from the logged-in user
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        console.log('User from request:', req.user);
        res.status(400).json({ message: error.message });
    }
};


// Retrieve expenses for a user

exports.getUserExpenses = async (req, res) => {
    try {
        console.log('Fetching expenses for userId:', req.params.userId);
        const expenses = await Expense.find({ 'participants.username': req.params.username })
            .populate('createdBy', 'username'); 
        console.log('Retrieved expenses:', expenses);
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching user expenses:', error);
        res.status(500).json({ message: error.message });
    }
};


// Retrieve all expenses
exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('createdBy', 'username'); // Populate creator's username

        res.json(expenses);
    } catch (error) {
        console.log('User from request:', req.user);
        res.status(500).json({ message: error.message });
    }
};
