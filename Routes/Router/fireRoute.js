const express = require("express");
const router = express.Router();

const FireQuestion = require("../../Controller/fireController");

router.post("/create", FireQuestion.Create);
router.get('/calculate/:userId', FireQuestion.Calculate);

module.exports = router;