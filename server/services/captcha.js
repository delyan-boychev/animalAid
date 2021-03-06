"use strict";
const { createCanvas } = require("canvas");
const encryptCaptcha =
  require("../encryption/captchaEncryption").encryptCaptcha;
const CaptchaRepository = require("../repositories/captcha");
class CaptchaService {
  #captchaRepository = new CaptchaRepository();
  /**
   * Get captcha
   * @returns {Object} Captcha
   */
  async getCaptcha() {
    let captcha = this.generateCaptcha();
    while (
      (await this.#captchaRepository.saveCaptcha(
        captcha.captcha,
        captcha.code
      )) === false
    ) {
      captcha = this.generateCaptcha();
    }
    delete captcha.captcha;
    return captcha;
  }
  generateCaptcha() {
    const charsArray =
      "023456789abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    let captcha = [];
    let charsLength = charsArray.length;
    let index;
    while (captcha.length < 6) {
      index = Math.floor(Math.random() * charsLength);
      while (captcha.indexOf(charsArray[index]) !== -1)
        index = Math.floor(Math.random() * charsArray.length + 1);
      captcha.push(charsArray.charAt(index));
    }
    const width = 200;
    const height = 100;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.rotate((Math.round(Math.random() * 20) * Math.PI) / 180);
    ctx.strokeStyle = "black";
    ctx.font = "35px Times New Roman";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillText(captcha.join(""), 90, 30);
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(200, 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(0, 40);
    ctx.stroke();
    return {
      captcha: captcha.join(""),
      dataUrl: canvas.toDataURL("image/png"),
      code: encryptCaptcha(captcha.join("")),
    };
  }
}
module.exports = CaptchaService;
