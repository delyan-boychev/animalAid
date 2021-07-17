"use strict"
const express = require("express");
const multer = require("multer");
const path =  require("path");
const UserService = require("../services/user");
const authenticateJWT = require("../authenticateJWTGetRequest");
const fs = require("fs");
const roles = require("../models/roles");
let router = express.Router();
const userService = new UserService();
const storage = multer.diskStorage(
    {
        destination: './diplomas/',
        filename: function ( req, file, cb ) {
            cb( null,'diploma-' + Date.now()+".pdf");
        }
    }
);
const upload = multer( { storage: storage, fileFilter: function(_req, file, cb){
    checkFileType(file, cb);
}} );
function checkFileType(file, cb){
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Pdf only!');
    }
  }
router.post("/upload", upload.single("diploma"), (req, res)=>
{
    try
    {
        res.send(req.file);
    }
    catch
    {
        res.sendCode(400);
    }
});
router.get("/:filename", authenticateJWT, async (req, res) =>
{
    if(req.user.role == roles.Admin || req.user.role == roles.Moderator)
    {
        const checkFileName = /^diploma-[0-9]{13}.pdf$/;
        if(checkFileName.test(req.params.filename))
        {
            let filePath = path.join(__dirname, '../' , "diplomas", req.params.filename);
            if(fs.existsSync(filePath))
            {
                fs.readFile(filePath, function (err,data){
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(data);
                });
            }
            else
            {
                res.sendStatus(404);
            }
        }
        else
        {
            res.sendStatus(400);
        }
    }
    else if(req.user.role == roles.Vet)
    {
        const checkFileName = /^diploma-[0-9]{13}.pdf$/;
        if(checkFileName.test(req.params.filename))
        {
            let filePath = path.join(__dirname, '../' , "diplomas", req.params.filename);
            if(fs.existsSync(filePath))
            {
                const diploma = await userService.getDiploma(req.user.emailAnimalAid);
                if(diploma !== false)
                {
                    if(diploma === req.params.filename)
                    {
                        fs.readFile(filePath, function (err,data){
                            res.setHeader('Content-Type', 'application/pdf');
                            res.send(data);
                        });
                    }
                    else
                    {
                        res.sendStatus(403);
                    }
                }
                else
                {
                    res.sendStatus(403);
                }
            }
            else
            {
                res.sendStatus(404);
            }
        }
        else
        {
            res.sendStatus(400);
        }
    }
    else
    {
        res.sendStatus(403);
    }
});
module.exports = router;