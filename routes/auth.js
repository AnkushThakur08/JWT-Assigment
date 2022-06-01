const express = require("express");
const router = express.Router();

const { signup, signIn, profile, isSignedIn } = require("../controllers/auth");

// SIGNUP : POST
router.post("/signup", signup);

// SIGNIN : POST
router.post("/signIn", signIn);

router.get("/profile", isSignedIn, profile);

module.exports = router;
