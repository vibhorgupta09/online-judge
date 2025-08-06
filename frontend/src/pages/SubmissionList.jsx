import React from "react";
import { useParams } from "react-router-dom";
import {useEffect, useState } from "react";
import axios from "axios";

const SubmissionsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log("in submissionList, Fetching submissions for problem ID:", id);
        const res = await axios.get(`http://localhost:3000/submissions/${id}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions", err);
      }
    };

    fetchSubmissions();
  }, [id]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submissions</h2>
      <ul>
        {submissions.map((s, index) => (
          <li key={index} className="border p-3 mb-2 rounded">
            <p><strong>User:</strong> {s.userId ? s.userId.name : "Anonymous"}</p>
            <p><strong>Verdict:</strong> {s.verdict}</p>
            <p><strong>Language:</strong> {s.language}</p>
            <p><strong>Submitted At:</strong> {new Date(s.submittedAt).toLocaleString()}</p>
            <pre className="bg-gray-100 p-2 mt-2 rounded">{s.code}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionsPage;