const express = require("express");
const router = express.Router();
const { analyzeComplexity, debug, reviewCodeQuality} = require("../controllers/aiController");

router.post("/analyzeComplexity", analyzeComplexity);
router.post("/debug", debug); 
router.post("/reviewQuality", reviewCodeQuality);

module.exports = router;