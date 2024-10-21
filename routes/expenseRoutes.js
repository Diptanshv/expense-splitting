const express = require('express');
const { addExpense, getUserExpenses, getAllExpenses } = require('../controllers/expenseController');
const router = express.Router();

router.post('/expenses', addExpense);
router.get('/expenses/user/:userId', getUserExpenses);
router.get('/expenses', getAllExpenses);

module.exports = router;
