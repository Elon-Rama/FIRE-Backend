const express = require("express");
const router = express.Router();

const Budget = require('../../Controller/budgetController');


router.post('/create', Budget.createBudget);

router.put('/update', Budget.updateBudget);

module.exports = router;