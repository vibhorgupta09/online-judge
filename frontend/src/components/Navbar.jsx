
import React,{useContext, useEffect} from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
const {logout, user, login } = useContext(AuthContext);
const navigate = useNavigate();

useEffect(() => { // to sync user state with backend
  const checkAuth = async () => {
    try {
      const res = await axios.get("/http://localhost:3000/auth/check-auth");
      if (res.data.isLoggedIn) {
        login(res.data.user);  // set user in context
      } else {
        logout(); // clear user in context
      }
    } catch (err) {
      logout(); // fallback in case of error
    }
  };

  checkAuth();
}, []);

  return (
    <AppBar position="static" style={{padding: "10px", marginBottom: "10px"}}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          onClick={() => navigate("/problems")}
          style={{ color: "white", textDecoration: "none" }}
        >
          Online Judge
        </Typography>

         {/* Navigation buttons */}
        <Box>
          <Button color="inherit" onClick={() => navigate("/problems")}>Problems</Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>View profile</Button>
        </Box>
        <Box>
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
              <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;