const typeAnimals = require("../../typeAnimals");
const vetRegisterSchema = {
  id: "/vetRegister",
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
    URN: { type: "string", pattern: `^([А-Я,а-я,\-,0-9]{2,20})\/([0-9]{4})$` },
    address: { type: "string", minLength: 2, maxLenght: 90 },
    vetDescription: { type: "string", minLength: 100, maxLength: 600 },
    typeAnimals: {
      type: "array",
      items: {
        enum: [
          typeAnimals.Cats,
          typeAnimals.Dogs,
          typeAnimals.ExoticAnimals,
          typeAnimals.Birds,
        ],
      },
    },
    city: { type: "string", pattern: "^[a-f\\d]{24}$" },
    password: { type: "string", minLength: 8, maxLength: 98 },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", pattern: "^\\+(?:[0-9]●?){6,14}[0-9]$" },
    captcha: {
      type: "string",
      pattern:
        "^[0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*]{6}$",
    },
    captchaCode: {
      type: "string",
      pattern:
        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$",
    },
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
    "URN",
    "captcha",
    "captchaCode",
  ],
};
module.exports = vetRegisterSchema;
