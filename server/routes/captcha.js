"use strict";
const express = require("express");
const router = express.Router();
const CaptchaService = require("../services/captcha");
const captchaService = new CaptchaService();
router.get("/getCaptcha", async (req, res) => {
  res.send(await captchaService.getCaptcha());
});
module.exports = router;
