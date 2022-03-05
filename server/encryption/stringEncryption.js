const crypto = require("crypto");
const caesarCipher = require("./caesarCipher");
const key = require("./config.json").OTHER_ENCRYPTION.key;
const encryptString = (string) => {
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);
  return caesarCipher(iv + encrypted.toString("hex"), 5);
};
const decryptString = (string) => {
  try {
    string = caesarCipher(string, -5);
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
