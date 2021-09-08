const UserRepository = require("../repositories/user")
const path = require("path");
const fs = require("fs");
const config =  require("../config.json");
const nodemailer = require("nodemailer");
const verifyTemplates = require("../models/emailTemplates/verifyProfile");
const transportMail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bganimalaid@gmail.com",
      pass: "kcyatskxnwbxtfhx"
    }
  });
const Cryptr = require("cryptr");
const fromSender = "Animal Aid <bganimalaid@gmail.com>";
class UserService
{
    userRepository = new UserRepository();
    async registerUser(user)
    {
        user.role = "User";
        const isReg = await this.userRepository.register(user);
        if(isReg)
        {
            const cryptr = new Cryptr(config.ENCRYPTION_KEY);
            const key = cryptr.encrypt(user.email);
            transportMail.sendMail({
                from: fromSender,
                to: user.email,
                subject: "Успешна регистрация в Animal Aid",
                html: verifyTemplates.verifyProfileUser(user.name.first, key),
            });
        }
        return isReg;
    }
    async registerVet(user)
    {
        user.role = "Vet";
        const isReg = await this.userRepository.register(user);
        let filePath = path.join(__dirname, '../' , "diplomas", user.diplomaFile);
        if(!isReg)
        {
            fs.unlinkSync(filePath);
        }
        else
        {
            const cryptr = new Cryptr(config.ENCRYPTION_KEY);
            const key = cryptr.encrypt(user.email);
            transportMail.sendMail({
                from: fromSender,
                to: user.email,
                subject: "Успешна регистрация в Animal Aid",
                html: verifyTemplates.verifyProfileVet(user.name.first, key),
            });
        }
        return isReg;
    }
    async verifyProfile(key)
    {
        const cryptr = new Cryptr(config.ENCRYPTION_KEY);
        try
        {
            const email = cryptr.decrypt(key);
            return await this.userRepository.verify(email);
        }
        catch
        {
            return false;
        }
    }
    async loginUser(user)
    {
        const u = await this.userRepository.loginUser(user);
        if(u !== false)
        {
            if(u.verified)
            {
                const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
                const token = cryptr.encrypt(JSON.stringify({ user: {email: user.email, role: u.role}, exp: parseInt(new Date().getTime()/1000)+1800}));
                return token;
            }
            else
            {
                return "PROFILE_NOT_VERIFIED";
            }
        }
        else
        {
            return false;
        }
    }
    async getDiploma(email)
    {
        return await this.userRepository.getDiploma(email);
    }
    async getProfile(email)
    {
        return await this.userRepository.getProfile(email);
    }
    refreshToken(token)
    {
        const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
        try
        {
            const decoded = JSON.parse(cryptr.decrypt(token));
            if (decoded["exp"] > parseInt(new Date().getTime()/1000)) {
                return false;
            }
            else
            {
                const refreshToken = cryptr.encrypt(JSON.stringify({user:decoded["user"], exp: parseInt(new Date().getTime()/1000)+1800}));
                return refreshToken;
            }
        }
        catch
        {
            return false;
        }
    }
    async edit(prop, value, email)
    {
        return await this.userRepository.edit(prop, value, email);
    }
    async changeEmail(newEmail, password, oldEmail)
    {
        const changeEmailRes = await this.userRepository.changeEmail({email: oldEmail, password: password}, newEmail);
        if(changeEmailRes)
        {
            const cryptr = new Cryptr(config.ENCRYPTION_KEY);
            const key = cryptr.encrypt(newEmail);
            transportMail.sendMail({
                from: fromSender,
                to: newEmail,
                subject: "Смяна на имейл в Animal Aid",
                html: verifyTemplates.verifyProfileChangeEmail(key),
            });
            return true;
        }
        else
        {
            return false;
        }
    }
}
module.exports = UserService;