"use strict";
const express = require("express");
const authenticateAdmin = require("../authentication/authenticateAdmin");
const validation = require("../models/validation/validation");
const moderationVerifyVetSchema = require("../models/validation/admin/moderationVerifyVet");
const changeRoleSchema = require("../models/validation/admin/changeRole");
const editProfileSchema = require("../models/validation/admin/editProfile");
const changeProfilePhotoSchema = require("../models/validation/admin/changeProfilePhoto");
const deleteThreadSchema = require("../models/validation/admin/deleteThread");
const deleteThreadPostSchema = require("../models/validation/admin/deleteThreadPost");
const AdminService = require("../services/admin");
const adminService = new AdminService();
const roles = require("../models/roles");
const router = express.Router();
router.get(
  "/getAllUsers/:pageNum/:searchQuery?",
  authenticateAdmin,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchQuery = req.params.searchQuery;
        if (searchQuery !== undefined) {
          res.send(
            await adminService.getAllUsers(
              pageNum,
              searchQuery,
              roles.User,
              req.user.id
            )
          );
        } else {
          res.send(
            await adminService.getAllUsers(
              pageNum,
              undefined,
              roles.User,
              req.user.id
            )
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
          res.send(
            await adminService.getAllUsers(pageNum, searchQuery, roles.Vet)
          );
        } else {
          res.send(
            await adminService.getAllUsers(pageNum, undefined, roles.Vet)
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
      if (user._id !== req.user.id) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
router.get(
  "/getVetsForModerationVerify/:pageNum",
  authenticateAdmin,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        res.send(await adminService.getVetsForModerationVerify(pageNum));
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.post("/editUser/:property", authenticateAdmin, async (req, res) => {
  const prop = req.params.property;
  if (
    prop == "fName" ||
    prop == "lName" ||
    prop == "email" ||
    prop == "city" ||
    prop == "phoneNumber" ||
    prop == "address" ||
    prop == "vetDescription" ||
    prop == "URN" ||
    prop == "typeAnimals"
  ) {
    if (req.body[prop] != undefined && req.body[prop] != "") {
      validation(req.body, editProfileSchema.getSchema(prop), res, async () => {
        if (req.body.id !== req.user.id) {
          res.send(
            await adminService.editUser(prop, req.body[prop], req.body.id)
          );
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
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
router.post("/changeProfilePhoto", authenticateAdmin, async (req, res) => {
  validation(req.body, changeProfilePhotoSchema, res, async () => {
    res.send(await adminService.changeProfilePhoto(req.body));
  });
});
router.post("/deleteThread", authenticateAdmin, async (req, res) => {
  validation(req.body, deleteThreadSchema, res, async () => {
    res.send(await adminService.deleteThread(req.body.threadId));
  });
});
router.post("/deleteThreadPost", authenticateAdmin, async (req, res) => {
  validation(req.body, deleteThreadPostSchema, res, async () => {
    res.send(
      await adminService.deleteThreadPost(req.body.threadId, req.body.postId)
    );
  });
});
module.exports = router;
