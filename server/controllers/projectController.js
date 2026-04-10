const Project = require("../models/Project");
const Section = require("../models/Section");
const EnvVariable = require("../models/EnvVariable");

// @route   GET /api/projects
// @desc    Get all projects for the authenticated user
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const projectId = project._id;

        const sections = await Section.find({
          projectId,
          userId: req.user.id,
        }).select("_id parentId type");

        const rootFolderCount = sections.filter(
          (section) => !section.parentId && section.type === "folder",
        ).length;

        const sectionIds = sections.map((section) => section._id);
        const sectionEnvCount =
          sectionIds.length > 0
            ? await EnvVariable.countDocuments({
                sectionId: { $in: sectionIds },
                userId: req.user.id,
              })
            : 0;

        const rootEnvCount = await EnvVariable.countDocuments({
          projectId,
          sectionId: null,
          userId: req.user.id,
        });

        return {
          ...project.toObject(),
          folderCount: rootFolderCount,
          envCount: sectionEnvCount + rootEnvCount,
          sections: rootFolderCount,
        };
      }),
    );

    res.json(projectsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      userId: req.user.id,
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check user
    if (project.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Get all sections in this project
    const sections = await Section.find({ projectId: req.params.id });
    const sectionIds = sections.map((s) => s._id);

    // Delete all environment variables in these sections
    if (sectionIds.length > 0) {
      await EnvVariable.deleteMany({
        sectionId: { $in: sectionIds },
      });
    }

    // Delete root-level environment variables (not attached to a section)
    await EnvVariable.deleteMany({
      projectId: req.params.id,
      sectionId: null,
    });

    // Delete all sections
    await Section.deleteMany({ projectId: req.params.id });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};
