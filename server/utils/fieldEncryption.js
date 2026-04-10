const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const PREFIX = "enc::v1::";

const getKey = () => {
  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "Missing DATA_ENCRYPTION_KEY (or JWT_SECRET fallback) for encryption",
    );
  }

  // Derive a stable 32-byte key from the configured secret.
  return crypto.createHash("sha256").update(secret).digest();
};

const isEncrypted = (value) =>
  typeof value === "string" && value.startsWith(PREFIX);

const encryptField = (value) => {
  if (value === undefined || value === null) return value;

  const text = String(value);
  if (text.length === 0) return text;
  if (isEncrypted(text)) return text;

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
};

const decryptField = (value) => {
  if (value === undefined || value === null) return value;
  if (typeof value !== "string") return value;
  if (!isEncrypted(value)) return value;

  const payload = value.slice(PREFIX.length);
  const [ivB64, tagB64, cipherB64] = payload.split(":");

  if (!ivB64 || !tagB64 || !cipherB64) {
    throw new Error("Invalid encrypted field payload");
  }

  const key = getKey();
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(cipherB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

const encryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach((field) => {
    if (result[field] !== undefined) {
      result[field] = encryptField(result[field]);
    }
  });
  return result;
};

const decryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach((field) => {
    if (result[field] !== undefined) {
      try {
        result[field] = decryptField(result[field]);
      } catch {
        // Keep original value if decryption fails; avoids hard-failing reads.
        result[field] = obj[field];
      }
    }
  });
  return result;
};

module.exports = {
  encryptField,
  decryptField,
  encryptFields,
  decryptFields,
  isEncrypted,
};
