const UserRepository = require("../repositories/user")
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require("fs");
const config =  require("../config.json");
class UserService
{
    userRepository = new UserRepository();
    async registerUser(user)
    {
        user.role = "User";
        return this.userRepository.register(user);
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
        return isReg;
    }
    async loginUser(user)
    {
        const loggedIn = await this.userRepository.loginUser(user);
        if(loggedIn !== false)
        {
            const accessToken = jwt.sign({ emailAnimalAid: user.email, role: loggedIn }, config.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
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
            const accessToken = jwt.sign({ emailAnimalAid: decoded.payload.emailAnimalAid, role: decoded.payload.role }, config.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }
    }
    async edit(prop, value, email)
    {
        return await this.userRepository.edit(prop, value, email);
    }
}
module.exports = UserService;