const Section = require("../models/Section");
const Project = require("../models/Project");
const EnvVariable = require("../models/EnvVariable");

// @route   GET /api/sections/:id
// @desc    Get a section by ID
// @access  Private
exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    res.json(section);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/projects/:projectId/sections
// @desc    Create a new section for a project
// @access  Private
exports.createSection = async (req, res) => {
  const { name, type, parentId } = req.body;
  const { projectId } = req.params;
  const sectionType = type || "folder";

  try {
    // Verify user owns project
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // RULE: Check if creating under parent
    if (parentId) {
      const parentSection = await Section.findOne({
        _id: parentId,
        userId: req.user.id,
      });

      if (!parentSection) {
        return res.status(404).json({ msg: "Parent section not found" });
      }

      // RULE 1: If creating folder, check if parent has env variables
      if (sectionType === "folder") {
        const hasEnvs = await EnvVariable.findOne({
          sectionId: parentId,
          userId: req.user.id,
        });
        if (hasEnvs) {
          return res.status(400).json({
            msg: "Cannot create folder when env exists",
          });
        }
      }

      // RULE 2: If creating env section, check if parent has subfolders
      if (sectionType === "env") {
        const hasSubfolders = await Section.findOne({
          parentId: parentId,
          userId: req.user.id,
        });
        if (hasSubfolders) {
          return res.status(400).json({
            msg: "Cannot add env when folders exist",
          });
        }
      }
    }

    // Root-level validation (parentId null): a project root can contain folders OR envs, never both.
    if (!parentId && sectionType === "folder") {
      const hasRootEnvs = await EnvVariable.findOne({
        projectId,
        sectionId: null,
        userId: req.user.id,
      });

      if (hasRootEnvs) {
        return res.status(400).json({
          msg: "Cannot create folder when env exists",
        });
      }
    }

    if (!parentId && sectionType === "env") {
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
    }

    const newSection = new Section({
      name,
      type: sectionType,
      projectId,
      parentId: parentId || null,
      userId: req.user.id,
    });

    const section = await newSection.save();
    res.json(section);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/projects/:projectId/sections
// @desc    Get all sections for a project
// @access  Private
exports.getSections = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Verify user owns project
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const sections = await Section.find({
      projectId,
      userId: req.user.id,
    });

    const sectionIds = sections.map((section) => section._id.toString());

    const folderCountsByParent = new Map();
    sections.forEach((section) => {
      if (!section.parentId || section.type !== "folder") return;
      const parentKey = section.parentId.toString();
      folderCountsByParent.set(
        parentKey,
        (folderCountsByParent.get(parentKey) || 0) + 1,
      );
    });

    const envCountsBySection = new Map();
    if (sectionIds.length > 0) {
      const envAggregation = await EnvVariable.aggregate([
        {
          $match: {
            userId: project.userId,
            sectionId: { $in: sections.map((section) => section._id) },
          },
        },
        {
          $group: {
            _id: "$sectionId",
            count: { $sum: 1 },
          },
        },
      ]);

      envAggregation.forEach((item) => {
        envCountsBySection.set(item._id.toString(), item.count);
      });
    }

    const sectionsWithCounts = sections.map((section) => {
      const key = section._id.toString();
      const folderCount = folderCountsByParent.get(key) || 0;
      const envCount = envCountsBySection.get(key) || 0;

      return {
        ...section.toObject(),
        folderCount,
        envCount,
        varCount: envCount,
      };
    });

    res.json(sectionsWithCounts);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/sections/:id/children
// @desc    Get children of a section
// @access  Private
exports.getSectionChildren = async (req, res) => {
  const { id: parentId } = req.params;

  try {
    // Verify user owns parent section
    const parentSection = await Section.findOne({
      _id: parentId,
      userId: req.user.id,
    });

    if (!parentSection) {
      return res.status(404).json({ msg: "Parent section not found" });
    }

    // Get subfolders
    const subfolders = await Section.find({
      parentId,
      userId: req.user.id,
    });

    // Get environment variables
    const envs = await EnvVariable.find({
      sectionId: parentId,
      userId: req.user.id,
    });

    res.json({
      subfolders,
      envs,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/sections/:id
// @desc    Update a section
// @access  Private
exports.updateSection = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Find section and verify ownership
    const section = await Section.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    // RULE: Cannot change section type once created
    // Only allow updating name and description
    const updatedSection = await Section.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description },
      { new: true, runValidators: true },
    );

    res.json(updatedSection);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   DELETE /api/sections/:id
// @desc    Delete a section
// @access  Private
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!section) {
      return res.status(404).json({ msg: "Section not found" });
    }

    // Cascade delete: remove this section + all descendant sections, then all env vars under them.
    const allProjectSections = await Section.find({
      projectId: section.projectId,
      userId: req.user.id,
    }).select("_id parentId");

    const sectionIdsToDelete = new Set([section._id.toString()]);
    let added = true;

    while (added) {
      added = false;
      for (const node of allProjectSections) {
        if (!node.parentId) continue;
        const parentId = node.parentId.toString();
        const nodeId = node._id.toString();

        if (
          sectionIdsToDelete.has(parentId) &&
          !sectionIdsToDelete.has(nodeId)
        ) {
          sectionIdsToDelete.add(nodeId);
          added = true;
        }
      }
    }

    const ids = Array.from(sectionIdsToDelete);

    await EnvVariable.deleteMany({
      sectionId: { $in: ids },
      userId: req.user.id,
    });

    await Section.deleteMany({
      _id: { $in: ids },
      userId: req.user.id,
    });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Section not found" });
    }
    res.status(500).send("Server Error");
  }
};
