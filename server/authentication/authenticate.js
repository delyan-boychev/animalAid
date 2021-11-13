const config = require("../config.json");
const Cryptr = require("cryptr");
const UserService = require("../services/user");
const userService = new UserService();
const authenticate = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("animalAidAuthorization ", "");
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      let data = cryptr.decrypt(token).split(";");
      if (parseInt(data[1]) < parseInt(new Date().getTime() / 1000)) {
        res.sendStatus(401);
      } else {
        const role = await userService.getRole(data[0]);
        let user = { id: data[0], role: role };
        if (role === false) {
          res.sendStatus(401);
        } else {
          req.user = user;
          next();
        }
      }
    } catch {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticate;
