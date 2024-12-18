const express = require('express');
const router = express.Router();
const DebtClearance = require('../../Controller/debtController');
const { verifyToken } = require("../../Middleware/authMiddleware");


router.post('/create',verifyToken, DebtClearance.createDebt);
// router.get('/all',verifyToken,DebtClearance.getAllDebts);
router.post('/payemi',verifyToken,DebtClearance.payEMI);

// router.post('/create', DebtClearance.createDebt);
router.get('/all',DebtClearance.getAllDebts);
// router.post('/payemi',DebtClearance.payEMI);

module.exports = router;













