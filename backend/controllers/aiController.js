const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config(); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const analyzeComplexity = async (req, res) => {
  try {
    const { code, problemDescription } = req.body;

    if (!code || !problemDescription) {
      return res.status(400).json({ message: "Code and problem description are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
      You are a code analysis assistant.

      Problem Statement:
      ${problemDescription}

      Code:
      ${code}

      Instructions:
      1. Determine if the code correctly solves the problem.
      2. If it seems correct, provide only an estimated time and space complexity.
      3. If the code appears incorrect or incomplete, respond with:
      "The provided code seems incorrect or incomplete. Please fix the errors before analyzing complexity."

      Return only the final answer paragraph.
    `);

    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ message: "Failed to get response from Gemini API" });
  }
};

const debug = async (req, res) => {
  try {
    const { code, problemDescription, output } = req.body;

    if (!code || !problemDescription || !output) {
      return res.status(400).json({ message: "Code, problem description, and output are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
    You are an expert code debugger. Help the user identify issues in their code based on the problem description, the submitted code, and the output received.

    ## Problem Statement
    ${problemDescription}

    ## User Code
    ${code}

    ## Output
    ${output}

    ### Instructions:
    1. First, check if the output contains keywords like "Runtime Error", "Segmentation Fault", or "Compilation Error".
       - If yes, explain the likely cause of the error based on the code.
       - Suggest how the user can fix the error.

    2. If there is no error, assume the code ran successfully. Then:
       - Briefly assess whether the logic in the code matches the requirements in the problem statement.
       - If the logic seems correct, mention it.
       - If there is a logical flaw, identify it and suggest a fix or improvement.

    Keep your response short and actionable. Avoid repeating the problem statement or code.
  `);

    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ message: "Failed to get response from Gemini API" });
  }
};
         
// const reviewCodeQuality = async (req, res) => {
//   try {
//     const { code } = req.body;

//     if (!code) {
//       return res.status(400).json({ message: "Code is required for review" });
//     }

//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: `
    //     You are a code reviewer assistant.

    //     Code:
    //     ${code}

    //     Task:
    //     1. Analyze the code for quality and best practices.
    //     2. Comment on code readability, structure, naming, use of functions, and overall maintainability.
    //     3. Suggest improvements clearly, if any.

    //     Return a short, clear review.
    //   `,
//     });

//     return res.json({ review: result.response.text() });
//   } catch (err) {
//     console.error("AI Code Quality Review Error:", err);
//     return res.status(500).json({ message: "AI error while reviewing code quality" });
//   }
// };

const reviewCodeQuality = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required for review" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
        You are a concise and professional code reviewer.

        Code:
        ${code}

        Instructions:
        1. Start with a short summary (1-2 lines) stating the overall quality of the code.
        2. Create two sections:
        - "What’s Good" → Highlight 2-3 strengths (e.g., readability, naming, logic).
        - "What Can Be Improved" → Point out 2-3 areas that can be better (e.g., structure, edge case handling, best practices).
        3. DO NOT include full code suggestions or rewrites.
        4. Keep the total response under 150 words.
        5. Be direct and clear — no unnecessary fluff.
    `);

    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ message: "Failed to get response from Gemini API" });
  }
};

module.exports = { analyzeComplexity, debug, reviewCodeQuality };