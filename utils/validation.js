const validator = require('validator');

// Validate email
exports.validateEmail = (email) => {
    return validator.isEmail(email);
};

// Validate mobile number (simple 10-digit check)
exports.validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

// Validate that percentage splits add up to 100
exports.validatePercentageSplit = (participants) => {
    const totalPercentage = participants.reduce((sum, participant) => sum + participant.percentageOwed, 0);
    return totalPercentage === 100;
};
