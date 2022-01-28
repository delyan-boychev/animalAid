const replyToPostSchema = {
  id: "/createThreadPost",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    postId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    reply: { type: "string", minLength: 10, maxLength: 600 },
  },
  additionalProperties: false,
  required: ["threadId", "postId", "reply"],
};
module.exports = replyToPostSchema;
