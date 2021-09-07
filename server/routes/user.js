"use strict"
const express = require("express");
const Validator = require("jsonschema").Validator;
const userRegisterSchema = require("../models/validation/userRegister");
const vetRegisterSchema = require("../models/validation/vetRegister");
const userLoginSchema = require("../models/validation/userLogin");
const authenticateJWT = require("../authenticate");
const fs = require('fs');
const editProfileSchema = require("../models/validation/editProfile");
const path = require("path");
const roles = require("../models/roles");
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
router.post("/verifyProfile", async (req, res)=>
{
    if(req.body.key && req.body.key != "")
    {
        res.send(await userService.verifyProfile(req.body.key));
    }
    else
    {
        res.sendStatus(400);
    }
});
router.post("/refreshToken", async (req, res)=>
{
    if(req.headers.authorization)
    {
        const token = req.headers.authorization.replace("animalAidAuthorization ", "");
        res.send(userService.refreshToken(token));
    }
    else
    {
        res.sendStatus(400);
    }
});
router.post("/edit/:property", authenticateJWT, async (req, res)=>
{
    const prop = req.params.property;
    if( prop == "fName" || prop == "lName" || prop == "city" || prop == "phoneNumber" || (prop == "address" && req.user.role == roles.Vet))
    {
        if(req.body[prop] != undefined && req.body[prop] != "")
        {
            let v = new Validator();
            const valRes = v.validate(req.body, editProfileSchema.getSchema(prop));
            if(valRes.valid)
            {
                res.send(await userService.edit(prop, req.body[prop], req.user.email));
            }
            else
            {
                res.sendStatus(400);
            }
        }
        else
        {
            res.sendStatus(400);
        }
    }
    else
    {
        res.sendStatus(400);
    }
    
});
router.get("/profile", authenticateJWT, async (req, res)=>
{
    res.send(await userService.getProfile(req.user["email"]));
});
module.exports = router;