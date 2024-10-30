const mongoose = require('mongoose');

const ExpensesMasterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: false,
    },
    category: [
        {
            title: {
              type: String,
              required: true
            },
            amount: {
              type: Number,
              default: 0
            },
        }
      ]
}, { timestamps: true });

module.exports = mongoose.model('ExpensesMaster', ExpensesMasterSchema);

