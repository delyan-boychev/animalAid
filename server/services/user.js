const UserRepository = require("../repositories/user")
const jwt = require('jsonwebtoken');
const config =  require("../config.json");
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
            const accessToken = jwt.sign({ emailAnimalAid: user.email }, config.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }
        else
        {
            return false;
        }
    }
    async getProfile(email)
    {
        return await this.userRepository.getProfile(email);
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
            const accessToken = jwt.sign({ email: decoded.payload.emailAnimalAid }, config.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }   
    }
}
module.exports = UserService;