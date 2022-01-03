const animals = require("../../typeAnimals");
const getSchema = (prop) => {
  return schemas[prop];
};
const fName = {
  id: "/firstName",
  type: "object",
  properties: {
    fName: { type: "string", minLength: 2, maxLength: 50 },
  },
  additionalProperties: false,
  required: ["fName"],
};
const lName = {
  id: "/lastName",
  type: "object",
  properties: {
    lName: { type: "string", minLength: 2, maxLength: 50 },
  },
  additionalProperties: false,
  required: ["lName"],
};
const email = {
  id: "/email",
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  additionalProperties: false,
  required: ["email"],
};
const URN = {
  id: "/URN",
  type: "object",
  properties: {
    URN: { type: "string", pattern: `^([А-Я,а-я,\-,0-9]{2,20})\/([0-9]{4})$` },
  },
  additionalProperties: false,
  required: ["URN"],
};
const phoneNumber = {
  id: "/phoneNumber",
  type: "object",
  properties: {
    phoneNumber: { type: "string", pattern: "^\\+(?:[0-9]●?){6,14}[0-9]$" },
  },
  additionalProperties: false,
  required: ["phoneNumber"],
};
const city = {
  id: "/city",
  type: "object",
  properties: {
    city: { type: "string", minLength: 2, maxLength: 45 },
  },
  additionalProperties: false,
  required: ["city"],
};
const address = {
  id: "/address",
  type: "object",
  properties: {
    address: { type: "string", minLength: 2 },
  },
  additionalProperties: false,
  required: ["address"],
};
const vetDescription = {
  id: "/vetDescription",
  type: "object",
  properties: {
    vetDescription: { type: "string", minLength: 100, maxLength: 600 },
  },
  additionalProperties: false,
  required: ["vetDescription"],
};
const typeAnimals = {
  id: "/typeAnimals",
  type: "object",
  properties: {
    typeAnimals: {
      type: "array",
      items: {
        enum: [
          animals.Cats,
          animals.Dogs,
          animals.ExoticAnimals,
          animals.Birds,
        ],
      },
    },
  },
  additionalProperties: false,
  required: ["typeAnimals"],
};
const schemas = Object.freeze({
  fName: fName,
  lName: lName,
  email: email,
  phoneNumber: phoneNumber,
  city: city,
  address: address,
  vetDescription: vetDescription,
  URN: URN,
  typeAnimals: typeAnimals,
});
module.exports = { getSchema };
