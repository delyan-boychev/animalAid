const roles = require("../../roles");
const changeRoleSchema = {
  id: "/changeRole",
  type: "object",
  properties: {
    id: { type: "string", pattern: "^[a-f\\d]{24}$" },
    newRole: {
      type: "string",
      enum: [roles.Admin, roles.Moderator, roles.User],
    },
  },
  additionalProperties: false,
  required: ["id", "newRole"],
};
module.exports = changeRoleSchema;
