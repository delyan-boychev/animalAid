"use strict";
const express = require("express");
const authenticateAdmin = require("../authentication/authenticateAdmin");
const validation = require("../models/validation/validation");
const moderationVerifyVetSchema = require("../models/validation/admin/moderationVerifyVet");
const AdminService = require("../services/admin");
const adminService = new AdminService();
const roles = require("../models/roles");
let router = express.Router();
router.get(
  "/getAllUsers/:pageNum/:searchParam?/:searchQuery?",
  authenticateAdmin,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchParam = req.params.searchParam;
        const searchQuery = req.params.searchQuery;
        let query = {};
        if (searchQuery !== undefined && searchParam !== undefined) {
          let valid = true;
          switch (searchParam) {
            case "name":
              query = {
                $or: [
                  { "name.first": { $regex: searchQuery, $options: "i" } },
                  { "name.last": { $regex: searchQuery, $options: "i" } },
                ],
              };
              break;
            case "email":
              query = {
                email: { $regex: searchQuery, $options: "i" },
              };
              break;
            case "URN":
              query = {
                role: roles.Vet,
                URN: { $regex: searchQuery, $options: "i" },
              };
              break;
            case "address":
              query = {
                role: roles.Vet,
                address: { $regex: searchQuery, $options: "i" },
              };
              break;
            case "city":
              query = {
                city: { $regex: searchQuery, $options: "i" },
              };
              break;
            default:
              valid = false;
              res.sendStatus(400);
              break;
          }
          if (valid) {
            res.send(await adminService.getAllUsers(pageNum, query));
          }
        } else {
          res.send(await adminService.getAllUsers(pageNum, undefined));
        }
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.post("/moderationVerifyVet", authenticateAdmin, async (req, res) => {
  validation(req.body, moderationVerifyVetSchema, res, async () => {
    res.send(await adminService.moderationVerify(req.body.email));
  });
});
module.exports = router;
