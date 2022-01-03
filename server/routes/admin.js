"use strict";
const express = require("express");
const authenticateAdmin = require("../authentication/authenticateAdmin");
const validation = require("../models/validation/validation");
const moderationVerifyVetSchema = require("../models/validation/admin/moderationVerifyVet");
const changeRoleSchema = require("../models/validation/admin/changeRole");
const AdminService = require("../services/admin");
const adminService = new AdminService();
const roles = require("../models/roles");
let router = express.Router();
router.get(
  "/getAllUsers/:pageNum/:searchQuery?",
  authenticateAdmin,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchQuery = req.params.searchQuery;
        if (searchQuery !== undefined) {
          let query = {
            role: { $in: [roles.Admin, roles.Moderator, roles.User] },
            $or: [
              { "name.first": { $regex: searchQuery, $options: "i" } },
              { "name.last": { $regex: searchQuery, $options: "i" } },
              { email: { $regex: searchQuery, $options: "i" } },
              { city: { $regex: searchQuery, $options: "i" } },
            ],
          };
          res.send(await adminService.getAllUsers(pageNum, query));
        } else {
          res.send(
            await adminService.getAllUsers(pageNum, {
              role: { $in: [roles.Admin, roles.Moderator, roles.User] },
            })
          );
        }
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.get(
  "/getAllVets/:pageNum/:searchQuery?",
  authenticateAdmin,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchQuery = req.params.searchQuery;
        if (searchQuery !== undefined) {
          let query = {
            role: roles.Vet,
            $or: [
              { "name.first": { $regex: searchQuery, $options: "i" } },
              { "name.last": { $regex: searchQuery, $options: "i" } },
              { email: { $regex: searchQuery, $options: "i" } },
              { address: { $regex: searchQuery, $options: "i" } },
              { URN: { $regex: searchQuery, $options: "i" } },
              { city: { $regex: searchQuery, $options: "i" } },
            ],
          };
          res.send(await adminService.getAllUsers(pageNum, query));
        } else {
          res.send(
            await adminService.getAllUsers(pageNum, {
              role: roles.Vet,
            })
          );
        }
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.get("/getUserInfo/:id", authenticateAdmin, async (req, res) => {
  if (req.params.id !== undefined && req.params.id !== "") {
    const user = await adminService.getUserInfo(req.params.id);
    if (user !== false) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
router.post("/changeRole", authenticateAdmin, async (req, res) => {
  validation(req.body, changeRoleSchema, res, async () => {
    res.send(await adminService.changeRole(req.body.id, req.body.newRole));
  });
});
router.post("/moderationVerifyVet", authenticateAdmin, async (req, res) => {
  validation(req.body, moderationVerifyVetSchema, res, async () => {
    res.send(await adminService.moderationVerify(req.body.email));
  });
});
module.exports = router;
