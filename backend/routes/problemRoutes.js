const express = require("express");
const router = express.Router();
const { getAllProblems, addProblem, getProblem, addTestcase } = require("../controllers/problemController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.get("/", getAllProblems);

router.post("/add", verifyToken(false), addProblem);

router.post("/add/:id", addTestcase);

router.get("/:id",verifyToken(false), getProblem);

module.exports = router;