const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const config =  require("../config.json");
const User = require("../models/user");
const roles = require("../models/roles");
const e = require('express');
mongoose.connect(config.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
class UserRepository
{
    async registerUser(user)
    {
        if(await User.exists({email: user.email}))
        {
            return false;
        }
        else
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
            user.createdOn =  new Date().getTime().toString();
            user.role = roles[user.role];
            let u = new User(user);
            u.save();
            return true;
        }
    }
    async getProfile(email)
    {
        let user = await User.findOne({email: email}).exec();
        if(user==null)
        {
            return {};
        }
        else
        {
            user.password = undefined;
            return user;
        }
    }
    async loginUser(user)
    {
        const u = await User.findOne({email: user.email}).exec();
        if(u != null)
        {
            const checkPass = bcrypt.compareSync(user.password, u.password);
            if(checkPass)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
module.exports = UserRepository;