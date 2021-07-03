const UserRepository = require("../repositories/user")
const jwt = require('jsonwebtoken');
require('dotenv').config();
class UserService
{
    userRepository = new UserRepository();
    async registerUser(user)
    {
        return this.userRepository.registerUser(user);
    }
    async loginUser(user)
    {
        const loggedIn = await this.userRepository.loginUser(user);
        if(loggedIn)
        {
            const accessToken = jwt.sign({ emailAnimalAid: user.email }, process.env.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }
        else
        {
            return false;
        }
    }
    refreshToken(token)
    {
        const decoded = jwt.decode(token, {complete: true});
        if(decoded == null)
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
            const accessToken = jwt.sign({ email: decoded.payload.emailAnimalAid }, process.env.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }   
    }
}
module.exports = UserService;