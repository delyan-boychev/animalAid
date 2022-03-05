const crypto = require("crypto");
const key = require("./config.json").TOKEN_ENCRYPTION.key;
const encryptToken = (token) => {
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return iv + encrypted.toString("hex");
};
const decryptToken = (token) => {
  try {
    const iv = token.slice(0, 32);
    const forDecrypt = token.slice(32);
    const decipher = crypto.createDecipheriv(
      "aes128",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(forDecrypt, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return "";
  }
};
module.exports = { encryptToken, decryptToken };
