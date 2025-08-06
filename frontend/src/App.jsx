import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProblemList from "./pages/ProblemList";
import AddProblem from "./pages/AddProblem";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SolveProblem from "./pages/SolveProblem";
import AddTestcase from "./pages/AddTestcase";
import SubmissionList from "./pages/SubmissionList";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/add" element={<AddProblem />} />
        <Route path="/add/:id" element={<AddTestcase />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/problems/:id" element={<SolveProblem />} />
        <Route path="/submissions/:id" element={<SubmissionList />} />
      </Routes>
    </Router>
  );
};

export default App;
