// // src/pages/Login.jsx
// import React, { useState, useContext } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
// } from "@mui/material";
// import api from "../api.js";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext"; 

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const auth = useContext(AuthContext);
//   const login = auth.login;

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post(
//         "/auth/login",
//         { email, password },
//         { withCredentials: true }
//       );
//       login(res.data.user); // ✅ update global state and localStorage
//       alert("Login successful");
//       navigate("/problems"); // ✅ redirect to Problem List
//     } catch (err) {
//       console.error(err);
//       alert("Login failed");
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>Login</Typography>
//       <form onSubmit={handleLogin}>
//         <TextField
//           label="Email"
//           fullWidth
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <Box>
//           <Button variant="contained" color="primary" type="submit">
//             Login
//           </Button>
//         </Box>
//       </form>
//     </Container>
//   );
// };

// export default Login;


// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);     // context handles API + state
      navigate("/problems");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={authLoading}
          >
            {authLoading ? "Signing in..." : "Login"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;