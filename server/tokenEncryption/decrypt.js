const crypto = require("crypto");
const key = require("./config.json").key;
const iv = require("./config.json").iv;
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
module.exports = decryptToken;
