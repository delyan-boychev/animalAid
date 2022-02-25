const crypto = require("crypto");
const key = require("./config.json").TOKEN_ENCRYPTION.key;
const iv = require("./config.json").TOKEN_ENCRYPTION.iv;
const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return encrypted.toString("hex");
};
const decryptToken = (token) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes128",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(token, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return "";
  }
};
module.exports = { encryptToken, decryptToken };
