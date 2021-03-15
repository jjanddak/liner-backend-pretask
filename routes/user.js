const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//UPDATE /user/updateTheme
router.put("/updateTheme", userController.updateTheme);

module.exports = router;