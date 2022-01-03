const fs = require("fs");
const Cryptr = require("cryptr");
const path = require("path");
const encryptCaptcha = (captcha) => {
  const encryptionKey = fs.readFileSync(
    path.resolve(__dirname, "../captchaKey"),
    "utf8"
  );
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.encrypt(captcha);
};
const decryptCaptcha = (captchaKey) => {
  const encryptionKey = fs.readFileSync(
    path.resolve(__dirname, "../captchaKey"),
    "utf8"
  );
  const cryptr = new Cryptr(encryptionKey);
  try {
    return cryptr.decrypt(captchaKey);
  } catch {
    return false;
  }
};
module.exports = { encryptCaptcha, decryptCaptcha };
