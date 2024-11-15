const express = require('express');
const router = express.Router();
const Debt = require('../../Controller/debtController');

// Route to create a new debt record
router.post('/create', Debt.createDebt);
router.get('/all',Debt.getAllDebts);

module.exports = router;
