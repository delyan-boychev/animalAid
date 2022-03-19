const moderationVerifyVetSchema = {
  id: "/moderationVerifyVet",
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  additionalProperties: false,
  required: ["email"],
};
module.exports = moderationVerifyVetSchema;
