const editThreadSchema = {
  id: "/editThread",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    topic: { type: "string", minLength: 5, maxLength: 100 },
    description: { type: "string", minLength: 50, maxLength: 1500 },
  },
  additionalProperties: false,
  required: ["threadId", "topic", "description"],
};
module.exports = editThreadSchema;
