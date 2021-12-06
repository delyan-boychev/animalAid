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
    imageCrop: {
      x: { type: "number" },
      y: { type: "number" },
      width: { type: "number" },
      height: { type: "number" },
      required: ["x", "y", "width", "height"],
    },
    city: { type: "string", minLength: 2, maxLenght: 45 },
    password: { type: "string", minLength: 8, maxLength: 98 },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", pattern: "^\\+(?:[0-9]●?){6,14}[0-9]$" },
  },
  additionalProperties: false,
  required: [
    "name",
    "city",
    "imgDataURL",
    "imageCrop",
    "password",
    "email",
    "phoneNumber",
  ],
};
module.exports = userRegisterSchema;
