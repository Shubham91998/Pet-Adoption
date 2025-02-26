const express = require("express");


const {addPet, getOriginalPet, finddetails} = require("../controllers/originalPrt.js")

const router = express.Router();

router.post("/addpet", addPet)
router.get("/getallpet", getOriginalPet)
router.get("/finddetails/:id", finddetails)

module.exports = router;
