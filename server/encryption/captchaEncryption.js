const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const encryptCaptcha = (captcha) => {
  const key = fs.readFileSync(path.resolve(__dirname, "captchaKey"), "utf8");
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(captcha), cipher.final()]);
  return iv + encrypted.toString("hex");
};
const decryptCaptcha = (captchaKey) => {
  const key = fs.readFileSync(path.resolve(__dirname, "captchaKey"), "utf8");
  const iv = captchaKey.slice(0, 32);
  const forDecrypt = captchaKey.slice(32);
  try {
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
const updateCaptchaEncryption = () => {
  const key = crypto.randomBytes(16).toString("hex");
  fs.writeFileSync(path.resolve(__dirname, "captchaKey"), key);
};
module.exports = { updateCaptchaEncryption, encryptCaptcha, decryptCaptcha };
