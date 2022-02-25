const crypto = require("crypto");
const key = require("./config.json").OTHER_ENCRYPTION.key;
const iv = require("./config.json").OTHER_ENCRYPTION.iv;
const encryptString = (string) => {
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);
  return encrypted.toString("hex");
};
const decryptString = (string) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes128",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(string, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return "";
  }
};
module.exports = { encryptString, decryptString };
