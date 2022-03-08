const typeAnimals = require("../../typeAnimals");
const typeAppointments = require("../../typeAppointments");
const createAppointmentSchema = {
  id: "/createAppointent",
  type: "object",
  properties: {
    vetId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    hour: { type: "string", pattern: "^[a-f\\d]{24}$" },
    date: {
      type: "string",
      pattern:
        /^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    },
    otherInfo: { type: "string", minLength: 15, maxLength: 200 },
    typeAnimal: { type: "string", enum: Object.values(typeAnimals) },
    typeAppointment: { type: "string", enum: Object.values(typeAppointments) },
  },
  additionalProperties: false,
  required: ["vetId", "hour", "date", "typeAnimal", "typeAppointment"],
};
module.exports = createAppointmentSchema;
