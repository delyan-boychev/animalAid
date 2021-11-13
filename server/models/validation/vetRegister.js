const typeAnimals = require("../typeAnimals");
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
    city: { type: "string", minLength: 2, maxLength: 45 },
    password: { type: "string", minLength: 8, maxLength: 98 },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", pattern: "^\\+(?:[0-9]●?){6,14}[0-9]$" },
  },
  additionalProperties: false,
  required: [
    "name",
    "city",
    "imgDataURL",
    "password",
    "email",
    "phoneNumber",
    "URN",
  ],
};
module.exports = vetRegisterSchema;
