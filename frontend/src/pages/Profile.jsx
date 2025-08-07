import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DifficultyPieChart from "../components/DifficultyPieChart";
import TopicBarChart from "../components/TopicBarChart"; 
import "../../style/profile.css"; 
import ReusableModal from "../components/ReusableModal";
import { Button } from "@mui/material";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [problemsByDifficulty, setProblemsByDifficulty] = useState({});
  const [problemsByTopic, setProblemsByTopic] = useState({});
  const [createdProblems, setCreatedProblems] = useState([]);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);

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


const handleOpenModal = (type, data) => {
  setModalType(type);
  setModalData(data);
  setOpenModal(true);
};

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Profile</h1> */}

      {!user && <p className="text-gray-500" style={{marginBottom:"40px"}}>Note: You are not logged in. Showing dummy data.</p>}

          <div className="top" style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "20px" }}>
            
            <div className="topLeft" style={{width:"50%", paddingRight: "10%" , paddingLeft: "0%" }}>

              <h1>
              {name? (name) : "Anonymous User"}
              </h1>
              <p style={{fontSize: "20px"}}><strong>Email : </strong>
              {email ? email : "Anonymous Email"}
              </p>
              <p className="text-xl font-semibold mt-6"style={{fontSize: "20px"}}><strong>Accepted solutions :</strong> {solvedProblems.length}</p>
              <p className="text-xl font-semibold mt-6"style={{fontSize: "20px"}}><strong>Total submissions :</strong> {submissionHistory.length}</p>
              <p className="text-xl font-semibold mt-6" style={{fontSize: "20px"}}><strong>Problems Created :</strong> {createdProblems.length}</p>
              <div style={{width:"100%" ,display: "flex", justifyContent: "space-between", marginTop: "50px"}}>
                <div style={{margin: "10px"}}>
                  <Button variant="outlined" style={{width:"100%"}} onClick={() => handleOpenModal('solved', solvedProblems)}>View solved problems</Button>
                </div>
                <div style={{margin: "10px"}}>
                  <Button variant="outlined" style={{width:"100%"}} onClick={() => handleOpenModal('created', createdProblems)}>View problems created</Button>
                </div>
                <div style={{margin: "10px"}}>
                  <Button variant="outlined" style={{width:"100%"}} onClick={() => handleOpenModal('submissions', submissionHistory)}>view submission history</Button>
                </div>
              </div>
              <ReusableModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                modalType={modalType}
                modalData={modalData}
              />

            </div>

            <div className="topRight" style={{ }}>

              {Object.entries(problemsByDifficulty).length === 0 && <DifficultyPieChart data={""} />}
              {Object.entries(problemsByDifficulty).length != 0 && <DifficultyPieChart data={problemsByDifficulty} />}

            </div>

          </div>

          <div className="middle">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
              <h2 className="text-xl font-semibold mt-6">Topic wise distribution</h2>
            </div>  
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {Object.entries(problemsByTopic).length === 0 && <TopicBarChart data={""} />}
              {Object.entries(problemsByTopic).length != 0 && <TopicBarChart data={problemsByTopic} />}
            </div>
          </div>

          

    </div>
  );
};

export default Profile;
