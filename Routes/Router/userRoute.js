const express = require("express");
const router = express.Router();

const Profile = require("../../Controller/userController");

router.post("/create", Profile.Create);
router.get('/getById/:profile_id',Profile.getById);
router.delete('/delete/:profile_id',Profile.deleteById);
router.get('/getAll', Profile.getAll);
router.put("/update/:profile_id", Profile.update);

module.exports = router;
