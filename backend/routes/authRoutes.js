const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, checkAuth} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", verifyToken(false), checkAuth);

module.exports = router;