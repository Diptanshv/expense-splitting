const Expense = require('../models/expense');
const User = require('../models/user');
const { Parser } = require('json2csv');  // For CSV

const generateBalanceSheet = async (req, res) => {
    try {
        // Fetch all expenses
        const expenses = await Expense.find();

        // Get usernames from participants for bulk querying
        const usernames = expenses.flatMap(exp => 
            exp.participants.map(participant => participant.username)
        );

        // Query users based on the unique usernames
        const users = await User.find({ username: { $in: [...new Set(usernames)] } });

        // Create a mapping from username to user name for easy lookup
        const userMap = users.reduce((acc, user) => {
            acc[user.username] = user.name;  // Assuming each user has a unique username
            return acc;
        }, {});

        // Build the balance sheet data
        const sheetData = expenses.map(exp => ({
            description: exp.description,
            totalAmount: exp.totalAmount,
            participants: exp.participants.map(p => ({
                name: userMap[p.username] || 'Unknown',  // Use the userMap to get the user's name
                amountOwed: p.amountOwed,
                percentageOwed: p.percentageOwed
            }))
        }));

        // Convert to CSV
        const parser = new Parser();
        const csv = parser.parse(sheetData);
        res.header('Content-Type', 'text/csv');
        res.attachment('balance-sheet.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateBalanceSheet,
};
