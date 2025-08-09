import React, { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const login = auth.login;

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     //  Register the user
  //     await api.post(
  //       "/auth/register",
  //       { name, email, password },
  //       { withCredentials: true }
  //     );

  //     // 2. Auto-login immediately after successful registration
  //     const res = await api.post(
  //       "/auth/login",
  //       { email, password },
  //       { withCredentials: true }
  //     );

  //     // 3. Set user using context (automatically updates localStorage too)
  //     login(res.data.user);

  //     // 4. Redirect to Problem List
  //     navigate("/problems");
  //   } catch (err) {
  //     console.error("Registration failed", err);
  //     alert("Something went wrong.");
  //   }
  // };

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    // 1) Register
    await api.post("/auth/register", { name, email, password }, { withCredentials: true });

    // 2) Auto-login via context (this sets the cookie + refreshes user)
    await auth.login(email, password);

    // 3) Go to problems
    navigate("/problems");
  } catch (err) {
    console.error("Registration failed", err);
    alert("Something went wrong.");
  }
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField
          fullWidth
          required
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box>
          <Button variant="contained" type="submit">Register</Button>
        </Box>
      </form>
    </Container>
  );
};

export default Register;