const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const EmergencyFund = require("../../Controller/EmergencyController");

router.post("/create", EmergencyFund.upsert);

// router.post("/create",  ChildExpenses.upsert);
// router.get("/all",  ChildExpenses.getAll);
// router.delete("/delete/:id",  ChildExpenses.delete);
// router.get("/search",  ChildExpenses.search);

module.exports = router;
