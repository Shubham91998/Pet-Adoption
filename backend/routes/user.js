const express = require("express");
const {login, signup, nutrition} = require("../controllers/user");

const router = express.Router();

router.post("/signup", signup);
router.post("/create", nutrition);
router.post("/login", login)

module.exports = router;