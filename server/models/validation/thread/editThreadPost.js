const editThreadPostSchema = {
  id: "/editThreadPost",
  type: "object",
  properties: {
    threadId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    postId: { type: "string", pattern: "^[a-f\\d]{24}$" },
    content: { type: "string", minLength: 10, maxLength: 600 },
  },
  additionalProperties: false,
  required: ["threadId", "postId", "content"],
};
module.exports = editThreadPostSchema;
