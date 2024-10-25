const express = require("express");
const router = express.Router();
const ExpensesAllocation = require("../../Controller/BudgetPlan/expensesallocation");
const { verifyToken } = require("../../Middleware/authMiddleware");

// router.post("/create",verifyToken, ExpensesAllocation.upsert);

// router.delete("/delete/:allocationId", verifyToken, ExpensesAllocation.delete);

// router.get("/getAll", verifyToken, ExpensesAllocation.getAll);

// router.get("/:userId/:month/:year", verifyToken, ExpensesAllocation.getById);

router.post("/create", ExpensesAllocation.upsert);
router.delete("/delete/:allocationId", ExpensesAllocation.delete);
router.get("/getAll", ExpensesAllocation.getAll);
router.get("/:userId/:month/:year",  ExpensesAllocation.getById);

module.exports = router;
