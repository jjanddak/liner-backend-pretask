const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//POST /user/signUp
router.post("/signUp", userController.signUp);

//POST /user/login
router.post("/login", userController.login);

//PUT /user/updateTheme
router.put("/updateTheme", userController.updateTheme);

module.exports = router;