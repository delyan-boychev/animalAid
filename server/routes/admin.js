"use strict";
const express = require("express");
const authenticateAdmin = require("../authentication/authenticateAdmin");
const validation = require("../models/validation/validation");
const moderationVerifyVetSchema = require("../models/validation/admin/moderationVerifyVet");
const AdminService = require("../services/admin");
const adminService = new AdminService();
let router = express.Router();
router.get("/getAllUsers/:pageNum", authenticateAdmin, async (req, res) => {
  try {
    const pageNum = parseInt(req.params.pageNum);
    if (pageNum > 0) {
      res.send(await adminService.getAllUsers(pageNum));
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.post("/moderationVerifyVet", authenticateAdmin, async (req, res) => {
  validation(req.body, moderationVerifyVetSchema, res, async () => {
    res.send(await adminService.moderationVerify(req.body.email));
  });
});
module.exports = router;
