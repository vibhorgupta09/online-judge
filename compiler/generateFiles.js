const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');



const dirCodes = path.join(__dirname, 'codes');
const dirInputs = path.join(__dirname, 'inputs');

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};


const generateFiles = (format, content, input) => {
    ensureDirExists(dirCodes);
    ensureDirExists(dirInputs);
    
    const jobID = uuid();
    let filename = `${jobID}.${format}`;
    if (format === "java") {
        filename = "Main.java"; // force filename for Java
    }

    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, content);

    const inputFilePath = path.join(dirInputs, `${jobID}.txt`);
    fs.writeFileSync(inputFilePath, input || '');
    return {
        filePath,
        inputFilePath
    };
};

module.exports = {
    generateFiles
};