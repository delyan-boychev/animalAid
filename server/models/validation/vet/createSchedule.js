const typeAppointments = require("../../typeAppointments");
const createScheduleSchema = (body) => {
  let schema = {
    id: "/createSchedule",
    type: "object",
    properties: {
      mon: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      tue: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      wed: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      thu: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      fri: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      sat: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      sun: {
        type: "object",
        properties: {
          working: { type: "boolean" },
        },
        additionalProperties: false,
        required: ["working"],
      },
      step: {
        type: "number",
        minimum: 0.25,
        maximum: 1,
        multipleOf: 0.25,
      },
      typeAppointments: {
        type: "array",
        items: {
          enum: Object.values(typeAppointments),
        },
      },
    },
    additionalProperties: false,
    required: [
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
      "sun",
      "step",
      "typeAppointments",
    ],
  };
  Object.keys(schema.properties).forEach((key) => {
    if (key !== "typeApointments" && key !== "step") {
      if (body[key]) {
        if (body[key].working === true) {
          schema.properties[key].properties["startHour"] = {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 24,
            multipleOf: 0.25,
          };
          schema.properties[key].properties["endHour"] = {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 24,
            multipleOf: 0.25,
          };
          schema.properties[key].required.push("startHour", "endHour");
          if (body[key]["pause"]) {
            schema.properties[key].properties["pause"] = {
              type: "object",
              properties: {
                startHour: {
                  type: "number",
                  minimum: 0,
                  exclusiveMaximum: 24,
                  multipleOf: 0.25,
                },
                endHour: {
                  type: "number",
                  minimum: 0,
                  exclusiveMaximum: 24,
                  multipleOf: 0.25,
                },
              },
              additionalProperties: false,
            };
          }
        }
      }
    }
  });
  return schema;
};
module.exports = createScheduleSchema;
