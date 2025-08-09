import React, { useState } from "react";
import api from "../api.js";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

const AddTestcase = ({ }) => {
    const { id } = useParams();
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const handleAddTestcase = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        `/problems/add/${id}`,
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

  // return (
  //   <form onSubmit={handleAddTestcase}>
  //     <div>
  //       <label>Input:</label>
  //       <textarea
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //         required
  //       />
  //     </div>
  //     <div>
  //       <label>Expected Output:</label>
  //       <textarea
  //         value={expectedOutput}
  //         onChange={(e) => setExpectedOutput(e.target.value)}
  //         required
  //       />
  //     </div>
  //     <button type="submit">Add Testcase</button>
  //   </form>
  // );
    return (
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Add Testcase
          </Typography>

          <form onSubmit={handleAddTestcase}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Expected Output"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box>
              <Button variant="contained" color="primary" type="submit">
                Add Testcase
              </Button>
            </Box>
          </form>
        </Container>
      );

}
export default AddTestcase;