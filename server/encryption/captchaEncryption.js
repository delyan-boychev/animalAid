const crypto = require("crypto");
const caesarCipher = require("./caesarCipher");
const encryptCaptcha = (captcha) => {
  const key = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(captcha), cipher.final()]);
  return caesarCipher(iv + encrypted.toString("hex"), 7);
};
module.exports = { encryptCaptcha };
