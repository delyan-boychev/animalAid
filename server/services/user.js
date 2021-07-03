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
            const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {expiresIn: "30m"});
            return accessToken;
        }
        else
        {
            return false;
        }
    }
}
module.exports = UserService;