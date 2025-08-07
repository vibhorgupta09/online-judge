const Problem = require("../models/Problem");
const User = require("../models/User");
const TestCase = require("../models/TestCase");

// Get all problems
const getAllProblems = async (req, res) => {
    
try {
  console.log("getAllProblems triggered");
    const { difficulty, topic } = req.query;
    let filter = {};

    if (difficulty) {
    filter.difficulty = { $in: difficulty };
    }

    if (topic && topic.length) {
      filter.topics = { $in: topic };
    }

    const problems = await Problem.find(filter).populate("createdBy", "name email");
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

// Add a new problem
const addProblem = async (req, res) => {
console.log("addProblem triggered");
  try {
    console.log("Received Body:", req.body); 
    const {
      title,
      description,
      difficulty,
      topics,
      exampleInput,
      exampleOutput
    } = req.body;

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      topics,
      exampleInput,
      exampleOutput,
      createdBy: req.user ? req.user.id : null // will be null if no logged-in user
    });

    const savedProblem = await newProblem.save();
    console.log("Problem saved:", savedProblem);
    res.status(201).json(savedProblem);
  } catch (err) {
    console.error("Failed to add problem:", err.message);
    res.status(500).json({ message: "Failed to add problem" });
  }
};

const addTestcase = async (req, res) => {
  console.log("addTestcase triggered for problem ID:", req.params.id);
  try {
    const problemId = req.params.id;
    const { input, expectedOutput } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const newTestcase = new TestCase({
      problemId,
      input,
      expectedOutput
    });
    const savedTestcase = await newTestcase.save();
    console.log("Testcase added:", savedTestcase);

    res.status(200).json({ message: "Testcase added successfully", savedTestcase });
  } catch (err) {
    console.error("Error adding testcase:", err.message);
    res.status(500).json({ message: "Failed to add testcase" });
  }
};

//solve problem
const getProblem = async (req, res) => {
  console.log("getProblem triggered for ID:", req.params.id);
  try {
    const problemId = req.params.id;
    const problem = await Problem.findById(problemId).populate("createdBy");  
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    let isSolved = false;
    if (req.user) {
      isSolved = req.user.solvedProblems.includes(problem._id.toString());
    }
    res.status(200).json({ problem, isSolved });
  } catch (err) {
    console.error("Error fetching problem:", err.message);
    res.status(500).json({ message: "Failed to fetch problem" });
  }
}


module.exports = { getAllProblems, addProblem, getProblem, addTestcase };