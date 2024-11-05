const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const emergencyFund = require('../../Controller/emergencyFundController/emergencyFundController')

router.post('/addExpenses',verifyToken,emergencyFund.create);

//router.put('/update/:id',verifyToken,income.put);


module.exports = router;
