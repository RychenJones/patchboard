import express = require("express");
import errorHandler = require("./middleware/errorHandler");
import projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api/projects", projectRoutes);
app.use(errorHandler);

export = app;
