const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateFiles } = require('./generateFiles');
const { executeCpp } = require('./executeCpp');
const { executeJava } = require('./executeJava');

const app = express();
dotenv.config();

/**
 * Entry point for the Express server.
 *
 * 1. Receives code + language choice from the client (`/run` endpoint).
 * 2. Persists the source code to a temporary file (`generateFile`).
 * 3. Compiles & executes the code (`executeCpp`).
 * 4. Returns the program output back to the caller as JSON.
 *
 * NOTE: Only the C++ workflow is fully wired-up right now, but because the
 *       architecture is modular you can plug in extra languages by adding
 *       another `execute<LANG>.js` implementation and a simple switch-case.
 */


//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/runCompiler", async (req, res) => {
    
    console.log("Received request at compiler index.js to run code with body:", req.body);
    const { language = 'cpp', code} = req.body;
    const input = req.body.input || ''; 

    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const { filePath, inputFilePath } = generateFiles(language, code, input);

        let output = {};
        if(language === 'cpp') {
            output = await executeCpp(filePath, inputFilePath);
        }else if(language === 'java') {
            output = await executeJava(filePath, inputFilePath);
        } else {
            return res.status(400).json({ error: "Unsupported language" });
        }

        
        if (output.verdict === "Accepted") {
            return res.json({ output: output.output, verdict: output.verdict });
        } else {
            return res.json({ verdict: output.verdict, details: output.details });
        }
        
    } 
    catch (error) {
        console.error("Error during code execution:", error);

        if (error.verdict) {
            return res.status(200).json(error);  // returns { verdict: "...", details: "..." }
        }

        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});