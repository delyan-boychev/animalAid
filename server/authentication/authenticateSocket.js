const decryptToken = require("../tokenEncryption/decrypt");
const UserService = require("../services/user");
const userService = new UserService();
const authenticate = async function (token) {
  if (token) {
    let data = decryptToken(token).split(";");
    if (data[0] !== "") {
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
    } else {
      return false;
    }
  } else {
    return false;
  }
};
module.exports = authenticate;
