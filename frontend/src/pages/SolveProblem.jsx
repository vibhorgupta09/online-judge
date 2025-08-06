import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/solveProblem.css"; 
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { eclipse } from "@uiw/codemirror-theme-eclipse";


const SolveProblem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!";\n    return 0;\n}`);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/problems/${id}`, { withCredentials: true })
      .then(res =>{ 
        setProblem(res.data.problem)
        setInput(res.data.problem.exampleInput);
        setIsSolved(res.data.isSolved);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!problem) return <div>Loading...</div>;

  const handleRun = async () => {
    setAiContent('');
    try {
    setVerdict('');
    setResultMessage('');
    const res = await axios.post("http://localhost:3000/execute/run", {
      code,
      language,
      input
    });
    //
    if (res.data.verdict === "Accepted") { //will run in case of accepted or wrong answer (accepted becuase it is run and not submit)
        // verdict is only set to accepted when its submitted and not when it is run
        setOutput(res.data.output);
    } else { // will run in case of compile/runtime error
        setOutput(`${res.data.verdict}  ${res.data.details}`);
    }

    } catch (err) {
      console.error("Error running code:", err);
      setOutput("Error while executing");
    }
  };

  const handleSubmit = async () => {
    setInput('');
    setAiContent('');
    try {
    const submitResult = await axios.post("http://localhost:3000/execute/submit", {
      code,
      language,
      id
    }, {
      withCredentials: true 
    });
    // setOutput(result.data.message); //temp
    // setResultMessage(result.data.message);
    // setVerdict(result.data.verdict);
    // setOutput("");
    if (submitResult.data.verdict === "Accepted") {
        // return res.json({ output: output.output, verdict: output.verdict });
        // verdict is only set to accepted when its submitted and not when it is run
        setVerdict(submitResult.data.verdict);
        setResultMessage(`${submitResult.data.correctCount} out of ${submitResult.data.total} test cases passed.`);
        setOutput(``);
    } else {
        // return res.json({ verdict: output.verdict, details: output.details });
        setVerdict(submitResult.data.verdict);
        setOutput(`${submitResult.data.verdict} \n ${submitResult.data.details}`);
        setResultMessage(`Error at Testcase : ${submitResult.data.correctCount} .`);
    }
    
    } catch (err) {
      console.error("Error submitting code:", err);
      // setOutput("Error while executing");
    }
  };

  const handleComplexityAnalysis = async () => {
    try {
      setAiLoading(true);
      const response = await axios.post("http://localhost:3000/ai/analyzeComplexity", {
        code,
        problemDescription: problem.description
      }, {
        withCredentials: true 
      });

      if (response.data && response.data.message) {
        setAiContent(response.data.message);
      } else {
        setAiContent("Error analyzing complexity. Please try again.");
      }
    } catch (error) {
      console.error("Error analyzing complexity:", error);
      setAiContent("Error analyzing complexity. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  const handleDebug = async () => {
    try {
      if(!code || !problem.description) {
        setAiContent("Code and problem description are required for debugging.");
        return;
      }
      if(verdict === "Accepted") {
        setAiContent("Problem already solved. No need to debug.");
        return;
      }
      if(output=== "") {
        setAiContent("Please run the code first to get output before debugging.");
        return;
      }
      
      setAiLoading(true);
      const response = await axios.post("http://localhost:3000/ai/debug", {
        code,
        problemDescription: problem.description,
        output
      }, {
        withCredentials: true 
      });

      if (response.data && response.data.message) {
        setAiContent(response.data.message);
      } else {
        setAiContent("Error in debugging. Please try again.");
      }
    } catch (error) {
      console.error("Error in debugging:", error);
      setAiContent("Error in debugging. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  const handleCodeQualityReview = async () => {
  try {
    setAiLoading(true);
    setAiContent("");

    const response = await axios.post("http://localhost:3000/ai/reviewQuality", {
      code,
    });

    if (response.data && response.data.message) {
      setAiContent(response.data.message);
    } else {
      setAiContent("Could not analyze code quality. Please try again.");
    }
  } catch (err) {
    console.error("Error in code quality review:", err);
    setAiContent("Error occurred while reviewing code quality.");
  } finally {
    setAiLoading(false);
  }
};

  return (

    <div className="wrapper">
        <div className="box1">
            
            <Button onClick={() => navigate(`/submissions/${problem._id}`)} variant="outlined" color="primary">
              View Submissions
            </Button>
            <h3>
              {isSolved && <span style={{ color: "green", marginLeft: "5px" }}> ✔ Solved</span>}
            </h3>
            <span>
              <h2 style={{ color: verdict === "Accepted" ? "green" : "red" }}>{verdict}</h2>
              <h3>{resultMessage}</h3>
            </span>
            <span><h2>{problem.title}</h2></span>
            <p><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p><strong>Description:</strong> {problem.description}</p>
            <p><strong>Topics:</strong> {problem.topics.join(", ")}</p>
            <p><strong>Example Input:</strong> {problem.exampleInput}</p>
            <p><strong>Example Output:</strong> {problem.exampleOutput}</p>
        </div>
        <div className="box2">
          {aiLoading ? (
            <p style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
              Analyzing with AI...
            </p>
          ) : (
            <div
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "5px",
                height: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                fontFamily: "monospace"
              }}
            >
              {aiContent || "AI output will appear here after analysis."}
            </div>
          )}
        </div>
        {/* <div className="box3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            rows="20"
            cols="50"
          ></textarea>
        </div> */}
        <div className="box3" style={{ border: "1px solid #ddd" }}>
        <CodeMirror
          value={code}
          height="400px"
          theme={eclipse}
          extensions={[language === "cpp" ? cpp() : java()]}
          onChange={(value) => setCode(value)}
        />
      </div>

        <div className="box4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="input"
            rows="10"
            cols="50" 
          ></textarea>                                           
        </div>

        <div className="box5">
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="output"
            rows="10"
            cols="50"
          ></textarea>
        </div>

        <div className="box6">
          <select
            value={language}
            onChange={(e) => {
              const selectedLang = e.target.value;
              setLanguage(selectedLang);

              if (selectedLang === "cpp") {
                setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!";\n    return 0;\n}`);
              } 
              else if (selectedLang === "java") {
                setCode(`import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print("Hello World");\n    }\n}`);
                
              }
            }}
            style={{ padding: "5px", marginBottom: "10px" }}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button onClick={handleRun}>Run</button>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleComplexityAnalysis}>Analyze Complexity with AI</button>
          <button onClick={handleDebug}>Debug with AI</button>
          <button onClick={handleCodeQualityReview}>Review Code Quality with AI</button>
        </div>
        
    </div>
  );
}

export default SolveProblem;