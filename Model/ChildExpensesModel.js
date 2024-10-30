
const mongoose = require('mongoose');

const ChildExpensesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expensesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpensesMaster',
    required: true
  },
  active: {
    type: Boolean,
    required: false,
},
title: {
  type: String,
  required: false
},
  category: [{
    type: String,
    required: true
  }],
  
}, { timestamps: true });

module.exports = mongoose.model('ChildExpenses', ChildExpensesSchema);
