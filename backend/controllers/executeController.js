const Problem = require("../models/Problem");
const User = require("../models/User");
const TestCase = require("../models/TestCase");
const Solution = require("../models/Solution");
const axios = require("axios");

console.log("Compiler URL from environment:", process.env.COMPILER_URL);
const compilerURL = process.env.COMPILER_URL ;
console.log("Using compiler URL:", compilerURL);


const addSolution = async ({ problemId, userId = null, code, language, verdict }) => {
  try {
    const solution = new Solution({
      problemId,
      userId,
      code,
      language,
      verdict,
    });

    await solution.save();
    console.log("Solution saved successfully");
  } catch (error) {
    console.error("Error saving solution:", error);
  }
};

const run = async (req, res) => {
  try {
    console.log("Received request by executecontroller to run code with body:", req.body);
    const { code, language, input } = req.body;
    if (!code || !language ) {
      return res.status(400).json({ message: "Code, language and input are required" });
    }
    
    const result = await axios.post(`${compilerURL}/runCompiler`, {
      code,
      language,
      input
    });
    console.log("Execution output at execute controller:", result.data);
    
    if (result.data.verdict === "Accepted") {
        return res.json({ output: result.data.output, verdict: result.data.verdict });
    } else {
        return res.json({ verdict: result.data.verdict, details: result.data.details });
    }
    
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const submit = async (req, res) => {
  try {
    console.log("Received request by executecontroller to submit code with body:", req.body);
    const { code, language } = req.body;
    const p_id = req.body.id;
    if (!p_id) {
      return res.status(400).json({ message: "Problem ID is required" });
    }
    if (!code || !language ) {
      return res.status(400).json({ message: "Code and language are required" });
    }

    const testCases = await TestCase.find({ problemId: p_id });
    console.log("Fetched test cases:", testCases);

    let correctCount = 0;
    let total = testCases.length;

    let actualOutput = "";
    let expected = "";
    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;

      // Call the compiler API for each test case
      const response = await axios.post(`${compilerURL}/runCompiler`, {
        code,
        language,
        input
      });
        if (response.data.verdict === "Accepted") { // no compilation/runtime error
            
            actualOutput = (response.data.output || "").trim();
            expected = expectedOutput.trim();

            console.log(`TestCase Input: "${input}"`);
            console.log(`Expected: "${expected}"`);
            console.log(`Actual  : "${actualOutput}"`);

            if (actualOutput === expected) {
                correctCount++;
            } else { // will run when there is no compile and runtime error but only wrong answer

              await addSolution({ // save the solution with wrong answer verdict in solution collection
                problemId: p_id,
                userId: req.user ? req.user._id : null,
                code,
                language,
                verdict: "Wrong Answer"
              });

              return res.json({ verdict: `Wrong Answer`, details: `Expected output: ${expected} \n Your output  : ${actualOutput}` , correctCount, total });
              break;

            }

        } else { // will run in case of compile/runtime error

            await addSolution({ //save the solution with compile/runtime error verdict in solution collection
              problemId: p_id,
              userId: req.user ? req.user._id : null,
              code,
              language,
              verdict: response.data.verdict
            });

            return res.json({ verdict: response.data.verdict, details: response.data.details, correctCount, total });
            break; 
        } 
    }


    await addSolution({ // save the solution with accepted verdict in solution collection
      problemId: p_id,
      userId: req.user ? req.user._id : null,
      code,
      language,
      verdict: "Accepted"
    });

    // If the user is logged in, update their solved problems
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { solvedProblems: p_id }
      });
    }
    return res.json({ verdict: `Accepted`, details: `Accepted` ,correctCount, total  });
    
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {run, submit};