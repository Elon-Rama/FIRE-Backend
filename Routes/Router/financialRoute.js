const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const Financial = require("../../Controller/financialController");

router.post('/create',verifyToken,Financial.createFinancialData);
router.get('/analyze',verifyToken,Financial.getUserFinancial);

// router.post('/create',Financial.createFinancialData);
// router.get('/analyze',Financial.getUserFinancial);

module.exports = router;
