import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddTestcase = ({ }) => {
    const { id } = useParams();
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const handleAddTestcase = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/problems/add/${id}`,
        { input, expectedOutput },
        { withCredentials: true } // to send token cookie
      );
      alert("Testcase added successfully!");
      console.log(res.data);
      //reset form
      setInput("");
      setExpectedOutput("");
    } catch (err) {
      console.error("Failed to add testcase", err);
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleAddTestcase}>
      <div>
        <label>Input:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Expected Output:</label>
        <textarea
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Testcase</button>
    </form>
  );
}
export default AddTestcase;