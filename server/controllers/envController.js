const EnvVariable = require('../models/EnvVariable');
const Section = require('../models/Section');
const Project = require('../models/Project');

// Helper to mask values
const maskValue = (value) => {
    if (!value) return '';
    return '•'.repeat(8);
};

// @route   POST /api/sections/:sectionId/env
// @desc    Add an environment variable to a section
// @access  Private
exports.createEnv = async (req, res) => {
    const { key, value, description } = req.body;
    const { sectionId } = req.params;

    try {
        // Verify user owns the section
        const section = await Section.findOne({
            _id: sectionId,
            userId: req.user.id
        });
        if (!section) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        const newEnv = new EnvVariable({
            sectionId,
            userId: req.user.id,
            key,
            value,
            description
        });

        const env = await newEnv.save();

        // Return masked value
        const returnedEnv = env.toObject();
        returnedEnv.value = maskValue(returnedEnv.value);

        res.json(returnedEnv);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Section not found' });
        }
        res.status(500).send('Server Error');
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
            userId: req.user.id
        });
        if (!section) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        const envs = await EnvVariable.find({ 
            sectionId,
            userId: req.user.id 
        });

        // Mask values
        const maskedEnvs = envs.map(env => {
            const e = env.toObject();
            e.value = maskValue(e.value);
            return e;
        });

        res.json(maskedEnvs);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Section not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/env/:id
// @desc    Delete an environment variable
// @access  Private
exports.deleteEnv = async (req, res) => {
    try {
        const env = await EnvVariable.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!env) {
            return res.status(404).json({ msg: 'Environment variable not found' });
        }

        res.json({ msg: 'Deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Environment variable not found' });
        }
        res.status(500).send('Server Error');
    }
};
