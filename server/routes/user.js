"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const validation = require("../models/validation/validation");
const userRegisterSchema = require("../models/validation/user/userRegister");
const vetRegisterSchema = require("../models/validation/user/vetRegister");
const userLoginSchema = require("../models/validation/user/userLogin");
const changeEmailSchema = require("../models/validation/user/changeEmail");
const changePasswordSchema = require("../models/validation/user/changePassword");
const forgotPasswordSchema = require("../models/validation/user/forgotPassword");
const forgotPasswordChangeSchema = require("../models/validation/user/forgotPasswordChange");
const changeProfilePhotoSchema = require("../models/validation/user/changeProfilePhoto");
const authenticate = require("../authentication/authenticate");
const editProfileSchema = require("../models/validation/user/editProfile");
const roles = require("../models/roles");
const router = express.Router();
const UserService = require("../services/user");
const userService = new UserService();
const apicache = require("apicache");
router.post("/regUser", async (req, res) => {
  validation(req.body, userRegisterSchema, res, async () => {
    res.send(await userService.registerUser(req.body));
  });
});
router.post("/regVet", async (req, res) => {
  validation(req.body, vetRegisterSchema, res, async () => {
    res.send(await userService.registerVet(req.body));
  });
});
router.get("/countUsersAndVets", async (req, res) => {
  res.send(await userService.countUsersAndVets());
});
router.get(
  "/img/:filename",
  apicache.middleware("1 hour"),
  async (req, res) => {
    const fileName = req.params.filename;
    let dir = `${path.dirname(require.main.filename)}/img`;
    if (fs.existsSync(`${dir}/${fileName}`)) {
      res.sendFile(`${dir}/${fileName}`);
    } else {
      res.sendStatus(404);
    }
  }
);
router.post("/log", async (req, res) => {
  validation(req.body, userLoginSchema, res, async () => {
    res.send(await userService.loginUser(req.body));
  });
});
router.get(
  "/getVets/:pageNum/:searchQuery?",
  authenticate,
  async (req, res) => {
    if (req.user.role !== roles.Vet) {
      try {
        const pageNum = parseInt(req.params.pageNum);
        if (pageNum > 0) {
          const searchQuery = req.params.searchQuery;
          if (searchQuery !== undefined) {
            res.send(
              await userService.getVets(
                pageNum,
                searchQuery,
                req.query.createAppointments === "true"
              )
            );
          } else {
            res.send(
              await userService.getVets(
                pageNum,
                undefined,
                req.query.createAppointments === "true"
              )
            );
          }
        } else {
          res.sendStatus(400);
        }
      } catch {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(403);
    }
  }
);
router.get(
  "/getVetsAroundMe/:pageNum/:searchQuery?",
  authenticate,
  async (req, res) => {
    if (req.user.role !== roles.Vet) {
      try {
        const pageNum = parseInt(req.params.pageNum);
        if (pageNum > 0) {
          const searchQuery = req.params.searchQuery;
          res.send(
            await userService.getVetsAroundUser(
              pageNum,
              req.user.id,
              searchQuery
            )
          );
        } else {
          res.sendStatus(400);
        }
      } catch {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(403);
    }
  }
);
router.get("/getVet/:id", authenticate, async (req, res) => {
  if (req.user.role !== roles.Vet) {
    if (req.params.id !== undefined && req.params.id !== "") {
      const vet = await userService.getVet(req.params.id);
      if (vet !== false) {
        res.send(vet);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(403);
  }
});
router.post("/verifyProfile", async (req, res) => {
  if (req.body.key && req.body.key != "") {
    res.send(await userService.verifyProfile(req.body.key));
  } else {
    res.sendStatus(400);
  }
});
router.post("/refreshToken", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace(
      "animalAidAuthorization ",
      ""
    );
    res.send(userService.refreshToken(token));
  } else {
    res.sendStatus(400);
  }
});
router.post("/edit/:property", authenticate, async (req, res) => {
  const prop = req.params.property;
  if (
    prop == "fName" ||
    prop == "lName" ||
    prop == "city" ||
    prop == "phoneNumber" ||
    (prop == "address" && req.user.role == roles.Vet) ||
    (prop == "vetDescription" && req.user.role == roles.Vet) ||
    (prop == "typeAnimals" && req.user.role == roles.Vet)
  ) {
    if (req.body[prop] != undefined && req.body[prop] != "") {
      validation(req.body, editProfileSchema.getSchema(prop), res, async () => {
        const isEdit = await userService.edit(
          prop,
          req.body[prop],
          req.user.id
        );
        if (isEdit) res.send(isEdit);
        else res.sendStatus(401);
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});
router.get("/profile", authenticate, async (req, res) => {
  const profile = await userService.getProfile(req.user["id"]);
  if (profile === false) {
    res.sendStatus(401);
  } else {
    res.send(profile);
  }
});
router.get("/userIdAndRole", authenticate, async (req, res) => {
  res.send({ id: req.user.id, role: req.user.role });
});
router.post("/changeEmail", authenticate, async (req, res) => {
  validation(req.body, changeEmailSchema, res, async () => {
    res.send(
      await userService.changeEmail(
        req.body["newEmail"],
        req.body["password"],
        req.user.id
      )
    );
  });
});
router.post("/changePassword", authenticate, async (req, res) => {
  validation(req.body, changePasswordSchema, res, async () => {
    res.send(
      await userService.changePassword(
        req.user["id"],
        req.body["oldPassword"],
        req.body["newPassword"]
      )
    );
  });
});
router.get("/validateForgetPasswordToken/:token", async (req, res) => {
  const validation = await userService.validateForgotPasswordToken(
    req.params.token
  );
  res.send(validation["isValid"]);
});
router.post("/requestForgotPassword", async (req, res) => {
  validation(req.body, forgotPasswordSchema, res, async () => {
    res.send(await userService.requestForgotPassword(req.body["email"]));
  });
});
router.post("/forgotPasswordChange", async (req, res) => {
  validation(req.body, forgotPasswordChangeSchema, res, async () => {
    res.send(
      await userService.forgotPasswordChange(
        req.body["token"],
        req.body["newPassword"]
      )
    );
  });
});
router.post("/changeProfilePhoto", authenticate, async (req, res) => {
  validation(req.body, changeProfilePhotoSchema, res, async () => {
    res.send(await userService.changeProfilePhoto(req.user.id, req.body));
  });
});
module.exports = router;
