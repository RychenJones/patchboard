import express = require("express");
import projectController = require("../controllers/projectController");

const router = express.Router();

router.post("/", projectController.createProject);
router.get("/", projectController.listProjects);
router.get("/:projectId", projectController.getProject);
router.delete("/:projectId", projectController.deleteProject);

export = router;
