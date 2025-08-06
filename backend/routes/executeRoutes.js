const express = require("express");
const router = express.Router();
const { run ,submit} = require("../controllers/executeController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/run", run);
router.post("/submit", verifyToken(false), submit);

module.exports = router;