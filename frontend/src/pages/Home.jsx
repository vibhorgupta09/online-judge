

import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Link,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import BugReportIcon from "@mui/icons-material/BugReport";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedIcon from "@mui/icons-material/Verified";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SchoolIcon from "@mui/icons-material/School";
import SecurityIcon from "@mui/icons-material/Security";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LabelIcon from "@mui/icons-material/Label";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import ListAltIcon from "@mui/icons-material/ListAlt";

const FeatureCard = ({ icon, title, desc }) => (
  <Card
    elevation={3}
    sx={{
      height: "100%",
      borderRadius: 3,
      transition: "transform .2s ease, box-shadow .2s ease",
      "&:hover": { transform: "translateY(-4px)", boxShadow: 8 },
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {desc}
      </Typography>
    </CardContent>
  </Card>
);

const StepCard = ({ step, title, desc, icon }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      p: 1,
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Chip
          label={`Step ${step}`}
          size="small"
          color="primary"
          sx={{ fontWeight: 700 }}
        />
        {icon}
      </Stack>
      <Typography variant="subtitle1" mt={1} fontWeight={700}>
        {title}
      </Typography>
      <Typography color="text.secondary" mt={0.5}>
        {desc}
      </Typography>
    </CardContent>
  </Card>
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* HERO */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(156,39,176,0.08) 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Chip
                  icon={<SchoolIcon />}
                  label="Beginner friendly Online Judge"
                  color="primary"
                  variant="outlined"
                  sx={{ width: "fit-content", fontWeight: 700 }}
                />
                <Typography
                  variant="h3"
                  fontWeight={800}
                  lineHeight={1.15}
                  sx={{ letterSpacing: "-0.5px" }}
                >
                  Introducing... 
                  <Box component="span" color="primary.main">
                    {" NoobCode"}
                  </Box>
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  lineHeight={1.15}
                  sx={{ letterSpacing: "-0.5px" }}
                >
                  From Noob to Pro.  
                  <Box component="span" color="primary.main">
                    {" Learn by doing"}
                  </Box>
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                  An AI powered Online Judge that helps beginners debug faster,
                  understand time & space complexity and build clean coding
                  habits... not just give a verdicts. ;)
                </Typography>

                

                <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                  <Chip icon={<BoltIcon />} label="No signup required to try" variant="outlined" />
                </Stack>
              </Stack>
            </Grid>

            
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h5" fontWeight={800} textAlign="center" mb={3}>
          How it works
        </Typography>
        {/* <Grid container spacing={3}> */}
        <div style={{ display: "flex" , justifyContent: "space-evenly"}}>
          <Grid item xs={12} md={4} style={{maxWidth: "400px", margin: "10px"}}>
            <StepCard
              step={1}
              title="Pick a problem"
              desc="Filter by difficulty and topic. Read constraints and examples."
              icon={<BoltIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={4} style={{maxWidth: "400px", margin: "10px"}}>
            <StepCard
              step={2}
              title="Code & submit"
              desc="Use the built-in editor. Run your custom tests or submit directly."
              icon={<RocketLaunchIcon color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={4} style={{maxWidth: "400px", margin: "10px"}}>
            <StepCard
              step={3}
              title="Learn with AI"
              desc="Get AI debugging help, complexity estimates and code quality tips."
              icon={<InsightsIcon color="primary" />}
            />
          </Grid>
        </div>
        
        {/* </Grid> */}
      </Container>

      <Divider />

      {/* FEATURES / USP */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={800} mb={3} textAlign="left">
              Why NoobCode?
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
              icon={<BugReportIcon color="primary" />}
              title="AI Debugger"
              desc="Readable explanations for compile/runtime errors and failing test cases so you fix issues faster."
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
              icon={<InsightsIcon color="primary" />}
              title="AI Complexity Analyzer"
              desc="Get time/space complexity feedback to compare approaches and learn Big-O by practice."
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
              icon={<VerifiedIcon color="primary" />}
              title="AI Code Quality Review"
              desc="Actionable suggestions on naming, structure and best practices to build good habits early."
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
                icon={<FilterAltIcon color="primary" />}
                title="Problem Filters"
                desc="Find the right problems fast with filters for difficulty and topic."
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
                icon={<AccountCircleIcon color="primary" />}
                title="Profile & Progress"
                desc="Track solved problems, difficulty breakdowns and topic mastery breakdowns and reports."
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ margin: "20px"}}>
            <FeatureCard
                icon={<HistoryIcon color="primary" />}
                title="Submission History"
                desc="Review yours and other's past attempts with verdicts and timestamps. Revisit to improve solutions."
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ margin: "20px"}}>
            <FeatureCard
              icon={<SecurityIcon color="primary" />}
              title="Secure & Scalable"
              desc="Dockerized compiler microservice runs code in isolated containers. Safe by design and easy to scale."
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ margin: "20px"}}>
            <FeatureCard
              icon={<AutoGraphIcon color="primary" />}
              title="Instant Start"
              desc="No forced signup. Browse and solve right away. Create an account later to track progress."
            />
          </Grid>
        
      </Container>

      {/* DEMO SHOTS */}
      <Box sx={{ bgcolor: (t) => (t.palette.mode === "light" ? "#fafafa" : "background.paper") }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack alignItems="center" mt={4} spacing={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/problems")}
              startIcon={<RocketLaunchIcon />}
            >
              Explore Problems
            </Button>
            <Typography variant="body2" color="text.secondary">
              Or{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                create an account
              </Link>{" "}
              to track progress, submissions, and badges.
            </Typography>
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}