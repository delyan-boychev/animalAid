const Validator = require("jsonschema").Validator;
const validation = (body, schema, res, success) => {
  let v = new Validator();
  const valRes = v.validate(body, schema);
  if (valRes.valid) {
    success();
  } else {
    res.sendStatus(400);
  }
};
module.exports = validation;
