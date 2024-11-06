// const express = require("express");
// const router = express.Router();
// // const { verifyToken } = require("../../Middleware/authMiddleware");
// const EmergencyFund = require("../../Controller/EmergencyController");

// router.post("/create", EmergencyFund.createEmergencyFund);
// // router.get("/getAll",EmergencyFund.getAllEmergencyFunds);
// router.put("/update/:id",EmergencyFund.updateEmergencyFund);
// router.post("/add-entry/:fundId", EmergencyFund.updateEmergencyFundEntry);
// // router.get("/getbyid/:id",EmergencyFund.getEmergencyFundById);
// // router.delete("/delete/:id",EmergencyFund.deleteEmergencyFund);


// module.exports = router;


const express = require("express");
const router = express.Router();
const EmergencyFund = require("../../Controller/EmergencyController");

router.post("/create", EmergencyFund.createEmergencyFund);
router.get("/all",  EmergencyFund.getAll);
// router.put("/update/:id", EmergencyFund.updateEmergencyFund);
// router.post("/add-entry", EmergencyFund.Entry);

module.exports = router;
