const createThreadPostSchema = {
  id: "/createThreadPost",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    content: { type: "string", minLength: 10, maxLength: 600 },
    replyTo: { type: "integer", minimum: 0 },
  },
  additionalProperties: false,
  required: ["threadId", "content"],
};
module.exports = createThreadPostSchema;
