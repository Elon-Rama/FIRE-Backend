const express = require("express");
const api = express.Router();

const emailRoute = require('./Router/emailRoute');
const userRoute = require('./Router/userRoute');
const fireRoute = require('./Router/fireRoute');
const budgetRoute = require('./Router/budgetRoute');
const personalRoute = require('./Router/allocationRoute');
const expensesRoute = require('./Router/masterExpensesRoute');
const realityRoute = require('./Router/realityRoute');
const expensesRealityRoute = require('./Router/expensesRealityRouter');
const childRoute = require('./Router/childRoute');
const emergencyRoute = require('./Router/emergencyRoute');
const debtRoute = require("./Router/debtRoute");
const financialRoute = require("./Router/financialRoute");
const riskRoute = require("./Router/riskRoute");

api.use('/user',emailRoute);
api.use('/profile',userRoute);
api.use('/question',fireRoute);
api.use('/budget',budgetRoute);
api.use('/personal',personalRoute);
api.use('/master',expensesRoute);
api.use('/reality',realityRoute);
api.use('/childexpenses',childRoute);
api.use('/realityexpenses',expensesRealityRoute);
api.use('/emergency',emergencyRoute);
api.use('/debt',debtRoute);
api.use('/health',financialRoute);
api.use('/risk',riskRoute);

module.exports = api;