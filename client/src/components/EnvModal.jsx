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
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!showPreview ? (
            <>
              {/* Upload Method Selection */}
              <div className="flex gap-2 rounded-lg bg-[#11151f] p-1">
                <button
                  onClick={() => setUploadMethod("paste")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    uploadMethod === "paste"
                      ? "bg-amber-400 text-[#0e0e10] shadow-sm"
                      : "text-gray-300 hover:text-amber-300 hover:bg-[#1d2433]"
                  }`}
                >
                  <FileText size={14} />
                  Paste Text
                </button>
                <button
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    uploadMethod === "file"
                      ? "bg-amber-400 text-[#0e0e10] shadow-sm"
                      : "text-gray-300 hover:text-amber-300 hover:bg-[#1d2433]"
                  }`}
                >
                  <Upload size={14} />
                  Upload File
                </button>
              </div>

              {/* Paste Method */}
              {uploadMethod === "paste" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-300">
                    Paste .env content
                  </label>
                  <textarea
                    rows="8"
                    value={envUploadText}
                    onChange={(e) => setEnvUploadText(e.target.value)}
                    placeholder="DATABASE_URL=postgresql://user:pass@localhost:5432/db&#10;JWT_SECRET=your-secret-key&#10;API_KEY=your-api-key&#10;NODE_ENV=production"
                    className="w-full rounded-lg border border-gray-700 bg-[#1d2433] px-4 py-3 font-mono text-sm text-[#f4f4f5] placeholder:text-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Paste your .env file content. Each line should be in
                    KEY=VALUE format.
                  </p>
                </div>
              )}

              {/* File Upload Method */}
              {uploadMethod === "file" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-300">
                    Upload .env file
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center transition-colors hover:border-amber-300/50">
                    <Upload size={32} className="mx-auto mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-[#f4f4f5]">
                      Click to upload or drag and drop
                    </p>
                    <p className="mb-4 text-xs text-gray-400">
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
                      className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0e0e10] transition-colors hover:opacity-90"
                    >
                      Choose File
                    </button>
                  </div>
                  {envUploadText && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-gray-400">
                        File content preview:
                      </p>
                      <div className="max-h-32 overflow-y-auto rounded-lg bg-[#1d2433] p-3">
                        <pre className="font-mono text-xs text-gray-300">
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
                <h3 className="mb-4 text-lg font-semibold text-amber-300">
                  Preview ({parsedEnvs.length} variables found)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#3c3c3c] bg-[#1e1e1e]">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-[#3c3c3c] bg-[#2d2d30]">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#9da5b4]">
                          Key
                        </th>
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#9da5b4]">
                          Value
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[#9da5b4]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3c3c3c]">
                      {parsedEnvs.map((env, index) => (
                        <tr
                          key={index}
                          className="transition-colors hover:bg-[#2a2d2e]"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm font-semibold text-[#4FC1FF]">
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
                                className="text-gray-500 transition-colors hover:text-amber-300"
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
                              className="text-gray-500 transition-colors hover:text-red-400"
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
