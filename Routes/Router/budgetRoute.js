const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware')
const Budget = require('../../Controller/BudgetPlan/budgetController');

router.post('/create',Budget.Create);
router.get('/getById/:id',verifyToken,Budget.getById);
router.get('/view', verifyToken,Budget.View);
router.put('/update/:id', verifyToken,Budget.Update);
router.delete('/delete/:id', verifyToken,Budget.Delete);
router.get('/calculate', verifyToken,Budget.CalculateBudget);

module.exports = router;