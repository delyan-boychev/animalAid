const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const config =  require("../config.json");
const User = require("../models/user");
const roles = require("../models/roles");
mongoose.connect(config.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
class UserRepository
{
    async register(user)
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
            if(user.role == roles.Vet)
            {
                user.moderationVerified = false;
            }
            user.verified = false;
            let u = new User(user);
            u.save();
            return true;
        }
    }
    async checkUserExistsAndLastRequestForgotPassword(email)
    {
        let user = await User.findOne({email: email}).exec();
        if(user!=null)
        {
            if(user.lastRequestForgotPassword)
            {
                if(user.lastRequestForgotPassword+86400<parseInt(new Date().getTime()/1000))
                {
                    console.log(true);
                    return true;
                }
                else
                {
                    return "TOO_EARLY";
                }
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }
    async checkUserExistsAndLastForgotPassword(email)
    {
        let user = await User.findOne({email: email}).exec();
        if(user!=null)
        {
            if(user.lastForgotPassword)
            {
                if(user.lastForgotPassword+86400<parseInt(new Date().getTime()/1000))
                {
                    return true;
                }
                else
                {
                    return "TOO_EARLY";
                }
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }
    }
    async setLastRequestForgotPassword(email)
    {
        let user = await User.findOne({email: email}).exec();
        if(user!==null)
        { 
            user.lastRequestForgotPassword = parseInt(new Date().getTime()/1000);
            user.save();
            return true;
        }
        else
        {
            return false;
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
        if(u !== null)
        {
            const checkPass = bcrypt.compareSync(user.password, u.password);
            if(checkPass)
            {
                u.password = undefined;
                return u;
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
    async getDiploma(email)
    {
        const u = await User.findOne({email: email}).exec();
        if(u !== null)
        {
            return u.diplomaFile;
        }
        else
        {
            return false;
        }
    }
    async verify(email)
    {
        const u = await User.findOne({email: email}).exec();
        if(u!=null)
        {
            if(!u.verified)
            {
                u.verified = true;
                u.save();
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
    async moderationVerify(email)
    {
        const u = await User.findOne({email: email}).exec();
        if(u!=null)
        {
            if(u.role === roles.Vet)
            {
                if(!u.moderationVerified)
                {
                    u.moderationVerified = true;
                    u.save();
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
        else
        {
            return false;
        }
    }
    async changeEmail(user, newEmail)
    {
        const u = await User.findOne({email: user.email}).exec();
        if(u !== null)
        {
            const checkPass = bcrypt.compareSync(user.password, u.password);
            if(checkPass)
            {
                const u2 = await User.findOne({email: newEmail}).exec();
                if(u2 === null)
                {
                    u.email = newEmail;
                    u.verified = false;
                    u.save();
                    return true;
                }
                else
                {
                    return "EXISTS";
                }
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
    async changeForgotPassword(email, newPassword)
    {
        const u = await User.findOne({email: email}).exec();
        if(u !== null)
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);
            u.password = hash;
            u.lastForgotPassword = parseInt(new Date().getTime()/1000);
            u.lastRequestForgotPassword = u.lastForgotPassword;
            u.save();
            return true;
        }
        else
        {
            return false;
        }
    }
    async changePassword(email, oldPassword, newPassword)
    {
        const u = await User.findOne({email: email}).exec();
        if(u !== null)
        {
            const checkPass = bcrypt.compareSync(oldPassword, u.password);
            if(checkPass)
            {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                u.password = hash;
                u.save();
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
    async edit(prop, value, email)
    {
        const u = await User.findOne({email: email}).exec();
        if(u !== null)
        {
            switch(prop)
            {
                case "fName":
                    u.name.first = value;
                    break;
                case "lName":
                    u.name.last = value;
                    break;
                case "city":
                    u.city = value;
                    break;
                case "phoneNumber":
                    u.phoneNumber = value;
                    break;
                case "address":
                    u.address = value;
                    break;
                default:
                    return false;
            }
            u.save();
            return true;
        }
        else
        {
            return false;
        }

    }
}
module.exports = UserRepository;