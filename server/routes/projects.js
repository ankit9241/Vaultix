const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const envController = require("../controllers/envController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, projectController.getProjects);
router.post("/", authMiddleware, projectController.createProject);
router.get("/:projectId/env", authMiddleware, envController.getProjectRootEnvs);
router.post(
  "/:projectId/env",
  authMiddleware,
  envController.createProjectRootEnv,
);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
