const deleteThreadSchema = {
  id: "/deleteThread",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
  },
  additionalProperties: false,
  required: ["threadId"],
};
module.exports = deleteThreadSchema;
