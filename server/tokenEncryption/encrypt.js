const crypto = require("crypto");
const key = require("./config.json").key;
const iv = require("./config.json").iv;
const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return encrypted.toString("hex");
};
module.exports = encryptToken;
