const { createCanvas } = require("canvas");
class CaptchaService {
  getCaptcha() {
    const charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    let captcha = [];
    for (let i = 0; i < 6; i++) {
      let index = Math.floor(Math.random() * charsArray.length + 1);
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    const width = 200;
    const height = 40;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    var lastX = 0,
      lastY = 0;
    var i;
    ctx.strokeStyle = "black";
    ctx.font = "30px Georgia";
    ctx.fillText(captcha.join(""), 20, 30);
    for (i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);

      ctx.strokeStyle = "red";
      lastX = Math.floor(Math.random() * width);
      lastY = Math.floor(Math.random() * height);
      ctx.lineTo(lastX, lastY);
      ctx.stroke();
    }
    ctx.rotate((40 * Math.PI) / 180);
    return canvas.toDataURL("image/png");
  }
}
module.exports = CaptchaService;
