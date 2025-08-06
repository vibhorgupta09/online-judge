const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

/*
 * Helper responsible for compiling **and then executing** a C++ program that
 * was previously written to disk (see `generateFile.js`).
 *
 * How it works – high-level overview:
 * 1. Determine a dedicated output directory `outputs/` (created on the fly).
 * 2. Build a unique output filename that shares the UUID with the source file.
 * 3. Run the compilation command using the system's `g++` tool.
 * 4. If compilation succeeds, immediately execute the produced binary and
 *    capture its stdout/stderr so we can relay the result back to the client.
 *
 * The function is OS-aware: Windows expects a `.exe` artifact while Unix-like
 * systems (Linux/macOS) are happy with any executable bit, we simply use `.out`.
 */

// const executeCpp = (filepath,inputFilePath) => {
//     const jobId = path.basename(filepath).split(".")[0];
//     const outPath = path.join(outputPath, `${jobId}.out`);

//     return new Promise((resolve, reject) => {
//         exec(
//             `g++ ${filepath} -o ${outPath} && ${outPath} < ${inputFilePath}`,
//             (error, stdout, stderr) => {
//                 if (error) {
//                     reject({ error, stderr });
//                 }
//                 if (stderr) {
//                     reject(stderr);
//                 }
//                 resolve(stdout);
//             }
//         );
//     });
// };


const executeCpp = (filepath, inputFilePath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    // const cmd = `g++ ${filepath} -o ${outPath} && ${outPath} < ${inputFilePath}`;

    const isWindows = process.platform === "win32";
    const exePath = isWindows ? `${outPath}.exe` : outPath;
    const cmd = `g++ ${filepath} -o ${exePath} && ${exePath} < ${inputFilePath}`;

    exec(cmd, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          return reject({ verdict: "Time Limit Exceeded", details: "" });
        }

        if (stderr.includes("error:") || stderr.includes(".cpp:")) {
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

      if (stderr) { // If there are any stderr but error is null
        return reject({ verdict: "Runtime Error", details: stderr });
      }

      const acceptedResult = { verdict: "Accepted", output: stdout.trim() };
      cleanupFiles(filepath, inputFilePath, outPath);
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

module.exports = {
    executeCpp,
};