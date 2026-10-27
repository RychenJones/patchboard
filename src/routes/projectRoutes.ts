import express = require("express");
import projectController = require("../controllers/projectController");

const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.listProjects);
router.delete("/:projectId", projectController.deleteProject);

export = router;
