const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const encryptCaptcha = (captcha) => {
  const keyIv = fs
    .readFileSync(path.resolve(__dirname, "captchaKeyIv"), "utf8")
    .split(";");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(keyIv[0], "hex"),
    Buffer.from(keyIv[1], "hex")
  );
  const encrypted = Buffer.concat([cipher.update(captcha), cipher.final()]);
  return encrypted.toString("hex");
};
const decryptCaptcha = (captchaKey) => {
  const keyIv = fs
    .readFileSync(path.resolve(__dirname, "captchaKeyIv"), "utf8")
    .split(";");
  try {
    const decipher = crypto.createDecipheriv(
      "aes128",
      Buffer.from(keyIv[0], "hex"),
      Buffer.from(keyIv[1], "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(captchaKey, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return "";
  }
};
const updateCaptchaEncryption = () => {
  const keyIv = `${crypto.randomBytes(16).toString("hex")};${crypto
    .randomBytes(16)
    .toString("hex")}`;
  fs.writeFileSync(path.resolve(__dirname, "captchaKeyIv"), keyIv);
};
module.exports = { updateCaptchaEncryption, encryptCaptcha, decryptCaptcha };
