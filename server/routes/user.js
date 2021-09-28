"use strict";
const express = require("express");
const Validator = require("jsonschema").Validator;
const userRegisterSchema = require("../models/validation/userRegister");
const vetRegisterSchema = require("../models/validation/vetRegister");
const userLoginSchema = require("../models/validation/userLogin");
const changeEmailSchema = require("../models/validation/changeEmail");
const changePasswordSchema = require("../models/validation/changePassword");
const forgotPasswordSchema = require("../models/validation/forgotPassword");
const forgotPasswordChangeSchema = require("../models/validation/forgotPasswordChange");
const authenticate = require("../authenticate");
const fs = require("fs");
const editProfileSchema = require("../models/validation/editProfile");
const path = require("path");
const roles = require("../models/roles");
let router = express.Router();
const UserService = require("../services/user");
const userService = new UserService();
router.post("/regUser", async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, userRegisterSchema);
  if (valRes.valid) {
    res.send(await userService.registerUser(req.body));
  } else {
    res.sendStatus(400);
  }
});
router.post("/regVet", async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, vetRegisterSchema);
  if (valRes.valid) {
    const filePath = path.join(
      __dirname,
      "../",
      "diplomas",
      req.body.diplomaFile
    );
    if (!fs.existsSync(filePath)) {
      res.send("NOT_VALID_DIPLOMA");
    } else {
      res.send(await userService.registerVet(req.body));
    }
  } else {
    res.sendStatus(400);
  }
});
router.post("/log", async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, userLoginSchema);
  if (valRes.valid) {
    res.send(await userService.loginUser(req.body));
  } else {
    res.sendStatus(400);
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
    (prop == "address" && req.user.role == roles.Vet)
  ) {
    if (req.body[prop] != undefined && req.body[prop] != "") {
      let v = new Validator();
      const valRes = v.validate(req.body, editProfileSchema.getSchema(prop));
      if (valRes.valid) {
        res.send(await userService.edit(prop, req.body[prop], req.user.email));
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});
router.get("/profile", authenticate, async (req, res) => {
  res.send(await userService.getProfile(req.user["email"]));
});
router.post("/changeEmail", authenticate, async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, changeEmailSchema);
  if (valRes.valid) {
    res.send(
      await userService.changeEmail(
        req.body["newEmail"],
        req.body["password"],
        req.user.email
      )
    );
  } else {
    res.sendStatus(400);
  }
});
router.post("/changePassword", authenticate, async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, changePasswordSchema);
  if (valRes.valid) {
    res.send(
      await userService.changePassword(
        req.user["email"],
        req.body["oldPassword"],
        req.body["newPassword"]
      )
    );
  } else {
    res.sendStatus(400);
  }
});
router.get("/validateForgetPasswordToken/:token", async (req, res) => {
  const validation = await userService.validateForgotPasswordToken(
    req.params.token
  );
  res.send(validation["isValid"]);
});
router.post("/requestForgotPassword", async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, forgotPasswordSchema);
  if (valRes.valid) {
    res.send(await userService.requestForgotPassword(req.body["email"]));
  } else {
    res.sendStatus(400);
  }
});
router.post("/forgotPasswordChange", async (req, res) => {
  let v = new Validator();
  const valRes = v.validate(req.body, forgotPasswordChangeSchema);
  if (valRes.valid) {
    res.send(
      await userService.forgotPasswordChange(
        req.body["token"],
        req.body["newPassword"]
      )
    );
  } else {
    res.sendStatus(400);
  }
});
module.exports = router;
