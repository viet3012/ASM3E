const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/logout", authController.logout);

router.post("/signinadmin", authController.signInAdmin);

module.exports = router;
