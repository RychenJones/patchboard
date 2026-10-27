import express = require("express");
import bugController = require("../controllers/bugController");

const router = express.Router();

router.patch("/:bugId", bugController.updateBug);
router.delete("/:bugId", bugController.deleteBug);

export = router;
