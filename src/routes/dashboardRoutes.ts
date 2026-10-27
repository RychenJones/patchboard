import express = require("express");
import dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", dashboardController.getDashboard);

export = router;
