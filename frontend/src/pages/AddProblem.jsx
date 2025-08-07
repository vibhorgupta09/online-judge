import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput
} from "@mui/material";
import axios from "axios";

const topicOptions = [
  "math",
  "array",
  "string",
  "linkedlist",
  "tree",
  "hashing",
  "stack",
  "queue",
  "heap",
  "dp",
  "greedy",
  "graph",
  "binary-search"
];

const AddProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topics, setTopics] = useState([]);
  const [exampleInput, setExampleInput] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/problems/add",
        {
          title,
          description,
          difficulty,
          topics,
          exampleInput,
          exampleOutput
        },
        { withCredentials: true } // to send token cookie
      );
      // alert("Problem added successfully!");
      console.log(res.data);
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("");
      setTopics([]);
      setExampleInput("");
      setExampleOutput("");

      console.log("Redirecting to add testcase page for problem ID:", res.data._id);
      {navigate(`/add/${res.data._id}`)};
    } catch (err) {
      console.error("Failed to add problem", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add New Problem
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          required
          multiline
          rows={4}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            label="Difficulty"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Topics</InputLabel>
          <Select
            multiple
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            input={<OutlinedInput label="Topics" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {topicOptions.map((topic) => (
              <MenuItem key={topic} value={topic}>
                <Checkbox checked={topics.indexOf(topic) > -1} />
                <ListItemText primary={topic} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          required
          label="Example Input"
          multiline
          rows={3}
          value={exampleInput}
          onChange={(e) => setExampleInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          required
          label="Example Output"
          multiline
          rows={3}
          value={exampleOutput}
          onChange={(e) => setExampleOutput(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box>
          <Button variant="contained" color="primary" type="submit">
            Add Problem
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddProblem;