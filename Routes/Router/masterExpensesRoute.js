const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ExpensesMaster = require("../../Controller/expensesmasterController");

router.post("/create", verifyToken, ExpensesMaster.upsert);
router.get("/all", verifyToken, ExpensesMaster.getAll);
router.get("/getbyid/:expenses_id", verifyToken, ExpensesMaster.getById);
router.delete("/delete/:expenses_id", verifyToken, ExpensesMaster.deleteById);

// router.post("/create", ExpensesMaster.upsert);
// router.get("/all", ExpensesMaster.getAll);
// router.get("/getbyid/:expenses_id", ExpensesMaster.getById);
// router.delete("/delete/:expenses_id",  ExpensesMaster.deleteById);

module.exports = router;
