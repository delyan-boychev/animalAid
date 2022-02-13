"use strict";
const Captcha = require("../models/captcha");
class CaptchaRepository {
  /**
   * Save captcha
   * @param {String} captcha Captcha code decrypted
   * @param {String} captchaCode Captcha code encrypted
   * @returns {Boolean}
   */
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
  /**
   * Check captcha exists
   * @param {String} captcha Captcha code decrypted
   * @param {String} captchaCode Captcha code encrypted
   * @returns  {Boolean}
   */
  async captchaExists(captcha, captchaCode) {
    return await Captcha.exists({ captcha, captchaCode });
  }
}
module.exports = CaptchaRepository;
