const express = require("express");
const router = express.Router();
const linerController = require("../controllers/linerController");

//POST /liner/create
router.post("/create", linerController.create);

//UPDATE /liner/update
router.put("/update", linerController.update);

module.exports = router;