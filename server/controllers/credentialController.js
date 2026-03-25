const Credential = require('../models/Credential');

// Helper to mask password
const maskPassword = (password) => {
    if (!password) return '';
    return '•'.repeat(8);
};

// @route   GET /api/credentials
// @desc    Get all credentials for the authenticated user
// @access  Private
exports.getCredentials = async (req, res) => {
    try {
        const credentials = await Credential.find({ userId: req.user.id }).sort({ createdAt: -1 });

        // Mask passwords for list view
        const maskedCredentials = credentials.map(cred => {
            const c = cred.toObject();
            c.password = maskPassword(c.password);
            return c;
        });

        res.json(maskedCredentials);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/credentials
// @desc    Add new credentials
// @access  Private
exports.createCredential = async (req, res) => {
    const { title, website, emailOrPhone, password, notes } = req.body;

    try {
        const newCredential = new Credential({
            userId: req.user.id,
            title,
            website,
            emailOrPhone,
            password,
            notes
        });

        const credential = await newCredential.save();

        // Return masked password
        const returnedCred = credential.toObject();
        returnedCred.password = maskPassword(returnedCred.password);

        res.json(returnedCred);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/credentials/:id
// @desc    Delete a credential
// @access  Private
exports.deleteCredential = async (req, res) => {
    try {
        const credential = await Credential.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!credential) {
            return res.status(404).json({ msg: 'Credential not found' });
        }

        res.json({ msg: 'Deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Credential not found' });
        }
        res.status(500).send('Server Error');
    }
};
