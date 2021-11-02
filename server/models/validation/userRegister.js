const userRegisterSchema = {
  id: "/userRegister",
  type: "object",
  properties: {
    name: {
      first: { type: "string", minLength: 2, maxLength: 50 },
      last: { type: "string", minLength: 2, maxLength: 50 },
      required: ["first", "last"],
    },
    imgDataURL: {
      type: "string",
      pattern: "^data:([\\w/\\-\\.]+);(\\w+),(.*)$",
    },
    city: { type: "string", minLength: 2, maxLenght: 45 },
    password: { type: "string", minLength: 8, maxLength: 98 },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", pattern: "^\\+(?:[0-9]●?){6,14}[0-9]$" },
  },
  additionalProperties: false,
  required: ["name", "city", "imgDataURL", "password", "email", "phoneNumber"],
};
module.exports = userRegisterSchema;
