const express = require("express");
const router = express.Router({ mergeParams: true });
const envController = require("../controllers/envController");
const authMiddleware = require("../middleware/auth");

// Mounted at /api/projects/:projectId/env
router.post("/", authMiddleware, envController.createProjectRootEnv);
router.get("/", authMiddleware, envController.getProjectRootEnvs);

module.exports = router;
