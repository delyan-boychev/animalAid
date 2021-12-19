"use strict";
const express = require("express");
const router = express.Router();
const CaptchaService = require("../services/captcha");
const captchaService = new CaptchaService();
router.get("/getCaptcha", (req, res) => {
  res.send(captchaService.getCaptcha());
});
module.exports = router;
