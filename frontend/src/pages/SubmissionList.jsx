// import React from "react";
// import { useParams } from "react-router-dom";
// import {useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "@mui/material";
// import ReusableModal from "../components/ReusableModal";

// const SubmissionsPage = () => {
//   const { id } = useParams();
//   const [submissions, setSubmissions] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [modalType, setModalType] = useState('');
//   const [modalData, setModalData] = useState([]);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         console.log("in submissionList, Fetching submissions for problem ID:", id);
//         const res = await axios.get(`http://localhost:3000/submissions/${id}`);
//         setSubmissions(res.data);
//       } catch (err) {
//         console.error("Error fetching submissions", err);
//       }
//     };

//     fetchSubmissions();
//   }, [id]);

//   const handleOpenModal = (type, data) => {
//     setModalType(type);
//     setModalData(data);
//     setOpenModal(true);
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Submissions</h2>
//       <ul>
//         {submissions.map((s, index) => (
//           <li key={index} className="border p-3 mb-2 rounded">
//             <p><strong>User:</strong> {s.userId ? s.userId.name : "Anonymous"}</p>
//             <p><strong>Verdict:</strong> {s.verdict}</p>
//             <p><strong>Language:</strong> {s.language}</p>
//             <p><strong>Submitted At:</strong> {new Date(s.submittedAt).toLocaleString()}</p>
//             {/* <pre className="bg-gray-100 p-2 mt-2 rounded">{s.code}</pre> */}
//             <Button onClick={() => handleOpenModal('view-code', s.code)}>View Code</Button>
//             <ReusableModal
//               open={openModal}
//               handleClose={() => setOpenModal(false)}
//               modalType={modalType}
//               modalData={modalData}
//             />
//           </li>
//         ))}
//       </ul>

//     </div>
//   );
// };

// export default SubmissionsPage;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { Button, Card, CardContent, Typography, Box, Container } from "@mui/material";
import ReusableModal from "../components/ReusableModal";

const SubmissionsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/submissions/${id}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions", err);
      }
    };

    fetchSubmissions();
  }, [id]);

  const handleOpenModal = (type, data) => {
    setModalType(type);
    setModalData(data);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Submissions
      </Typography>

      {submissions.length === 0 ? (
        <Typography>No submissions yet.</Typography>
      ) : (
        submissions.map((s, index) => (
          <Card
            key={index}
            sx={{
              mb: 3,
              border: s.verdict.toLowerCase() === "accepted" ? "2px solid green": "2px solid red",
              boxShadow: 2,
              borderRadius: 2,
              backgroundColor: s.verdict.toLowerCase() === "accepted" ? "#e6ffed" : "#ffe6e6",
            }}
          >
            <CardContent>
              <Typography><strong>User:</strong> {s.userId ? s.userId.name : "Anonymous"}</Typography>
              <Typography><strong>Verdict:</strong> {s.verdict}</Typography>
              <Typography><strong>Language:</strong> {s.language}</Typography>
              <Typography><strong>Submitted At:</strong> {new Date(s.submittedAt).toLocaleString()}</Typography>

              <Box mt={2}>
                <Button variant="contained" onClick={() => handleOpenModal('view-code', s.code)}>
                  View Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <ReusableModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        modalType={modalType}
        modalData={modalData}
      />
    </Container>
  );
};

export default SubmissionsPage;