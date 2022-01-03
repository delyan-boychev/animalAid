"use strict";
const Captcha = require("../models/captcha");
class CaptchaRepository {
  async saveCaptcha(captcha, captchaCode) {
    let c = new Captcha();
    c.captcha = captcha;
    c.captchaCode = captchaCode;
    try {
      await c.save();
      return true;
    } catch {
      return false;
    }
  }
  async captchaExists(captcha, captchaCode) {
    return await Captcha.exists({ captcha, captchaCode });
  }
}
module.exports = CaptchaRepository;
