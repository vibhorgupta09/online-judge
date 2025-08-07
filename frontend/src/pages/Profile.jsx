import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DifficultyPieChart from "../components/DifficultyPieChart";
import TopicBarChart from "../components/TopicBarChart"; 
import "../../style/profile.css"; 

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [problemsByDifficulty, setProblemsByDifficulty] = useState({});
  const [problemsByTopic, setProblemsByTopic] = useState({});
  const [createdProblems, setCreatedProblems] = useState([]);
  const [submissionHistory, setSubmissionHistory] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });

        if (res.data) {
          setName(res.data.name);
          setEmail(res.data.email);
          setSolvedProblems(res.data.solvedProblems);
          setProblemsByDifficulty(res.data.problemsByDifficulty);
          setProblemsByTopic(res.data.problemsByTopic);
          setCreatedProblems(res.data.createdProblems);
          setSubmissionHistory(res.data.submissionHistory);
        } else {
          // user is not logged in
          setName("");
          setEmail("");
          setSolvedProblems([]);
          setProblemsByDifficulty({});
          setProblemsByTopic({});
          setCreatedProblems([]);
          setSubmissionHistory([]);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Profile</h1> */}

      {!user && <p className="text-gray-500">Note: You are not logged in. Showing dummy data.</p>}
        <>

          <div className="top" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            
            <div className="topLeft">

              <h2>
              {name? (name) : "Anonymous User"}
              </h2>
              <p><strong>Email : </strong>
              {email ? email : "Anonymous Email"}
              </p>
              <h2 className="text-xl font-semibold mt-6">Problems Solved : {solvedProblems.length}</h2>

            </div>

            <div className="topRight">

              
              {Object.entries(problemsByDifficulty).length === 0 && <p>No problems solved.</p>}
              {/* {Object.entries(problemsByDifficulty).length === 0 && <DifficultyPieChart data={""} />} */}
              {Object.entries(problemsByDifficulty).length != 0 && <DifficultyPieChart data={problemsByDifficulty} />}
                
              

            </div>

          </div>

          <div className="middle">

                {/* <h2 className="text-xl font-semibold mt-6">Solved by Topic</h2> */}
                
                  {/* {Object.entries(problemsByTopic).length === 0 && <li>No problems solved.</li>} */}
                  {Object.entries(problemsByTopic).length === 0 && <TopicBarChart data={""} />}
                  {Object.entries(problemsByTopic).length != 0 && <TopicBarChart data={problemsByTopic} />}
                  {/* {Object.entries(problemsByTopic).map(([topic, arr]) => (
                    <li key={topic}><strong>{topic}</strong>: {arr.length}</li>
                  ))} */}
                

          </div>

          <div className="bottom">

          </div>





          

          <h2 className="text-xl font-semibold mt-6">Problems Solved : {solvedProblems.length}</h2> 
          <ul>
            {(solvedProblems.length === 0) && <p>No problems solved yet.</p>}
            {solvedProblems.map(p => (
              <li key={p._id}>{p.title} ({p.difficulty})</li>
            ))}
          </ul>

          
          
          {/* <ul className="list-disc ml-6">
            {Object.entries(problemsByDifficulty).length === 0 && <li>No problems solved.</li>}
            {/* {Object.entries(problemsByDifficulty).length === 0 && <DifficultyPieChart data={""} />} */}
            {/* {Object.entries(problemsByDifficulty).length != 0 && <DifficultyPieChart data={problemsByDifficulty} />}
            {Object.entries(problemsByDifficulty).map(([diff, arr]) => (
              <li key={diff}><strong>{diff}</strong>: {arr.length}</li>
            ))} */}
          {/* </ul> */} 

          {/* <h2 className="text-xl font-semibold mt-6">Solved by Topic</h2>
          <ul className="list-disc ml-6">
            {Object.entries(problemsByTopic).length === 0 && <li>No problems solved.</li>}
            {Object.entries(problemsByTopic).length === 0 && <TopicBarChart data={""} />}
            {Object.entries(problemsByTopic).length != 0 && <TopicBarChart data={problemsByTopic} />}
            {Object.entries(problemsByTopic).map(([topic, arr]) => (
              <li key={topic}><strong>{topic}</strong>: {arr.length}</li>
            ))}
          </ul> */}

          <h2 className="text-xl font-semibold mt-6">Problems Created</h2>
          <ul >
            {createdProblems.length === 0 && <li>No problems created yet.</li>}
            {createdProblems.map(p => (
              <li key={p._id}>{p.title}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-6">Submission History</h2>
          <ul >
            {submissionHistory.length === 0 && <li>No submissions yet.</li>}
            {submissionHistory.map((s, idx) => (
              <li key={idx}>
                {s.problemId?.title || "Unknown Problem"} - {s.verdict} - {new Date(s.submittedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      
    </div>
  );
};

export default Profile;
