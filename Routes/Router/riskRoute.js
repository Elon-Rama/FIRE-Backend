const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const PersonalRisk = require("../../Controller/riskController");


router.post('/create',verifyToken,PersonalRisk.saveRiskProfile);
router.get('/getscore',verifyToken,PersonalRisk.getRiskProfile);

module.exports = router;
