const decryptToken = require("../encryption/tokenEncryption").decryptToken;
const UserService = require("../services/user");
const userService = new UserService();
const roles = require("../models/roles");
const authenticateGetModerator = async function (req, res, next) {
  const token = req.query.token;
  if (token) {
    let data = decryptToken(token).split(";");
    if (data[0] !== "") {
      if (parseInt(data[1]) < parseInt(new Date().getTime() / 1000)) {
        res.sendStatus(401);
      } else {
        const role = await userService.getRole(data[0]);
        let user = { id: data[0], role: role };
        if (role === false) {
          res.sendStatus(401);
        } else if (role !== roles.Moderator) {
          res.sendStatus(403);
        } else {
          req.user = user;
          next();
        }
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticateGetModerator;
