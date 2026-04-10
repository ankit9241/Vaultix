const Credential = require("../models/Credential");
const { encryptFields, decryptFields } = require("../utils/fieldEncryption");

const CREDENTIAL_FIELDS = [
  "title",
  "website",
  "emailOrPhone",
  "password",
  "notes",
];

// @route   GET /api/credentials
// @desc    Get all credentials for the authenticated user
// @access  Private
exports.getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const decryptedCredentials = credentials.map((cred) =>
      decryptFields(cred.toObject(), CREDENTIAL_FIELDS),
    );

    res.json(decryptedCredentials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/credentials
// @desc    Add new credentials
// @access  Private
exports.createCredential = async (req, res) => {
  const { title, website, emailOrPhone, password, notes } = req.body;

  try {
    const encryptedPayload = encryptFields(
      { title, website, emailOrPhone, password, notes },
      CREDENTIAL_FIELDS,
    );

    const newCredential = new Credential({
      userId: req.user.id,
      ...encryptedPayload,
    });

    const credential = await newCredential.save();

    res.json(decryptFields(credential.toObject(), CREDENTIAL_FIELDS));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE /api/credentials/:id
// @desc    Delete a credential
// @access  Private
exports.deleteCredential = async (req, res) => {
  try {
    const credential = await Credential.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!credential) {
      return res.status(404).json({ msg: "Credential not found" });
    }

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Credential not found" });
    }
    res.status(500).send("Server Error");
  }
};
