const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  exampleInput: {
    type: String,
    required: true
  },
  exampleOutput: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  topics: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",      // Reference to the User who posted the problem
    required: false   // Optional: true if only logged-in users can post problems
  }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);