const express = require('express');
const router = express.Router();
const Debt = require('../../Controller/debtController');
const { verifyToken } = require("../../Middleware/authMiddleware");


router.post('/create', verifyToken,Debt.createDebt);
router.get('/all',verifyToken,Debt.getAllDebts);

module.exports = router;
