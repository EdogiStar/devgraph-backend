const express = require("express");

const {
  getDeveloper,
  getDeveloperTechnologies,
  getDeveloperConnections,
} = require("../controllers/developer.controller");

const router = express.Router();

router.get("/:id/technologies", getDeveloperTechnologies);
router.get("/:id/connections", getDeveloperConnections);
router.get("/:id", getDeveloper);
module.exports = router;