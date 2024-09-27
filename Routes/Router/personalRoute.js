const express = require("express");
const router = express.Router();

const PersonalBudget = require("../../Controller/personalbudgetRoute");

router.post('/create',PersonalBudget.Create);

module.exports = router;