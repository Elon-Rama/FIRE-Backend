const express = require("express");
const api = express.Router();

const emailRoute = require('./Router/emailRoute');
const userRoute = require('./Router/userRoute');
const fireRoute = require('./Router/fireRoute');

api.use('/user',emailRoute);
api.use('/profile',userRoute);
api.use('/question',fireRoute);

module.exports = api;