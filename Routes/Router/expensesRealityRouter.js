const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const Expenses = require("../../Controller/RealityPage/RealityExpenses");

router.post("/expenses", verifyToken, Expenses.upsert);
router.get("/getAllExpenses", verifyToken, Expenses.getAll);
// router.get("/getExpense/:id", verifyToken, Expenses.getExpenseById);
// router.put("/updateExpense/:id", verifyToken, Expenses.updateExpense);
// router.delete("/deleteExpense/:id", verifyToken, Expenses.deleteExpense);



module.exports = router;
