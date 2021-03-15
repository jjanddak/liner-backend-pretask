const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//PUT /user/updateTheme
router.put("/updateTheme", userController.updateTheme);

module.exports = router;