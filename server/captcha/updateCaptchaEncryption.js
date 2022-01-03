const extensionMethods = require("../extensionMethods");
const path = require("path");
const fs = require("fs");
const updateCaptchaEncryption = () => {
  const encryption = extensionMethods.randomStringWithSpecialSymbols(128);
  fs.writeFileSync(path.resolve(__dirname, "../captchaKey"), encryption);
};
module.exports = updateCaptchaEncryption;
