"use strict";
const express = require("express");
const router = express.Router();
const CaptchaService = require("../services/captcha");
const captchaService = new CaptchaService();
router.get("/get.png", (req, res) => {
  const img = Buffer.from(
    captchaService.getCaptcha().replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  res.set("Content-Type", "image/png");
  res.send(img);
});
module.exports = router;
