// ✅ put this at the very top
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// now import routes AFTER env is loaded
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const executeRoutes = require("./routes/executeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { DBConnection } = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3000;


// app.use(cors({ origin: true, credentials: true }));
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB
DBConnection();

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/execute", executeRoutes);
app.use("/submissions", submissionRoutes);
app.use("/profile", profileRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Online Judge Backend!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});