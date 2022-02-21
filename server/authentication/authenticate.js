const decryptToken = require("../tokenEncryption/decrypt");
const UserService = require("../services/user");
const userService = new UserService();
const authenticate = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.time("authenticate");
  if (authHeader) {
    const token = authHeader.replace("animalAidAuthorization ", "");
    console.time("authenticate3");
    let data = decryptToken(token).split(";");
    console.timeEnd("authenticate3");
    if (data[0] !== "") {
      if (parseInt(data[1]) < parseInt(new Date().getTime() / 1000)) {
        res.sendStatus(401);
      } else {
        console.time("authenticate2");
        const role = await userService.getRole(data[0]);
        console.timeEnd("authenticate2");
        let user = { id: data[0], role: role };
        if (role === false) {
          res.sendStatus(401);
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
  console.timeEnd("authenticate");
};
module.exports = authenticate;
