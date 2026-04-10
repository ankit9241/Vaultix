import React, { useState } from "react";
import { X, Upload, FileText, Eye, EyeOff } from "lucide-react";
import { parseEnvContent } from "../utils/envUtils";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import CodeBlock from "./ui/CodeBlock";

const EnvModal = ({ isOpen, onClose, sectionId, onEnvCreated, editingEnv }) => {
  const [envUploadText, setEnvUploadText] = useState("");
  const [parsedEnvs, setParsedEnvs] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealedValues, setRevealedValues] = useState({});
  const [uploadMethod, setUploadMethod] = useState("paste"); // 'paste' or 'file'
  const fileInputRef = React.useRef(null);

  const resetForm = () => {
    setEnvUploadText("");
    setParsedEnvs([]);
    setShowPreview(false);
    setError("");
    setRevealedValues({});
    setUploadMethod("paste");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith(".env")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setEnvUploadText(content);
          // Automatically parse after file upload
          handleUploadTextWithContent(content);
        };
        reader.readAsText(file);
      } else {
        setError("Please upload a valid .env file");
      }
    }
  };

  const handleUploadTextWithContent = (content) => {
    setError("");
    try {
      const parsed = parseEnvContent(content);
      if (parsed.length === 0) {
        setError("No valid environment variables found");
        return;
      }

      const envsWithMetadata = parsed.map((env, index) => ({
        ...env,
        description: `Imported from .env file`,
        revealed: false,
        actualValue: env.value,
        value: "•".repeat(Math.min(env.value.length, 12)),
      }));

      setParsedEnvs(envsWithMetadata);
      setShowPreview(true);
    } catch (err) {
      setError("Failed to parse .env content");
    }
  };

  const handleUploadText = () => {
    handleUploadTextWithContent(envUploadText);
  };

  const handleUploadSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // Create all parsed environment variables
      const envsToCreate = parsedEnvs.map((env) => ({
        key: env.key,
        value: env.actualValue,
        description: env.description,
        revealed: false,
        actualValue: env.actualValue,
      }));

      onEnvCreated(envsToCreate);
      resetForm();
      handleClose();
    } catch (err) {
      setError("Failed to create environment variables");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleValueReveal = (index) => {
    setRevealedValues((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const maskValue = (value) => "•".repeat(Math.min(value.length, 12));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Environment Variables"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!showPreview ? (
            <>
              {/* Upload Method Selection */}
              <div className="flex gap-2 p-1 bg-panel rounded-lg">
                <button
                  onClick={() => setUploadMethod("paste")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    uploadMethod === "paste"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-primary hover:bg-[#1E293B]"
                  }`}
                >
                  <FileText size={14} />
                  Paste Text
                </button>
                <button
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    uploadMethod === "file"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-primary hover:bg-[#1E293B]"
                  }`}
                >
                  <Upload size={14} />
                  Upload File
                </button>
              </div>

              {/* Paste Method */}
              {uploadMethod === "paste" && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Paste .env content
                  </label>
                  <textarea
                    rows="8"
                    value={envUploadText}
                    onChange={(e) => setEnvUploadText(e.target.value)}
                    placeholder="DATABASE_URL=postgresql://user:pass@localhost:5432/db&#10;JWT_SECRET=your-secret-key&#10;API_KEY=your-api-key&#10;NODE_ENV=production"
                    className="w-full px-4 py-3 bg-code text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent font-mono text-sm placeholder:text-text-muted"
                  />
                  <p className="text-xs text-text-muted mt-2">
                    Paste your .env file content. Each line should be in
                    KEY=VALUE format.
                  </p>
                </div>
              )}

              {/* File Upload Method */}
              {uploadMethod === "file" && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Upload .env file
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload
                      size={32}
                      className="mx-auto text-text-muted mb-4"
                    />
                    <p className="text-sm text-text-primary mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-text-muted mb-4">
                      Only .env files are supported
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".env"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                  {envUploadText && (
                    <div className="mt-4">
                      <p className="text-xs text-text-muted mb-2">
                        File content preview:
                      </p>
                      <div className="bg-code p-3 rounded-lg max-h-32 overflow-y-auto">
                        <pre className="text-xs text-text-muted font-mono">
                          {envUploadText.substring(0, 200)}
                          {envUploadText.length > 200 && "..."}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                {uploadMethod === "paste" && (
                  <Button
                    onClick={handleUploadText}
                    disabled={!envUploadText.trim()}
                    className="flex-1"
                  >
                    Preview Variables
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Preview ({parsedEnvs.length} variables found)
                </h3>
                <div className="bg-transparent border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-transparent border-b border-border">
                        <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Key
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parsedEnvs.map((env, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#1E293B] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm font-semibold text-primary">
                              {env.key}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <CodeBlock className="flex-1 text-sm">
                                {revealedValues[index]
                                  ? env.actualValue
                                  : maskValue(env.actualValue)}
                              </CodeBlock>
                              <button
                                onClick={() => toggleValueReveal(index)}
                                className="text-text-muted hover:text-primary transition-colors"
                              >
                                {revealedValues[index] ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setParsedEnvs(
                                  parsedEnvs.filter((_, i) => i !== index),
                                );
                              }}
                              className="text-text-muted hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleUploadSubmit}
                  loading={submitting}
                  disabled={parsedEnvs.length === 0}
                  className="flex-1"
                >
                  Save {parsedEnvs.length} Variables
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EnvModal;
