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
    if (!(await Captcha.exists({ captcha, captchaCode }))) {
      let c = new Captcha();
      c.captcha = captcha;
      c.captchaCode = captchaCode;
      try {
        await c.save();
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  /**
   * Validate captcha
   * @param {String} captcha Captcha code decrypted
   * @param {String} captchaCode Captcha code encrypted
   * @returns  {Boolean}
   */
  async validateCaptcha(captcha, captchaCode) {
    const d = await Captcha.deleteOne({ captcha, captchaCode });
    if (d.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = CaptchaRepository;
