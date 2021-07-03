const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config();
const User = require("../models/user");
mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
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
            let u = new User(user);
            u.save();
            return true;
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