const activateDeactivateProfileSchema = {
  id: "/activateDeactivateProfile",
  type: "object",
  properties: {
    id: { type: "string", pattern: "^[a-f\\d]{24}$" },
  },
  additionalProperties: false,
  required: ["id"],
};
module.exports = activateDeactivateProfileSchema;
