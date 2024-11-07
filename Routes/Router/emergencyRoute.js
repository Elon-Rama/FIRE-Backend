
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const EmergencyFund = require("../../Controller/EmergencyController");

router.post("/create", verifyToken,EmergencyFund.upsert);
router.get("/all", verifyToken,EmergencyFund.getAll);
router.get("/getbyid/:emergency_id", verifyToken,EmergencyFund.getById); 
router.delete("/delete/:emergency_id", verifyToken, EmergencyFund.deleteById);

// router.post("/create", EmergencyFund.upsert);
// router.get("/all", EmergencyFund.getAll);
// router.get("/getbyid/:emergency_id", EmergencyFund.getById); 
// router.delete("/delete/:emergency_id", EmergencyFund.deleteById);

module.exports = router;

