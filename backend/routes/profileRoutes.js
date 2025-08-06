const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Route to get user profile
router.get("/",verifyToken(false), getProfile);

module.exports = router;