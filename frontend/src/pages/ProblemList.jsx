import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Card,
  CardContent,
  
} from "@mui/material";
import axios from "axios";

const ProblemList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [topics, setTopics] = useState([]);

  const fetchProblems = async () => {
    try {
      let query = [];
      if (difficulty) query.push(`difficulty=${difficulty}`);
      if (topics && topics.length > 0) {
        topics.forEach(t => query.push(`topic=${t}`));
      }
      const queryString = query.length ? `?${query.join("&")}` : "";
      console.log("Fetching problems with query:", queryString);
      const res = await axios.get(`http://localhost:3000/problems${queryString}`, {
        withCredentials: true, // for sending cookies
      });
      console.log("Fetched problems:", res.data);
      setProblems(res.data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    }
  };

  useEffect(() => {
    fetchProblems(); // Initial fetch without filters
  }, []);

  return (
    <Container style={{ marginTop: "2rem" }}>
    
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            label="Difficulty"
            sx={{ width: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Topic</InputLabel>
          <Select
            multiple
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            label="Topic"
            sx={{ width: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="math">Math</MenuItem>
            <MenuItem value="array">Arrays</MenuItem>
            <MenuItem value="string">Strings</MenuItem>
            <MenuItem value="linkedlist">Linked List</MenuItem>
            <MenuItem value="tree">Tree</MenuItem>
            <MenuItem value="hashing">Hashing</MenuItem>
            <MenuItem value="stack">Stack</MenuItem>
            <MenuItem value="queue">Queue</MenuItem>
            <MenuItem value="heap">Heap</MenuItem>
            <MenuItem value="dp">DP</MenuItem>
            <MenuItem value="greedy">Greedy</MenuItem>
            <MenuItem value="graph">Graph</MenuItem>
            <MenuItem value="binary-search">Binary Search</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={fetchProblems}>
          Apply Filter
        </Button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/add")}
          >
            Add New Problem
          </Button>
        </div>
      </Box>


      <ul style={{ listStyleType: "none", padding: 0 }}>
        {problems.map(problem => (
          <li key={problem._id}>
            <Card style={{ marginBottom: "1rem", border: "1px solid #ddd" }}>
              <CardContent style={{ display: "flex", justifyContent: "space-between" ,gap: "1rem" }}>

                <div>
                  <Typography variant="h6">{problem.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    
                    <div style={{ color: problem.difficulty === 'easy' ? 'green' : problem.difficulty === 'medium' ? 'orange' : 'red' }}>
                      {problem.difficulty}
                    </div>
                    {problem.topics.join(", ")}
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Button variant="contained" onClick={() => navigate(`/problems/${problem._id}`)}>
                    Solve
                  </Button>
                  <Button onClick={() => navigate(`/submissions/${problem._id}`)} >
                    View Submissions
                  </Button>
                </div>
                
              </CardContent>
            </Card> 
          </li>  
        ))}
      </ul>
    </Container>
  );
};

export default ProblemList;