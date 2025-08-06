const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const executeRoutes = require("./routes/executeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");

const { DBConnection } = require("./database/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: true, credentials: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // specifically allow your frontend
    credentials: true,               // crucial to allow cookies
  })
);
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