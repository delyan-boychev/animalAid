const { createCanvas } = require("canvas");
const ENCRYPTION_CAPTCHA = require("../config.json").CAPTCHA_ENCRYPTION_KEY;
const Cryptr = require("cryptr");
class CaptchaService {
  getCaptcha() {
    const charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    let captcha = [];
    let charsLength = charsArray.length;
    let index;
    for (let i = 0; i < 6; i++) {
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
    ctx.font = "30px Arial";
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
    const cryptr = new Cryptr(ENCRYPTION_CAPTCHA);
    return {
      dataUrl: canvas.toDataURL("image/png"),
      code: cryptr.encrypt(captcha.join("")),
    };
  }
}
module.exports = CaptchaService;
