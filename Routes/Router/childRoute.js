const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ChildExpenses = require("../../Controller/ChildExpenses");

// router.post("/create", verifyToken, ChildExpenses.upsert);
// router.get("/all", verifyToken, ChildExpenses.getAll);
// router.delete("/delete/:id", verifyToken, ChildExpenses.delete);
// router.get("/search", verifyToken, ChildExpenses.search);

router.post("/create",  ChildExpenses.upsert);
router.get("/all",  ChildExpenses.getAll);
router.delete("/delete/:id",  ChildExpenses.delete);
router.get("/search",  ChildExpenses.search);

module.exports = router;
