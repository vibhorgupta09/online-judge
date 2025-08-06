const express = require("express");
const router = express.Router();
const { getSubmissionsByProblemId } = require("../controllers/submissionController");

router.get("/:problemId", getSubmissionsByProblemId);

module.exports = router;