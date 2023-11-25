const express = require("express");
const authController = require("../Controllers/authControllers");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
