const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], required: true },
    participants: [
        {
            username: { type: String, required: true },
            amountOwed: { type: Number, required: true },
            percentageOwed: { type: Number }, 
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

expenseSchema.pre('save', async function(next) {
    const totalAmount = this.totalAmount;
    const splitMethod = this.splitMethod;
    let totalShare = 0;

    if (splitMethod === 'equal') {
        const numberOfParticipants = this.participants.length;
        totalShare = totalAmount; // Each participant pays equally
    } else if (splitMethod === 'exact') {
        totalShare = this.participants.reduce((sum, participant) => sum + participant.amountOwed, 0);
    } else if (splitMethod === 'percentage') {
        const totalPercentage = this.participants.reduce((sum, participant) => sum + (participant.percentageOwed || 0), 0);
        
        if (totalPercentage !== 100) {
            return next(new Error('Total percentage owed must equal 100%'));
        }
        
        totalShare = this.participants.reduce((sum, participant) => sum + (totalAmount * (participant.percentageOwed / 100)), 0);
    }

    // Check if the totalShare matches the totalAmount
    if (totalShare !== totalAmount) {
        return next(new Error('Total shares do not equal the total amount'));
    }

    next();
});

module.exports = mongoose.model('Expense', expenseSchema);
