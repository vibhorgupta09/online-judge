
// // import React,{useContext, useEffect} from "react";
// // import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// // // import { Link } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import api from "../api.js";

// // const Navbar = () => {
// // const {logout, user, login } = useContext(AuthContext);
// // const navigate = useNavigate();

// // useEffect(() => { // to sync user state with backend
// //   const checkAuth = async () => {
// //     try {
// //       const res = await api.get("/auth/check-auth");
// //       if (res.data.isLoggedIn) {
// //         login(res.data.user);  // set user in context
// //       } else {
// //         logout(); // clear user in context
// //       }
// //     } catch (err) {
// //       logout(); // fallback in case of error
// //     }
// //   };

// //   checkAuth();
// // }, []);

// //   return (
// //     <AppBar position="static" style={{padding: "10px", marginBottom: "10px"}}>
// //       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
// //         <Typography
// //           variant="h4"
// //           onClick={() => navigate("/problems")}
// //           style={{ color: "white", textDecoration: "none" }}
// //         >
// //           Online Judge
// //         </Typography>

// //          {/* Navigation buttons */}
// //         <Box>
// //           <Button color="inherit" onClick={() => navigate("/problems")}>Problems</Button>
// //           <Button color="inherit" onClick={() => navigate("/profile")}>View profile</Button>
// //         </Box>
// //         <Box>
// //           {user ? (
// //             <Button color="inherit" onClick={logout}>Logout</Button>
// //           ) : (
// //             <>
// //               <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
// //               <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
// //             </>
// //           )}
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Navbar;

// import React, { useContext, useEffect } from "react";
// import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import api from "../api.js";



// const Navbar = () => {
//   const { user, logout, login } = useContext(AuthContext);
//   const navigate = useNavigate();

// useEffect(() => {
//   const checkAuth = async () => {
//     try {
//       const res = await api.get("/auth/check-auth");
//       if (res.data.isLoggedIn) {
//         login(res.data.user);
//       } else {
//         // ⛔️ don’t call logout() here (it tries to POST /logout)
//         // just clear local context state
//         if (typeof clearUser === 'function') clearUser();
//         else login(null);
//       }
//     } catch {
//       if (typeof clearUser === 'function') clearUser();
//       else login(null);
//     }
//   };
//   checkAuth();
// }, []);

//   return (
//     <AppBar position="static" style={{ padding: "10px", marginBottom: "10px" }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography
//           variant="h4"
//           onClick={() => navigate("/problems")}
//           style={{ color: "white", textDecoration: "none", cursor: "pointer" }}
//         >
//           Online Judge
//         </Typography>

//         <Box>
//           <Button color="inherit" onClick={() => navigate("/problems")}>Problems</Button>
//           <Button color="inherit" onClick={() => navigate("/profile")}>View profile</Button>
//         </Box>

//         <Box>
//           {user ? (
//             <Button color="inherit" onClick={logout}>Logout</Button>
//           ) : (
//             <>
//               <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
//               <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;


import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" style={{ padding: "10px", marginBottom: "10px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          onClick={() => navigate("/problems")}
          style={{ color: "white", textDecoration: "none", cursor: "pointer" }}
        >
          Online Judge
        </Typography>

        <Box>
          <Button color="inherit" onClick={() => navigate("/problems")}>Problems</Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>View profile</Button>
        </Box>

        <Box>
          {authLoading ? null : user ? (
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