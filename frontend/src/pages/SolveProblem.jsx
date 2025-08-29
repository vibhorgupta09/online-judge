import { useParams } from "react-router-dom";
import React, { useRef,useEffect, useState } from "react";
import api from "../api.js";
import "../../style/solveProblem.css"; 
import { Button, CircularProgress } from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    api.get(`/problems/${id}`, { withCredentials: true })
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
    setLoading(true);
    try {
    setVerdict('');
    setResultMessage('');
    const res = await api.post("/execute/run", {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setInput('');
    setAiContent('');
    setLoading(true);
    try {
    const submitResult = await api.post("/execute/submit", {
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
    } finally {
      setLoading(false);
    }
  };

  const handleComplexityAnalysis = async () => {
    try {
      setAiLoading(true);
      const response = await api.post("/ai/analyzeComplexity", {
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
      const response = await api.post("/ai/debug", {
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

    const response = await api.post("/ai/reviewQuality", {
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

function formatAIResponse(text) {
  // Replace double asterisks with bold tags
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Replace bullets `*` with <li>, wrap them inside <ul>
  const lines = formatted.split('\n').map(line => line.trim());
  const listItems = lines.map(line => {
    if (line.startsWith('*')) {
      return `<li>${line.slice(1).trim()}</li>`;
    }
    return `<p>${line}</p>`;
  });

  return `<div><ul>${listItems.join('')}</ul></div>`;
}




  return (

    <div className="wrapper">



        <div className="box1">
            <div className="greyHeader" > 
              <div>
                {problem.title}
                {isSolved && <span style={{ color: "green", marginLeft: "5px" }}> ✔ Solved</span>}
              </div>
              <div>
                <Button onClick={() => navigate(`/submissions/${problem._id}`)} variant="outlined" color="primary">
                  View Submissions
                </Button>
              </div>
            </div>
            <div className="mainContent">

              <span >
                <h2 style={{ color: verdict === "Accepted" ? "green" : "red" }}>{verdict}</h2>
                <h3>{resultMessage}</h3>
              </span>
            
              <p style={{fontSize: "1.2rem"}}>
                <strong> Difficulty: </strong>
                <span style={{ color: problem.difficulty === 'easy' ? 'green' : problem.difficulty === 'medium' ? 'orange' : 'red' }}>
                  {problem.difficulty}
                </span>
              </p>
              <hr />
              {/* <p><strong>Description: </strong> {problem.description}</p>
              <p><strong>Topics: </strong> {problem.topics.join(", ")}</p>
              <p><strong>Example Input:</strong> {problem.exampleInput}</p>
              <p><strong>Example Output:</strong> {problem.exampleOutput}</p>
              <p><strong>Created by: </strong>{problem.createdBy? problem.createdBy.name : "Anonymous"} </p> */}

              <div>
                <label><strong>Description:</strong></label>
                <textarea
                  ref={el => {
                    if (el) {
                      el.style.height = "0px";              // reset
                      el.style.height = el.scrollHeight + "px"; // fit content
                    }
                  }}
                  value={problem.description}
                  disabled
                  readOnly
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    background: "transparent",
                    color: "inherit",
                    font: "inherit",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap"
                  }}
                />

                <p><strong>Topics: </strong> {problem.topics.join(", ")}</p>
                
                <label><strong>Example Input:</strong></label>
                <textarea
                  ref={el => {
                    if (el) {
                      el.style.height = "0px";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  value={problem.exampleInput}
                  disabled
                  readOnly
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    background: "transparent",
                    color: "inherit",
                    font: "inherit",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap"
                  }}
                />

                <label><strong>Example Output:</strong></label>
                <textarea
                  ref={el => {
                    if (el) {
                      el.style.height = "0px";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  value={problem.exampleOutput}
                  disabled
                  readOnly
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    background: "transparent",
                    color: "inherit",
                    font: "inherit",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap"
                  }}
                />

                <p><strong>Created by: </strong>{problem.createdBy? problem.createdBy.name : "Anonymous"} </p>
              </div>

            </div>
        </div>



        <div className="box2">
          <div className="greyHeader">
            <Button variant="contained" onClick={handleComplexityAnalysis}>Analyze Complexity with AI</Button>
            <Button variant="contained" onClick={handleDebug}>Debug with AI</Button>
            <Button variant="contained" onClick={handleCodeQualityReview}>Review Code Quality with AI</Button>
          </div>
          <div className="mainContent">
            {aiLoading ? (
              <p style={{ padding: "10px", fontStyle: "italic", color: "#666" }}>
                Analyzing with AI...
              </p>
            ) : (
              <div>
                {aiContent ? (
                  <div dangerouslySetInnerHTML={{ __html: formatAIResponse(aiContent) }} />
                ) : (
                  "AI output will appear here after analysis."
                )}
              </div>
            )}
          </div>
          
        </div>
        


        <div className="box3">
          <div className="greyHeader">
            <div>
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
            </div>
            {/* <div>
              <Button variant="contained" onClick={handleRun} style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>Run</Button> 
              <Button variant="contained" onClick={handleSubmit} style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>Submit</Button>
            </div> */}
            <div>
              {loading ? (
                <CircularProgress size={28} style={{ marginLeft: "1rem" }} />
              ) : (
                <>
                  <Button variant="contained" onClick={handleRun} style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>Run</Button> 
                  <Button variant="contained" onClick={handleSubmit} style={{marginLeft: "0.5rem", marginRight: "0.5rem"}}>Submit</Button>
                </>
              )}
            </div>
          </div>
          <div className="mainContent">
            <CodeMirror
              value={code}
              height="100%"
              theme={eclipse}
              extensions={[language === "cpp" ? cpp() : java()]}
              onChange={(value) => setCode(value)}
            />
          </div>
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

        
        
    </div>
  );
}

export default SolveProblem;