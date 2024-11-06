
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const EmergencyFund = require("../../Controller/EmergencyController");

router.post("/create", verifyToken,EmergencyFund.upsert);
router.get("/all", verifyToken,EmergencyFund.getAll);
router.get("/getbyid/:emergency_id", verifyToken,EmergencyFund.getById); 
router.delete("/delete/:emergency_id", verifyToken, EmergencyFund.deleteById);

module.exports = router;

