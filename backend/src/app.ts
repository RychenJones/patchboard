import express = require("express");
import bugItemRoutes = require("./routes/bugItemRoutes");
import bugRoutes = require("./routes/bugRoutes");
import dashboardRoutes = require("./routes/dashboardRoutes");
import errorHandler = require("./middleware/errorHandler");
import projectRoutes = require("./routes/projectRoutes");

const app = express();

const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

// Apply CORS headers and answer browser preflight requests.
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send();
    return;
  }

  next();
});

app.use(express.json());

// Provide a simple health response for the root route.
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/bugs", bugRoutes);
app.use("/api/bugs", bugItemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

export = app;
