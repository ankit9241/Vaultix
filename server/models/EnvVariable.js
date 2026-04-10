const mongoose = require("mongoose");

const envVariableSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

envVariableSchema.pre("validate", function () {
  const hasProject = !!this.projectId;
  const hasSection = !!this.sectionId;

  // Data safety: an env must belong to exactly one node (project root OR section).
  if (hasProject === hasSection) {
    this.invalidate(
      "sectionId",
      "EnvVariable must belong to either project root or section",
    );
  }
});

module.exports = mongoose.model("EnvVariable", envVariableSchema);
