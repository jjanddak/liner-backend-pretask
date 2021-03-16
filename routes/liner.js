const express = require("express");
const router = express.Router();
const linerController = require("../controllers/linerController");

//POST /liner/create
router.post("/create", linerController.create);

//PUT /liner/update
router.put("/update", linerController.update);

//GET /liner/getHighlight
router.get("/getHighlight", linerController.getHighlight);

module.exports = router;