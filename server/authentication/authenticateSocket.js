const config = require("../config.json");
const Cryptr = require("cryptr");
const UserService = require("../services/user");
const userService = new UserService();
const authenticate = async function (token) {
  if (token) {
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      let data = JSON.parse(cryptr.decrypt(token));
      if (data["exp"] < parseInt(new Date().getTime() / 1000)) {
        return false;
      } else {
        const role = await userService.getRole(data["user"]["id"]);
        data["user"]["role"] = role;
        if (role === false) {
          return false;
        } else {
          return data["user"];
        }
      }
    } catch {
      return false;
    }
  } else {
    return false;
  }
};
module.exports = authenticate;
