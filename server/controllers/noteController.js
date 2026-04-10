const Note = require("../models/Note");
const { encryptFields, decryptFields } = require("../utils/fieldEncryption");

const NOTE_FIELDS = ["title", "content"];

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    const decryptedNotes = notes.map((note) =>
      decryptFields(note.toObject(), NOTE_FIELDS),
    );
    res.json(decryptedNotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/notes
// @desc    Add new note
// @access  Private
exports.createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const encryptedPayload = encryptFields({ title, content }, NOTE_FIELDS);

    const newNote = new Note({
      userId: req.user.id,
      ...encryptedPayload,
    });

    const note = await newNote.save();
    res.json(decryptFields(note.toObject(), NOTE_FIELDS));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.status(500).send("Server Error");
  }
};
