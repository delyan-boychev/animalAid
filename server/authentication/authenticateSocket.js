const config = require("../config.json");
const Cryptr = require("cryptr");
const UserService = require("../services/user");
const userService = new UserService();
const authenticate = async function (token) {
  if (token) {
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      let data = cryptr.decrypt(token).split(";");
      if (parseInt(data[1]) < parseInt(new Date().getTime() / 1000)) {
        return false;
      } else {
        const role = await userService.getRole(data[0]);
        let user = { id: data[0], role: role };
        if (role === false) {
          return false;
        } else {
          return user;
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
