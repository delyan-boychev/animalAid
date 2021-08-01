const UserRepository = require("../repositories/user")
const jwt = require('jsonwebtoken');
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
                const cryptr = new Cryptr(config.JWT_ENCRYPTION_KEY);
                const data = cryptr.encrypt(JSON.stringify({ email: user.email, role: u.role }));
                const accessToken = jwt.sign({ data: data }, config.JWT_SECRET, {expiresIn: "30m"});
                return accessToken;
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
        const decoded = jwt.decode(token, {complete: true});
        if(decoded === null)
        {
            return false;
        }
        else
        {
            if(!decoded.payload.emailAnimalAid)
            {
                return false;
            }
            if (Date.now() < decoded.payload.exp * 1000) {
                return false;
            }
            const accessToken = jwt.sign({ data: decoded.payload.data }, config.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }
    }
    async edit(prop, value, email)
    {
        return await this.userRepository.edit(prop, value, email);
    }
}
module.exports = UserService;