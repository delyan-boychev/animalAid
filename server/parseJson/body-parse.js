const simdjson = require("simdjson");
const bodyParse = async function (req, res, next) {
  let data = "";
  req.on("data", function (chunk) {
    data += chunk;
  });
  req.on("end", function () {
    if (data !== "") {
      if (Buffer.byteLength(data, "utf8") > 15728640) {
        res.sendStatus(400);
      } else {
        try {
          const body = simdjson.parse(data);
          req.body = body;
          next();
        } catch {
          res.sendStatus(400);
        }
      }
    } else {
      next();
    }
  });
};
module.exports = bodyParse;
