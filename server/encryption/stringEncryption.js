const crypto = require("crypto");
const key = require("./config.json").OTHER_ENCRYPTION.key;
const encryptString = (string) => {
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);
  return iv + encrypted.toString("hex");
};
const decryptString = (string) => {
  try {
    const iv = string.slice(0, 32);
    const forDecrypt = string.slice(32);
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
module.exports = { encryptString, decryptString };
