"use strict"
const express = require("express");
const Validator = require("jsonschema").Validator;
const userRegisterSchema = require("../models/validation/userRegister");
const vetRegisterSchema = require("../models/validation/vetRegister");
const userLoginSchema = require("../models/validation/userLogin");
const authenticateJWT = require("../authenticateJWT");
const fs = require('fs');
const path = require("path");
const API_URL = require("../config.json").API_URL;
let router = express.Router();
const UserService = require("../services/user");
const userService = new UserService();
router.post("/regUser", async (req, res)=>
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
router.post("/regVet", async (req, res)=>
{
    let v = new Validator();
    const valRes = v.validate(req.body, vetRegisterSchema);
    if(valRes.valid)
    {
        const filePath = path.join(__dirname, '../' , "diplomas", req.body.diplomaFile);
        if(!fs.existsSync(filePath))
        {
            res.send("NOT_VALID_DIPLOMA");
        }
        else
        {
            res.send(await userService.registerVet(req.body));
        }
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
router.post("/refreshToken", async (req, res)=>
{
    const token = req.headers.authorization.replace("animalAidAuthorization ", "");
    res.send(userService.refreshToken(token));
});
router.get("/getProfile", authenticateJWT, async (req, res)=>
{
    res.send(await userService.getProfile(req.user["emailAnimalAid"]));
});
module.exports = router;