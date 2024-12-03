const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const FinancialHealth = require("../../Controller/financialController");

router.post('/create',verifyToken,FinancialHealth.createFinancialData);
router.post('/analyze',verifyToken,FinancialHealth.getFinancialAnalysis);

module.exports = router;