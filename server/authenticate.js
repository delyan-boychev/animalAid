const config = require("./config.json");
const Cryptr = require("cryptr");
const UserService = require("./services/user");
const userService = new UserService();
const authenticate = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("animalAidAuthorization ", "");
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      let data = JSON.parse(cryptr.decrypt(token));
      if (data["exp"] < parseInt(new Date().getTime() / 1000)) {
        res.sendStatus(401);
      } else {
        const role = await userService.getRole(data["user"]["email"]);
        data["user"]["role"] = role;
        if (role === false) {
          res.sendStatus(401);
        } else {
          req.user = data["user"];
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
