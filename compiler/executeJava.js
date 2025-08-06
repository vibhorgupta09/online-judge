// compiler/executeJava.js
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, inputFilePath) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filepath); // folder where file exists
        const fileNameWithoutExt = path.basename(filepath, ".java");
        const classFilePath = path.join(dir, `${fileNameWithoutExt}.class`);

        // Compile and run Java code
        const cmd = `javac ${filepath} && java -cp ${dir} ${fileNameWithoutExt} < ${inputFilePath}`;

        exec(cmd, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                cleanupFiles(filepath, inputFilePath, classFilePath);
                if (error.killed) {
                    return reject({ verdict: "Time Limit Exceeded", details: "" });
                }

                if (stderr.includes("error")) {
                    return reject({ verdict: "Compile Time Error", details: stderr });
                }

                if (
                    stderr.toLowerCase().includes("segmentation fault") ||
                    stderr.toLowerCase().includes("floating point exception")
                ) {
                    
                    return reject({ verdict: "Runtime Error", details: stderr });
                }
                
                return reject({ verdict: "Execution Failed", details: stderr || error.message });
            }

            if (stderr) {
                cleanupFiles(filepath, inputFilePath, classFilePath);
                return reject({ verdict: "Runtime Error", details: stderr });
            }

            // return resolve({ verdict: "Accepted", output: stdout.trim() });
            const acceptedResult = { verdict: "Accepted", output: stdout.trim() };
            cleanupFiles(filepath, inputFilePath, classFilePath);
            return resolve(acceptedResult);
        });
    });
};

// Utility to delete files 
const cleanupFiles = (...files) => {
  files.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  });
}

module.exports = { executeJava };