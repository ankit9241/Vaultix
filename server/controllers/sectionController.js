const Section = require('../models/Section');
const Project = require('../models/Project');
const EnvVariable = require('../models/EnvVariable');

// @route   GET /api/sections/:id
// @desc    Get a section by ID
// @access  Private
exports.getSectionById = async (req, res) => {
    try {
        const section = await Section.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!section) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        res.json(section);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Section not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/projects/:projectId/sections
// @desc    Create a new section for a project
// @access  Private
exports.createSection = async (req, res) => {
    const { name } = req.body;
    const { projectId } = req.params;

    try {
        // Verify user owns the project
        const project = await Project.findOne({
            _id: projectId,
            userId: req.user.id
        });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const newSection = new Section({
            name,
            projectId,
            userId: req.user.id
        });

        const section = await newSection.save();
        res.json(section);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/projects/:projectId/sections
// @desc    Get all sections for a project
// @access  Private
exports.getSections = async (req, res) => {
    const { projectId } = req.params;

    try {
        // Verify user owns the project
        const project = await Project.findOne({
            _id: projectId,
            userId: req.user.id
        });

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const sections = await Section.find({ 
            projectId,
            userId: req.user.id 
        });
        res.json(sections);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/sections/:id
// @desc    Delete a section
// @access  Private
exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!section) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        // Delete all environment variables in this section
        await EnvVariable.deleteMany({ sectionId: req.params.id });

        res.json({ msg: 'Deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Section not found' });
        }
        res.status(500).send('Server Error');
    }
};
