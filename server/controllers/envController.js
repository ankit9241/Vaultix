const EnvVariable = require("../models/EnvVariable");
const Section = require("../models/Section");
const Project = require("../models/Project");
const { encryptFields, decryptFields } = require("../utils/fieldEncryption");

const decryptEnv = (envDoc) =>
  decryptFields(envDoc.toObject(), ["key", "value", "description"]);

// @route   POST /api/sections/:sectionId/env
// @desc    Add an environment variable to a section
// @access  Private
exports.createEnv = async (req, res) => {
  const { key, value, description } = req.body;
  const { sectionId } = req.params;

  try {
    // Verify user owns section
    const section = await Section.findOne({
      _id: sectionId,
      userId: req.user.id,
    });
    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    // RULE: Check if section has subfolders
    const hasSubfolders = await Section.findOne({
      parentId: sectionId,
      userId: req.user.id,
    });

    if (hasSubfolders) {
      return res.status(400).json({
        msg: "Cannot add env when folders exist",
      });
    }

    const encryptedPayload = encryptFields(
      {
        key,
        value,
        description,
      },
      ["key", "value", "description"],
    );

    const newEnv = new EnvVariable({
      projectId: null,
      sectionId,
      userId: req.user.id,
      ...encryptedPayload,
    });

    const env = await newEnv.save();
    res.json(decryptEnv(env));
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/projects/:projectId/env
// @desc    Add an environment variable at project root
// @access  Private
exports.createProjectRootEnv = async (req, res) => {
  const { key, value, description } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // RULE: root cannot accept envs if it already has root-level folders.
    const hasRootFolders = await Section.findOne({
      projectId,
      parentId: null,
      userId: req.user.id,
      type: "folder",
    });

    if (hasRootFolders) {
      return res.status(400).json({
        msg: "Cannot add env when folders exist",
      });
    }

    const encryptedPayload = encryptFields(
      {
        key,
        value,
        description,
      },
      ["key", "value", "description"],
    );

    const newEnv = new EnvVariable({
      projectId,
      sectionId: null,
      userId: req.user.id,
      ...encryptedPayload,
    });

    const env = await newEnv.save();
    res.json(decryptEnv(env));
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/sections/:sectionId/env
// @desc    Get all environment variables for a section
// @access  Private
exports.getEnvs = async (req, res) => {
  const { sectionId } = req.params;

  try {
    // Verify user owns the section
    const section = await Section.findOne({
      _id: sectionId,
      userId: req.user.id,
    });
    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    const envs = await EnvVariable.find({
      sectionId,
      userId: req.user.id,
    });

    res.json(envs.map((env) => decryptEnv(env)));
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/projects/:projectId/env
// @desc    Get environment variables at project root
// @access  Private
exports.getProjectRootEnvs = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const envs = await EnvVariable.find({
      projectId,
      userId: req.user.id,
      sectionId: null,
    });

    res.json(envs.map((env) => decryptEnv(env)));
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   DELETE /api/env/:id
// @desc    Delete an environment variable
// @access  Private
exports.deleteEnv = async (req, res) => {
  try {
    const env = await EnvVariable.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!env) {
      return res.status(404).json({ msg: "Environment variable not found" });
    }

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Environment variable not found" });
    }
    res.status(500).send("Server Error");
  }
};
