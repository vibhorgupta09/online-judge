const User = require("../models/User");
const Problem = require("../models/Problem");
const Solution = require("../models/Solution");

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.json(null);
    }

    const userId = req.user._id;

    // Fetch basic user data
    const user = await User.findById(userId).select("-password").lean();

    // Fetch full problem documents of solved problems
    const solvedProblems = await Problem.find({ _id: { $in: user.solvedProblems } }).lean();

    // Group solved problems by difficulty
    const problemsByDifficulty = {};
    solvedProblems.forEach(p => {
      const diff = p.difficulty;
      problemsByDifficulty[diff] = (problemsByDifficulty[diff] || []);
      problemsByDifficulty[diff].push(p);
    });

    // Group solved problems by topics
    const problemsByTopic = {};
    solvedProblems.forEach(p => {
      p.topics.forEach(topic => {
        problemsByTopic[topic] = (problemsByTopic[topic] || []);
        problemsByTopic[topic].push(p);
      });
    });

    // Fetch problems created by this user
    const createdProblems = await Problem.find({ createdBy: userId }).lean();

    // Fetch submission history of user
    const submissionHistory = await Solution.find({ userId }).populate("problemId", "title").sort({ submittedAt: -1 }).lean();

    // Final response
    return res.json({
      name: user.name,
      email: user.email,
      solvedProblems: solvedProblems.map(p => ({
        _id: p._id,
        title: p.title,
        difficulty: p.difficulty
      })),
      problemsByDifficulty,
      problemsByTopic,
      createdProblems,
      submissionHistory,
    });

  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile };