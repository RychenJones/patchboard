import express = require("express");
import bugController = require("../controllers/bugController");

const router = express.Router({ mergeParams: true });

router.post("/", bugController.createBug);
router.get("/", bugController.listBugs);

export = router;
