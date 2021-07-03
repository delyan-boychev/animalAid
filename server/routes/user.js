"use strict"
const express = require("express");
const Validator = require("jsonschema").Validator;
const userRegisterSchema = require("../models/validation/userRegister");
const userLoginSchema = require("../models/validation/userLogin");
const authenticateJWT = require("../authenticateJWT");
let router = express.Router();
const UserService = require("../services/user");
const userService = new UserService();
router.post("/reg", async (req, res)=>
{
    let v = new Validator();
    const valRes = v.validate(req.body, userRegisterSchema);
    if(valRes.valid)
    {
        res.send(await userService.registerUser(req.body));
    }
    else
    {
        res.sendStatus(400);
    }
});
router.post("/log", async (req, res)=>
{
    let v = new Validator();
    const valRes = v.validate(req.body, userLoginSchema);
    if(valRes.valid)
    {
        res.send(await userService.loginUser(req.body));
    }
    else
    {
        res.sendStatus(400);
    }
});
router.get("/test", authenticateJWT, (req, res)=>
{
    res.send(req.user);
});
module.exports = router;