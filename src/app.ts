import express = require("express");
import bugItemRoutes = require("./routes/bugItemRoutes");
import bugRoutes = require("./routes/bugRoutes");
import errorHandler = require("./middleware/errorHandler");
import projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/bugs", bugRoutes);
app.use("/api/bugs", bugItemRoutes);
app.use(errorHandler);

export = app;
