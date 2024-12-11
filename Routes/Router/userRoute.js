const express = require("express");
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');

const Profile = require("../../Controller/Login/userController");

router.post("/create",verifyToken, Profile.Create);
router.get('/getById/:profile_id',verifyToken,Profile.getById);
router.delete('/delete/:profile_id',verifyToken,Profile.deleteById);
router.get('/getAll', verifyToken,Profile.getAll);
router.put("/update/:profile_id", verifyToken,Profile.update);

module.exports = router;
