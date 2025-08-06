const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    // enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error", "Time Limit Exceeded"],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Solution", solutionSchema);