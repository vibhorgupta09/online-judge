const Solution = require("../models/Solution");

const getSubmissionsByProblemId = async (req, res) => {
  const { problemId } = req.params;
  try {
    const submissions = await Solution.find({ problemId })
      .sort({ submittedAt: -1 })
      .populate("userId", "name email"); 
      
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

module.exports = { getSubmissionsByProblemId };